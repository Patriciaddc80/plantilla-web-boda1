# 🚀 Guía de Despliegue en Vercel

## ✅ Backend Configurado

El backend está configurado para usar **Vercel KV** en producción y archivos JSON en desarrollo local.

## 🔧 Configuración de Vercel KV (Requerido para Producción)

Vercel KV es una base de datos key-value basada en Redis, perfecta para este caso.

### Paso 1: Crear Base de Datos KV en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Storage**
3. Haz clic en **Create Database**
4. Selecciona **KV** (Redis)
5. Crea la base de datos (plan gratuito disponible)

### Paso 2: Variables de Entorno Automáticas

Vercel configurará automáticamente estas variables cuando crees la base de datos KV:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**No necesitas configurarlas manualmente**, Vercel las añade automáticamente.

### Opción 2: Usar MongoDB Atlas (Gratis hasta 512MB)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Obtén la connection string
4. Actualiza las funciones API para usar MongoDB

### Opción 3: Usar un servicio separado para el Backend

Mantener el backend en un servicio como:
- **Railway** (gratis con límites)
- **Render** (gratis con límites)
- **Fly.io** (gratis con límites)
- **Heroku** (de pago)

Y desplegar solo el frontend en Vercel.

## 📝 Configuración Actual

Las funciones serverless están creadas en:
- `api/rsvp.js` - Maneja GET y POST de RSVPs (usa Vercel KV en producción)
- `api/rsvp/stats.js` - Maneja GET de estadísticas (usa Vercel KV en producción)

**Funcionamiento:**
- ✅ **En Vercel (producción):** Usa Vercel KV para almacenamiento persistente
- ✅ **En desarrollo local:** Usa archivos JSON en `server/data/rsvp.json`

## 🔑 Variables de Entorno en Vercel

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
RSVP_NOTIFICATION_EMAIL=tu-email@gmail.com
```

## 🚀 Pasos para Desplegar

1. **Conecta tu repositorio de GitHub a Vercel**
2. **Configura las variables de entorno** en Vercel
3. **Despliega** - Vercel detectará automáticamente el proyecto
4. **Actualiza las funciones API** para usar una base de datos (KV, MongoDB, etc.)

## 📧 Email en Producción

El sistema de email funcionará correctamente en Vercel siempre que:
- Las variables de entorno SMTP estén configuradas
- La contraseña de aplicación de Gmail sea válida

## ✅ Funcionalidades en Producción

- ✅ Los datos RSVP se guardarán persistentemente usando Vercel KV
- ✅ El sistema de email funcionará correctamente
- ✅ El frontend funcionará perfectamente
- ✅ Todas las funciones del backend están disponibles

## 📋 Checklist de Despliegue

- [ ] Repositorio conectado a Vercel
- [ ] Base de datos KV creada en Vercel
- [ ] Variables de entorno SMTP configuradas en Vercel
- [ ] Proyecto desplegado
- [ ] Probar el formulario RSVP en producción

