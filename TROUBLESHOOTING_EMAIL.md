# 🔍 Solución de Problemas - Sistema de Email

## ❌ El email no llega después de enviar un RSVP

### Paso 1: Verificar que el servidor esté corriendo

**En desarrollo local:**
```bash
npm run server
```

O si usas ambos (frontend + backend):
```bash
npm run dev:all
```

**Verifica que veas en la consola:**
```
✅ Servidor corriendo en http://localhost:3001
```

### Paso 2: Verificar la configuración de email

Abre el archivo `.env` y verifica que tenga:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com
```

**⚠️ Importante:**
- `SMTP_PASS` debe ser una **Contraseña de aplicación** de Gmail, NO tu contraseña normal
- Para crear una contraseña de aplicación: [Ver guía en CONFIGURACION_EMAIL.md](./CONFIGURACION_EMAIL.md)

### Paso 3: Probar el envío de email directamente

Ejecuta el script de prueba:
```bash
npm run test:email
```

**Si funciona:** Verás:
```
✅ Email enviado correctamente!
📬 Message ID: <...>
```

**Si NO funciona:** Verás el error específico que te ayudará a identificar el problema.

### Paso 4: Verificar los logs del servidor

Cuando envíes un RSVP, **observa la consola del servidor** (donde corre `npm run server`).

**Deberías ver:**
```
📧 Iniciando proceso de envío de email...
📧 Email destinatario configurado: tu-email@gmail.com
📧 Datos del RSVP: {...}
📤 Enviando email de notificación...
📧 Intentando enviar email a: tu-email@gmail.com
🔍 Verificando conexión SMTP...
✅ Conexión SMTP verificada correctamente
📤 Enviando email...
✅ Email enviado correctamente!
📬 Message ID: <...>
✅ Email de notificación enviado correctamente
```

**Si ves errores:**
- `❌ Error al verificar conexión SMTP` → Problema con las credenciales
- `❌ No se configuró RSVP_NOTIFICATION_EMAIL` → Falta la variable de entorno
- `❌ Error al enviar email` → Revisa el mensaje de error específico

### Paso 5: Verificar la bandeja de entrada

1. **Revisa la carpeta de Spam/Correo no deseado**
2. **Busca emails de:** `"Boda Manuela & Daniel" <tu-email@gmail.com>`
3. **Asunto:** `💐 Nueva Confirmación de Asistencia - [Nombre]`

### Paso 6: Errores comunes y soluciones

#### Error: "EAUTH" o "Invalid login"
- **Causa:** Contraseña incorrecta o no es una contraseña de aplicación
- **Solución:** Crea una nueva contraseña de aplicación en Gmail

#### Error: "No se configuró RSVP_NOTIFICATION_EMAIL"
- **Causa:** Falta la variable de entorno
- **Solución:** Agrega `RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com` al `.env`

#### Error: "Connection timeout"
- **Causa:** Problema de red o firewall
- **Solución:** Verifica tu conexión a internet

#### El servidor no muestra ningún log de email
- **Causa:** El servidor no está corriendo o el RSVP no está llegando al backend
- **Solución:** 
  1. Verifica que el servidor esté corriendo
  2. Verifica que el frontend esté apuntando a `http://localhost:3001` (o usando el proxy de Vite)

### Paso 7: Verificar en producción (Vercel)

Si estás probando en Vercel:

1. **Verifica las variables de entorno en Vercel Dashboard:**
   - Settings → Environment Variables
   - Deben estar configuradas: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RSVP_NOTIFICATION_EMAIL`

2. **Revisa los logs de Vercel:**
   - Ve a tu proyecto en Vercel Dashboard
   - Deployments → Selecciona el último deployment → Functions → Ver logs

3. **Verifica que la base de datos KV esté creada** (si usas Vercel KV)

## 📞 ¿Necesitas más ayuda?

Si después de seguir estos pasos el problema persiste:

1. **Copia los logs completos** del servidor cuando intentas enviar un RSVP
2. **Ejecuta** `npm run test:email` y copia la salida completa
3. **Verifica** que el archivo `.env` tenga todas las variables correctas (sin mostrar la contraseña)

