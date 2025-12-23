# 📊 Panel de Administración RSVP

## 🚀 Cómo ver los datos de RSVP

### Opción 1: Panel de Administración Web (Recomendado)

1. **Iniciar el servidor backend:**
   ```bash
   npm run server
   ```

2. **Abrir el panel de administración:**
   - Ejecuta: `npm run admin` para abrir directamente el panel
   - O ejecuta: `npm run dev` y navega a `/admin` en tu navegador
   - El panel está disponible en: `http://localhost:5173/admin`

3. **El panel muestra:**
   - ✅ Estadísticas en tiempo real
   - 📋 Lista completa de todos los RSVPs
   - 📥 Botón para exportar a CSV
   - 🔄 Actualización automática de datos

### Opción 2: Consultar directamente el archivo JSON

Los datos se guardan en:
```
server/data/rsvp.json
```

Puedes abrir este archivo directamente con cualquier editor de texto para ver todos los RSVPs guardados.

### Opción 3: Usar los endpoints de la API directamente

#### Ver todos los RSVPs:
```bash
curl http://localhost:3001/api/rsvp
```

O en el navegador:
```
http://localhost:3001/api/rsvp
```

#### Ver estadísticas:
```bash
curl http://localhost:3001/api/rsvp/stats
```

O en el navegador:
```
http://localhost:3001/api/rsvp/stats
```

#### Crear un nuevo RSVP (desde terminal):
```bash
curl -X POST http://localhost:3001/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "attendance": "yes",
    "guests": "2",
    "message": "¡Nos vemos pronto!"
  }'
```

## 📁 Estructura de Datos

Cada RSVP tiene la siguiente estructura:

```json
{
  "id": "1704067200000",
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "guests": "2",
  "attendance": "yes",
  "message": "¡Nos vemos pronto!",
  "submittedAt": "2026-01-01T12:00:00.000Z"
}
```

## 🔧 Acceder al Panel

El panel de administración está disponible de dos formas:

1. **Usando el comando dedicado:**
   ```bash
   npm run admin
   ```
   Esto abrirá automáticamente el panel en tu navegador.

2. **Accediendo manualmente:**
   - Inicia el servidor de desarrollo: `npm run dev`
   - Navega a: `http://localhost:5173/admin`

## 📊 Estadísticas Disponibles

El endpoint `/api/rsvp/stats` devuelve:
- `total`: Total de RSVPs recibidos
- `attending`: Número de personas que asistirán
- `notAttending`: Número de personas que no asistirán
- `totalGuests`: Total de invitados (suma de todos los guests)

## 💡 Notas Importantes

- ⚠️ El servidor debe estar corriendo (`npm run server`) para que el panel funcione
- 📝 Los datos se guardan automáticamente en `server/data/rsvp.json`
- 🔒 En producción, protege el panel de administración con autenticación
- 📥 Puedes exportar los datos a CSV desde el panel
- 📧 Configura el sistema de email siguiendo las instrucciones en `CONFIGURACION_EMAIL.md`

