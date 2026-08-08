from django.db import migrations

VIEJO = 'coordinador'
NUEVO = 'coordinador_egresados'


def renombrar_rol(apps, schema_editor):
    Rol = apps.get_model('usuarios', 'Rol')
    Usuario = apps.get_model('usuarios', 'Usuario')
    viejo = Rol.objects.filter(nombre=VIEJO).first()
    nuevo = Rol.objects.filter(nombre=NUEVO).first()
    if viejo and nuevo:
        Usuario.objects.filter(rol=viejo).update(rol=nuevo)
        viejo.delete()
    elif viejo:
        viejo.nombre = NUEVO
        viejo.save(update_fields=['nombre'])


def revertir(apps, schema_editor):
    Rol = apps.get_model('usuarios', 'Rol')
    nuevo = Rol.objects.filter(nombre=NUEVO).first()
    if nuevo and not Rol.objects.filter(nombre=VIEJO).exists():
        nuevo.nombre = VIEJO
        nuevo.save(update_fields=['nombre'])


class Migration(migrations.Migration):
    dependencies = [
        ('usuarios', '0002_notificacion_evento_alter_notificacion_tipo'),
    ]
    operations = [
        migrations.RunPython(renombrar_rol, revertir),
    ]
