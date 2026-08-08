import io

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from openpyxl import Workbook
from rest_framework.test import APIClient
from app.usuarios.models import Rol

User = get_user_model()


@override_settings(ROOT_URLCONF='core_project.urls')
class SeedUsuariosTest(TestCase):
    """El seed crea todos los roles y usuarios; el director es superusuario."""

    def test_seed_crea_roles_y_director_superusuario(self):
        for nombre in ['administrador', 'director', 'secretario', 'coordinador_egresados',
                       'profesor', 'egresado', 'estudiante']:
            Rol.objects.create(nombre=nombre)
        call_command('seed_usuarios')

        self.assertTrue(User.objects.filter(email='director@pisunpa.com').exists())
        self.assertTrue(User.objects.filter(email='secretario@pisunpa.com').exists())
        self.assertTrue(User.objects.filter(email='coordinador@pisunpa.com').exists())

        director = User.objects.get(email='director@pisunpa.com')
        self.assertTrue(director.is_superuser)
        self.assertTrue(director.is_staff)
        self.assertEqual(director.rol.nombre, 'director')

        coordinador = User.objects.get(email='coordinador@pisunpa.com')
        self.assertEqual(coordinador.rol.nombre, 'coordinador_egresados')

    def test_seed_egresado_tiene_perfil(self):
        for nombre in ['administrador', 'director', 'secretario', 'coordinador_egresados',
                       'profesor', 'egresado', 'estudiante']:
            Rol.objects.create(nombre=nombre)
        call_command('seed_usuarios')

        egresado = User.objects.get(email='egresado@pisunpa.com')
        self.assertTrue(hasattr(egresado, 'perfil_egresado'))
        self.assertEqual(
            egresado.perfil_egresado.numero_documento,
            'SEED-00000007',
        )


@override_settings(ROOT_URLCONF='core_project.urls')
class RegistroRestriccionDocenteTest(TestCase):
    """El registro público NO debe permitir rol docente.
    Solo /registro-docente/ debe habilitarlo."""

    def setUp(self):
        self.client = APIClient()
        self.rol_estudiante = Rol.objects.create(nombre='estudiante')
        self.rol_egresado = Rol.objects.create(nombre='egresado')
        self.rol_profesor = Rol.objects.create(nombre='profesor')
        from app.egresados.models import Programa
        self.programa = Programa.objects.create(nombre='Derecho')

    def test_registro_estudiante(self):
        response = self.client.post('/api/usuarios/registro-con-rol/', {
            'email': 'est@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'documento': '12345',
            'tipo_usuario': 'estudiante',
        }, format='json')
        self.assertEqual(response.status_code, 201)

    def test_registro_egresado(self):
        response = self.client.post('/api/usuarios/registro-con-rol/', {
            'email': 'egr@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'documento': '67890',
            'tipo_usuario': 'egresado',
            'programa_id': str(self.programa.id),
        }, format='json')
        self.assertEqual(response.status_code, 201)

    def test_registro_con_rol_rechaza_docente(self):
        response = self.client.post('/api/usuarios/registro-con-rol/', {
            'email': 'docente@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Test',
            'last_name': 'Docente',
            'documento': '99999',
            'tipo_usuario': 'docente',
        }, format='json')
        self.assertIn(response.status_code, [400, 403])

    def test_registro_docente_endpoint_si_funciona(self):
        response = self.client.post('/api/usuarios/registro-docente/', {
            'email': 'nuevodocente@test.com',
            'password': 'StrongPass1!',
            'password2': 'StrongPass1!',
            'first_name': 'Juan',
            'last_name': 'Perez',
            'documento_identidad': '88888',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='nuevodocente@test.com')
        self.assertEqual(user.rol.nombre, 'profesor')


@override_settings(ROOT_URLCONF='core_project.urls')
class RegistroEstadoPendienteTest(TestCase):
    """Tanto estudiantes como egresados deben quedar pendiente_aprobacion."""

    def setUp(self):
        self.client = APIClient()
        Rol.objects.create(nombre='estudiante')
        Rol.objects.create(nombre='egresado')

    def test_estudiante_queda_pendiente(self):
        self.client.post('/api/usuarios/registro-con-rol/', {
            'email': 'est@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Est',
            'last_name': 'Test',
            'documento': '11111',
            'tipo_usuario': 'estudiante',
        }, format='json')
        user = User.objects.get(email='est@test.com')
        self.assertEqual(user.estado, 'pendiente_aprobacion')

    def test_egresado_queda_pendiente(self):
        from app.egresados.models import Programa
        programa = Programa.objects.create(nombre='Medicina')
        self.client.post('/api/usuarios/registro-con-rol/', {
            'email': 'egr@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Egr',
            'last_name': 'Test',
            'documento': '22222',
            'tipo_usuario': 'egresado',
            'programa_id': str(programa.id),
        }, format='json')
        user = User.objects.get(email='egr@test.com')
        self.assertEqual(user.estado, 'pendiente_aprobacion')


@override_settings(ROOT_URLCONF='core_project.urls')
class AprobacionRechazoTest(TestCase):
    """Flujo de aprobación/rechazo de solicitudes pendientes."""

    def setUp(self):
        self.client = APIClient()
        rol_admin = Rol.objects.create(nombre='administrador')
        self.admin = User.objects.create_user(
            username='admin@test.com', email='admin@test.com',
            password='admin123', documento='001', rol=rol_admin,
            estado='aprobado',
        )
        rol_est = Rol.objects.create(nombre='estudiante')
        self.estudiante = User.objects.create_user(
            username='est@test.com', email='est@test.com',
            password='test123', documento='002', rol=rol_est,
            estado='pendiente_aprobacion',
        )
        self.client.force_authenticate(user=self.admin)

    def test_listar_pendientes(self):
        response = self.client.get('/api/usuarios/estudiantes-pendientes/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_aprobar_estudiante(self):
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/aprobar/'
        )
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertEqual(self.estudiante.estado, 'aprobado')

    def test_rechazar_estudiante(self):
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/rechazar/'
        )
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertEqual(self.estudiante.estado, 'rechazado')


