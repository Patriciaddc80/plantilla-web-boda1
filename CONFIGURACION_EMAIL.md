# 📧 Configuración de Email para Notificaciones RSVP

Este sistema envía automáticamente un email con toda la información cuando alguien confirma su asistencia.

## 🚀 Configuración Rápida

### Paso 1: Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# Configuración del Servidor
PORT=3001

# Configuración de Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación

# Email donde recibirás las notificaciones de RSVP
RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com
```

### Paso 2: Configurar Gmail (Recomendado)

1. **Activa la verificación en 2 pasos** en tu cuenta de Google:
   - Ve a: https://myaccount.google.com/security
   - Activa "Verificación en dos pasos"

2. **Genera una Contraseña de aplicación**:
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Ingresa un nombre (ej: "Boda RSVP")
   - Copia la contraseña generada (16 caracteres)

3. **Configura el archivo `.env`**:
   ```env
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de aplicación generada
   RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com
   ```

### Paso 3: Otros Servicios de Email

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@outlook.com
SMTP_PASS=tu-contraseña
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@yahoo.com
SMTP_PASS=tu-contraseña
```

#### SendGrid (Recomendado para producción)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=tu-api-key-de-sendgrid
RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com
```

## 📋 Información que se Envía

El email incluye:
- ✅ **Nombre completo** del invitado
- ✅ **Email de contacto**
- ✅ **Confirmación de asistencia** (Sí/No)
- ✅ **Número de invitados** (si confirma asistencia)
- ✅ **Mensaje adicional** (si lo proporcionó)
- ✅ **Fecha y hora** de la confirmación

## 🔧 Verificación

1. Asegúrate de que el archivo `.env` esté en la raíz del proyecto
2. Reinicia el servidor: `npm run server`
3. Envía un RSVP de prueba desde el formulario
4. Revisa tu bandeja de entrada

## ⚠️ Notas Importantes

- El archivo `.env` está en `.gitignore` y **NO se subirá a GitHub** por seguridad
- Si no configuras el email, el sistema seguirá funcionando pero solo guardará los datos en el archivo JSON
- Los emails se envían de forma asíncrona, no bloquean la respuesta al usuario

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica que estés usando una **Contraseña de aplicación** y no tu contraseña normal (en Gmail)
- Asegúrate de que la verificación en 2 pasos esté activada

### Error: "Connection timeout"
- Verifica que el puerto y host sean correctos
- Revisa tu firewall/antivirus

### No recibo emails
- Revisa la carpeta de spam
- Verifica que `RSVP_NOTIFICATION_EMAIL` esté configurado correctamente
- Revisa los logs del servidor para ver errores específicos

