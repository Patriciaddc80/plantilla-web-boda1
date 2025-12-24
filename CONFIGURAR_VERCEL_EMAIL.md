# 📧 Configurar Email en Vercel (Producción)

## ⚠️ Problema: Los emails no llegan en producción

Si el formulario funciona en local pero **NO en la web (Vercel)**, es porque las variables de entorno SMTP no están configuradas en Vercel.

## 🔧 Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Acceder a Vercel Dashboard

1. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **plantilla-web-boda1**

### Paso 2: Configurar Variables de Entorno

1. En tu proyecto, ve a **Settings** (Configuración)
2. En el menú lateral, haz clic en **Environment Variables** (Variables de Entorno)
3. Agrega las siguientes variables **UNA POR UNA**:

#### Variable 1: SMTP_HOST
- **Name:** `SMTP_HOST`
- **Value:** `smtp.gmail.com`
- **Environment:** Selecciona todas (Production, Preview, Development)
- Haz clic en **Save**

#### Variable 2: SMTP_PORT
- **Name:** `SMTP_PORT`
- **Value:** `587`
- **Environment:** Selecciona todas (Production, Preview, Development)
- Haz clic en **Save**

#### Variable 3: SMTP_SECURE
- **Name:** `SMTP_SECURE`
- **Value:** `false`
- **Environment:** Selecciona todas (Production, Preview, Development)
- Haz clic en **Save**

#### Variable 4: SMTP_USER
- **Name:** `SMTP_USER`
- **Value:** `patriciaddc80@gmail.com` (tu email de Gmail)
- **Environment:** Selecciona todas (Production, Preview, Development)
- Haz clic en **Save**

#### Variable 5: SMTP_PASS
- **Name:** `SMTP_PASS`
- **Value:** `yztmsaaddvymjzzr` (tu contraseña de aplicación de Gmail)
- **Environment:** Selecciona todas (Production, Preview, Development)
- ⚠️ **IMPORTANTE:** Marca esta variable como **"Encrypted"** (encriptada)
- Haz clic en **Save**

#### Variable 6: RSVP_NOTIFICATION_EMAIL
- **Name:** `RSVP_NOTIFICATION_EMAIL`
- **Value:** `patriciaddc80@gmail.com` (el email donde quieres recibir las notificaciones)
- **Environment:** Selecciona todas (Production, Preview, Development)
- Haz clic en **Save**

### Paso 3: Verificar Variables Configuradas

Deberías ver estas 6 variables en la lista:
- ✅ `SMTP_HOST`
- ✅ `SMTP_PORT`
- ✅ `SMTP_SECURE`
- ✅ `SMTP_USER`
- ✅ `SMTP_PASS` (aparecerá como encriptada)
- ✅ `RSVP_NOTIFICATION_EMAIL`

### Paso 4: Redesplegar el Proyecto

**IMPORTANTE:** Después de agregar las variables de entorno, **debes redesplegar** el proyecto:

1. Ve a la pestaña **Deployments** (Despliegues)
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy** (Redesplegar)
4. Confirma el redespliegue

**O simplemente:**
- Haz un pequeño cambio en el código y haz commit + push a GitHub
- Vercel redesplegará automáticamente

### Paso 5: Verificar los Logs

Después de redesplegar, cuando alguien envíe un RSVP:

1. Ve a **Deployments** → Selecciona el último deployment
2. Haz clic en **Functions** (Funciones)
3. Haz clic en `/api/rsvp`
4. Verás los logs en tiempo real

**Deberías ver:**
```
📧 Iniciando proceso de envío de email...
📧 Email destinatario configurado: patriciaddc80@gmail.com
📤 Enviando email de notificación...
✅ Email enviado correctamente!
```

**Si ves errores:**
- `❌ No se configuró RSVP_NOTIFICATION_EMAIL` → Falta la variable
- `❌ Error al verificar conexión SMTP` → Revisa `SMTP_USER` y `SMTP_PASS`
- `❌ Error de autenticación` → La contraseña de aplicación es incorrecta

## 🔍 Verificar que Funciona

1. **Envía un RSVP** desde el formulario en tu sitio web
2. **Revisa tu email** (incluyendo spam)
3. **Revisa los logs** en Vercel para confirmar que se envió

## ⚠️ Notas Importantes

- **Las variables de entorno son específicas por proyecto** - debes configurarlas en cada proyecto de Vercel
- **Después de agregar variables, SIEMPRE redesplega** - las variables no se aplican a deployments existentes
- **La contraseña debe ser una Contraseña de aplicación de Gmail**, no tu contraseña normal
- **Si cambias las variables**, debes redesplegar nuevamente

## 📞 ¿Sigue sin funcionar?

1. **Revisa los logs de Vercel** (Deployments → Functions → `/api/rsvp`)
2. **Verifica que todas las variables estén configuradas** (Settings → Environment Variables)
3. **Asegúrate de haber redesplegado** después de agregar las variables
4. **Prueba el script de test localmente** para verificar que la configuración es correcta:
   ```bash
   npm run test:email
   ```