@override_settings(ROOT_URLCONF='core_project.urls')
class PromocionEstudianteAEgresadoTest(TestCase):
    """Promover estudiante a egresado preservando el UUID."""

    def setUp(self):
        self.client = APIClient()
        rol_admin = Rol.objects.create(nombre='administrador')
        self.admin = User.objects.create_user(
            username='admin@test.com', email='admin@test.com',
            password='admin123', documento='001', rol=rol_admin,
            estado='aprobado',
        )
        rol_est = Rol.objects.create(nombre='estudiante')
        Rol.objects.create(nombre='egresado')
        self.estudiante = User.objects.create_user(
            username='est@test.com', email='est@test.com',
            password='test123', documento='002', rol=rol_est,
            estado='aprobado',
        )
        self.client.force_authenticate(user=self.admin)

    def test_promover_cambia_rol_y_preserva_uuid(self):
        uuid_original = self.estudiante.id
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/promover-egresado/',
            {},
            format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertEqual(self.estudiante.rol.nombre, 'egresado')
        self.assertEqual(self.estudiante.id, uuid_original)
        self.assertTrue(hasattr(self.estudiante, 'perfil_egresado'))


@override_settings(ROOT_URLCONF='core_project.urls')
class ProgramasSinDuplicadosTest(TestCase):
    """El endpoint de programas no debe devolver duplicados."""

    def setUp(self):
        from app.egresados.models import Programa
        Programa.objects.create(nombre='Ingeniería de Sistemas')
        Programa.objects.create(nombre='Derecho')
        Programa.objects.create(nombre='Medicina')

    def test_programas_unicos(self):
        client = APIClient()
        response = client.get('/api/egresados/programas/')
        self.assertEqual(response.status_code, 200)
        nombres = [p['nombre'] for p in response.data]
        self.assertEqual(len(nombres), len(set(nombres)))


@override_settings(ROOT_URLCONF='core_project.urls')
class GestionUsuariosTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.rol_admin = Rol.objects.create(nombre='administrador')
        self.rol_director = Rol.objects.create(nombre='director')
        self.rol_secretario = Rol.objects.create(nombre='secretario')
        self.rol_estudiante = Rol.objects.create(nombre='estudiante')
        Rol.objects.create(nombre='coordinador_egresados')

        self.admin = User.objects.create_user(
            username='admin@test.com', email='admin@test.com',
            password='admin123', documento='A01', rol=self.rol_admin,
            estado='aprobado',
        )
        self.director = User.objects.create_user(
            username='dir@test.com', email='dir@test.com',
            password='dir123', documento='A02', rol=self.rol_director,
            estado='aprobado', is_superuser=True, is_staff=True,
        )
        self.secretario = User.objects.create_user(
            username='sec@test.com', email='sec@test.com',
            password='sec123', documento='A03', rol=self.rol_secretario,
            estado='aprobado',
        )
        self.estudiante = User.objects.create_user(
            username='est@test.com', email='est@test.com',
            password='est123', documento='A04', rol=self.rol_estudiante,
            estado='aprobado',
        )

    def test_listar_usuarios_requiere_admin_lectura(self):
        self.client.force_authenticate(user=self.secretario)
        response = self.client.get('/api/usuarios/usuarios/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 4)

    def test_listar_usuarios_rechaza_estudiante(self):
        self.client.force_authenticate(user=self.estudiante)
        response = self.client.get('/api/usuarios/usuarios/')
        self.assertEqual(response.status_code, 403)

    def test_listar_filtra_por_q(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/usuarios/usuarios/?q=est@test.com')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['email'], 'est@test.com')

    def test_cambiar_rol_por_administrador(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/rol/',
            {'rol': 'secretario'}, format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertEqual(self.estudiante.rol.nombre, 'secretario')

    def test_admin_no_puede_cambiar_rol_del_director(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.director.id}/rol/',
            {'rol': 'secretario'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_no_puede_cambiarse_propio_rol(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.admin.id}/rol/',
            {'rol': 'director'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_secretario_no_puede_cambiar_rol(self):
        self.client.force_authenticate(user=self.secretario)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/rol/',
            {'rol': 'secretario'}, format='json'
        )
        self.assertEqual(response.status_code, 403)

    def test_crear_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'nuevo.admin@test.com',
            'first_name': 'Nuevo',
            'last_name': 'Admin',
            'documento': 'A99',
            'password': 'StrongPass1!',
            'rol': 'coordinador_egresados',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        usuario = User.objects.get(email='nuevo.admin@test.com')
        self.assertEqual(usuario.rol.nombre, 'coordinador_egresados')
        self.assertEqual(usuario.estado, 'aprobado')

    def test_crear_admin_no_acepta_director(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'falso.director@test.com',
            'first_name': 'Falso',
            'last_name': 'Director',
            'documento': 'A98',
            'password': 'StrongPass1!',
            'rol': 'director',
        }, format='json')
        self.assertEqual(response.status_code, 400)


@override_settings(ROOT_URLCONF='core_project.urls')
class NotificacionFanOutTest(TestCase):
    def setUp(self):
        from app.usuarios.models import Notificacion
        self.Notificacion = Notificacion
        self.rol_secretario = Rol.objects.create(nombre='secretario')
        self.rol_coordinador = Rol.objects.create(nombre='coordinador_egresados')
        self.rol_egresado = Rol.objects.create(nombre='egresado')
        self.secretario = User.objects.create_user(
            username='sec@test.com', email='sec@test.com',
            password='sec123', documento='F01', rol=self.rol_secretario,
            estado='aprobado',
        )
        self.coordinador = User.objects.create_user(
            username='coord@test.com', email='coord@test.com',
            password='coord123', documento='F02', rol=self.rol_coordinador,
            estado='aprobado',
        )
        self.egresado = User.objects.create_user(
            username='egr@test.com', email='egr@test.com',
            password='egr123', documento='F03', rol=self.rol_egresado,
            estado='aprobado',
        )

    def test_crear_hace_fan_out_a_roles(self):
        from app.usuarios.notification_service import NotificacionService
        NotificacionService.crear(
            usuario=self.egresado,
            titulo='Evento nuevo',
            mensaje='Se creó un evento.',
            tipo='evento_creado',
            roles_broadcast=['secretario', 'coordinador_egresados'],
        )
        self.assertTrue(
            self.Notificacion.objects.filter(usuario=self.secretario).exists()
        )
        self.assertTrue(
            self.Notificacion.objects.filter(usuario=self.coordinador).exists()
        )
        self.assertTrue(
            self.Notificacion.objects.filter(usuario=self.egresado).exists()
        )

    def test_broadcast_no_duplica_ni_incluye_no_roles(self):
        from app.usuarios.notification_service import NotificacionService
        NotificacionService.crear(
            usuario=self.secretario,
            titulo='Prueba',
            mensaje='Mensaje',
            tipo='evento_inscripcion',
            roles_broadcast=['secretario', 'coordinador_egresados'],
        )
        self.assertEqual(
            self.Notificacion.objects.filter(usuario=self.secretario).count(), 1
        )
        self.assertFalse(
            self.Notificacion.objects.filter(usuario=self.egresado).exists()
        )

    def test_default_broadcast_es_secretario(self):
        from app.usuarios.notification_service import NotificacionService
        NotificacionService.crear(
            usuario=self.egresado,
            titulo='Inscripción',
            mensaje='Te inscribiste.',
            tipo='evento_inscripcion',
        )
        self.assertTrue(
            self.Notificacion.objects.filter(usuario=self.secretario).exists()
        )


@override_settings(ROOT_URLCONF='core_project.urls')
class NotificacionesTest(TestCase):
    """Conteo y marcado de notificaciones."""

    def setUp(self):
        self.client = APIClient()
        rol = Rol.objects.create(nombre='administrador')
        self.user = User.objects.create_user(
            username='notif@test.com', email='notif@test.com',
            password='test123', documento='003', rol=rol,
            estado='aprobado',
        )
        self.client.force_authenticate(user=self.user)
        from app.usuarios.models import Notificacion
        Notificacion.objects.create(
            usuario=self.user, titulo='Test 1', mensaje='Mensaje 1',
            tipo='solicitud_creada',
        )
        Notificacion.objects.create(
            usuario=self.user, titulo='Test 2', mensaje='Mensaje 2',
            tipo='solicitud_aprobada', leido=True,
        )

    def test_contar_no_leidas(self):
        response = self.client.get('/api/usuarios/notificaciones/contar-no-leidas/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_listar_notificaciones(self):
        response = self.client.get('/api/usuarios/notificaciones/')
        self.assertEqual(response.status_code, 200)

    def test_marcar_como_leida(self):
        from app.usuarios.models import Notificacion
        notif = Notificacion.objects.filter(leido=False).first()
        response = self.client.patch(f'/api/usuarios/notificaciones/{notif.id}/leer/')
        self.assertEqual(response.status_code, 200)
        notif.refresh_from_db()
        self.assertTrue(notif.leido)


@override_settings(ROOT_URLCONF='core_project.urls')
class GestionRolesJerarquiaTest(TestCase):
    """Jerarquía de gestión de roles: admin vs director."""

    def setUp(self):
        self.client = APIClient()
        self.rol_admin = Rol.objects.create(nombre='administrador')
        self.rol_director = Rol.objects.create(nombre='director')
        self.rol_secretario = Rol.objects.create(nombre='secretario')
        self.rol_coordinador = Rol.objects.create(nombre='coordinador_egresados')
        self.rol_estudiante = Rol.objects.create(nombre='estudiante')
        self.rol_profesor = Rol.objects.create(nombre='profesor')

        self.admin = User.objects.create_user(
            username='admin@test.com', email='admin@test.com',
            password='admin123', documento='J01', rol=self.rol_admin,
            estado='aprobado',
        )
        self.director = User.objects.create_user(
            username='dir@test.com', email='dir@test.com',
            password='dir123', documento='J02', rol=self.rol_director,
            estado='aprobado', is_superuser=True, is_staff=True,
        )
        self.coordinador = User.objects.create_user(
            username='coord@test.com', email='coord@test.com',
            password='coord123', documento='J03', rol=self.rol_coordinador,
            estado='aprobado',
        )
        self.estudiante = User.objects.create_user(
            username='est@test.com', email='est@test.com',
            password='est123', documento='J04', rol=self.rol_estudiante,
            estado='aprobado',
        )
        self.otro_admin = User.objects.create_user(
            username='admin2@test.com', email='admin2@test.com',
            password='admin2', documento='J05', rol=self.rol_admin,
            estado='aprobado',
        )

    def test_admin_no_puede_asignar_rol_administrador(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/rol/',
            {'rol': 'administrador'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_admin_no_puede_rebajar_cuenta_administrador(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.otro_admin.id}/rol/',
            {'rol': 'secretario'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_admin_cambia_rol_de_coordinador(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.coordinador.id}/rol/',
            {'rol': 'secretario'}, format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.coordinador.refresh_from_db()
        self.assertEqual(self.coordinador.rol.nombre, 'secretario')

    def test_director_eleva_a_administrador(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.coordinador.id}/rol/',
            {'rol': 'administrador'}, format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.coordinador.refresh_from_db()
        self.assertEqual(self.coordinador.rol.nombre, 'administrador')

    def test_director_rebaja_cuenta_administrador(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.otro_admin.id}/rol/',
            {'rol': 'coordinador_egresados'}, format='json'
        )
        self.assertEqual(response.status_code, 200)
        self.otro_admin.refresh_from_db()
        self.assertEqual(self.otro_admin.rol.nombre, 'coordinador_egresados')

    def test_admin_no_puede_crear_cuenta_administrador(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'nuevo.admin2@test.com',
            'first_name': 'Nuevo',
            'last_name': 'Admin',
            'documento': 'J98',
            'password': 'StrongPass1!',
            'rol': 'administrador',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_director_puede_crear_cuenta_administrador(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'admin3@test.com',
            'first_name': 'Admin',
            'last_name': 'Tres',
            'documento': 'J97',
            'password': 'StrongPass1!',
            'rol': 'administrador',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        usuario = User.objects.get(email='admin3@test.com')
        self.assertEqual(usuario.rol.nombre, 'administrador')

    def test_director_no_puede_crear_cuenta_director(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'falso.director2@test.com',
            'first_name': 'Falso',
            'last_name': 'Director',
            'documento': 'J96',
            'password': 'StrongPass1!',
            'rol': 'director',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_director_no_puede_asignar_rol_director(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.coordinador.id}/rol/',
            {'rol': 'director'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_admin_no_puede_asignar_rol_director(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.coordinador.id}/rol/',
            {'rol': 'director'}, format='json'
        )
        self.assertEqual(response.status_code, 400)

    def test_admin_no_puede_crear_cuenta_estudiante(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'est.nuevo@test.com',
            'first_name': 'Estudiante',
            'last_name': 'Nuevo',
            'documento': 'J95',
            'password': 'StrongPass1!',
            'rol': 'estudiante',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_director_no_puede_crear_cuenta_egresado(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'egresado.nuevo@test.com',
            'first_name': 'Egresado',
            'last_name': 'Nuevo',
            'documento': 'J94',
            'password': 'StrongPass1!',
            'rol': 'egresado',
        }, format='json')
        self.assertEqual(response.status_code, 400)

    def test_director_puede_crear_cuenta_profesor(self):
        self.client.force_authenticate(user=self.director)
        response = self.client.post('/api/usuarios/usuarios/crear-admin/', {
            'email': 'prof.nuevo@test.com',
            'first_name': 'Profesor',
            'last_name': 'Nuevo',
            'documento': 'J93',
            'password': 'StrongPass1!',
            'rol': 'profesor',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        usuario = User.objects.get(email='prof.nuevo@test.com')
        self.assertEqual(usuario.rol.nombre, 'profesor')


@override_settings(ROOT_URLCONF='core_project.urls')
class EstudiantesGestionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.rol_admin = Rol.objects.create(nombre='administrador')
        self.rol_estudiante = Rol.objects.create(nombre='estudiante')
        self.rol_egresado = Rol.objects.create(nombre='egresado')

        from app.egresados.models import Programa
        self.programa = Programa.objects.create(nombre='Derecho')

        self.admin = User.objects.create_user(
            username='admin@p.com', email='admin@p.com', password='x',
            documento='A1', rol=self.rol_admin, estado='aprobado')
        self.estudiante = User.objects.create_user(
            username='ana@p.com', email='ana@p.com', password='x',
            first_name='Ana', last_name='López', documento='A2',
            rol=self.rol_estudiante, estado='aprobado', programa=self.programa)
        User.objects.create_user(
            username='leo@p.com', email='leo@p.com', password='x',
            first_name='Leo', last_name='Pérez', documento='A3',
            rol=self.rol_estudiante, estado='pendiente_aprobacion')
        User.objects.create_user(
            username='eg@p.com', email='eg@p.com', password='x',
            first_name='Eva', last_name='Ríos', documento='A4',
            rol=self.rol_egresado, estado='aprobado')

        self.client.force_authenticate(user=self.admin)

    def _build_xlsx(self, rows):
        wb = Workbook()
        ws = wb.active
        for i, row in enumerate(rows, start=3):
            for j, val in enumerate(row):
                ws.cell(row=i, column=j + 1, value=val)
        buf = io.BytesIO()
        wb.save(buf)
        buf.seek(0)
        return SimpleUploadedFile(
            'estudiantes.xlsx', buf.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    def test_lista_solo_estudiantes_aprobados(self):
        response = self.client.get('/api/usuarios/estudiantes/')
        self.assertEqual(response.status_code, 200)
        ids = [u['id'] for u in response.json()]
        self.assertEqual(ids, [str(self.estudiante.id)])

    def test_lista_filtra_por_q_y_programa(self):
        response = self.client.get('/api/usuarios/estudiantes/?q=Ana')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        response = self.client.get('/api/usuarios/estudiantes/?q=inexistente')
        self.assertEqual(len(response.json()), 0)
        response = self.client.get(f'/api/usuarios/estudiantes/?programa={self.programa.id}')
        self.assertEqual(len(response.json()), 1)

    def test_lista_devuelve_programa(self):
        response = self.client.get('/api/usuarios/estudiantes/')
        data = response.json()[0]
        self.assertEqual(data['programa'], {'id': str(self.programa.id), 'nombre': 'Derecho'})

    def test_import_crea_estudiantes_aprobados(self):
        archivo = self._build_xlsx([
            ['Juan Pérez', 'juan@p.com', 'Derecho'],
            ['María García', 'maria@p.com', None],
        ])
        response = self.client.post('/api/usuarios/estudiantes/importar/', {'archivo': archivo}, format='multipart')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['creados'], 2)
        self.assertEqual(data['duplicados'], 0)
        juan = User.objects.get(email='juan@p.com')
        self.assertEqual(juan.estado, 'aprobado')
        self.assertEqual(juan.rol.nombre, 'estudiante')
        self.assertEqual(juan.programa.nombre, 'Derecho')

    def test_import_duplicados_y_emails_invalidos(self):
        archivo = self._build_xlsx([
            ['Ana López', 'ana@p.com', None],
            ['Otro', 'otro@p.com', None],
        ])
        response = self.client.post('/api/usuarios/estudiantes/importar/', {'archivo': archivo}, format='multipart')
        data = response.json()
        self.assertEqual(data['creados'], 1)
        self.assertEqual(data['duplicados'], 1)

        archivo2 = self._build_xlsx([['Mal', 'no-es-email', None]])
        response2 = self.client.post('/api/usuarios/estudiantes/importar/', {'archivo': archivo2}, format='multipart')
        self.assertEqual(response2.json()['creados'], 0)
        self.assertTrue(any('Email inválido' in e for e in response2.json()['errores']))

    def test_cambiar_programa(self):
        from app.egresados.models import Programa as ProgramaModel
        nuevo = ProgramaModel.objects.create(nombre='Ingeniería')
        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/programa/',
            {'programa': str(nuevo.id)}, format='json')
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertEqual(self.estudiante.programa, nuevo)

        response = self.client.patch(
            f'/api/usuarios/usuarios/{self.estudiante.id}/programa/',
            {'programa': None}, format='json')
        self.assertEqual(response.status_code, 200)
        self.estudiante.refresh_from_db()
        self.assertIsNone(self.estudiante.programa)
