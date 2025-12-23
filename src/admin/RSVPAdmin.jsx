import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const API_URL = '/api'

export default function RSVPAdmin() {
  const [rsvps, setRsvps] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [rsvpsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/rsvp`),
        fetch(`${API_URL}/rsvp/stats`)
      ])

      if (!rsvpsRes.ok || !statsRes.ok) {
        throw new Error('Error al cargar los datos')
      }

      const rsvpsData = await rsvpsRes.json()
      const statsData = await statsRes.json()

      setRsvps(rsvpsData.data || [])
      setStats(statsData.stats || null)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Asistencia', 'Invitados', 'Mensaje', 'Fecha']
    const rows = rsvps.map(r => [
      r.id,
      r.name,
      r.email,
      r.attendance === 'yes' ? 'Sí' : 'No',
      r.guests,
      r.message || '',
      new Date(r.submittedAt).toLocaleString('es-ES')
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rsvp-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive mx-auto mb-4"></div>
          <p className="text-olive">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <div className="text-center max-w-md">
          <Icon icon="mdi:alert-circle" className="text-6xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-olive mb-2">Error al cargar datos</h2>
          <p className="text-olive/70 mb-4">{error}</p>
          <p className="text-sm text-olive/60 mb-4">
            Asegúrate de que el servidor esté corriendo en el puerto 3001
          </p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-olive text-cream rounded-full hover:bg-olive/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-kalufonia text-olive mb-2">
            Panel de Administración RSVP
          </h1>
          <p className="text-olive/70">Gestión de confirmaciones de asistencia</p>
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-olive mb-1">{stats.total}</div>
              <div className="text-sm text-olive/70">Total RSVPs</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.attending}</div>
              <div className="text-sm text-olive/70">Asisten</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.notAttending}</div>
              <div className="text-sm text-olive/70">No Asisten</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-olive mb-1">{stats.totalGuests}</div>
              <div className="text-sm text-olive/70">Total Invitados</div>
            </div>
          </div>
        )}

        {/* Botón de exportar */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-olive text-cream rounded-full hover:bg-olive/90 transition-colors shadow-lg"
          >
            <Icon icon="mdi:download" className="text-xl" />
            <span>Exportar a CSV</span>
          </button>
        </div>

        {/* Tabla de RSVPs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive">Email</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-olive">Asistencia</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-olive">Invitados</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive">Mensaje</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive/10">
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-olive/70">
                      No hay RSVPs registrados aún
                    </td>
                  </tr>
                ) : (
                  rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-olive/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-olive font-medium">{rsvp.name}</td>
                      <td className="px-6 py-4 text-sm text-olive/80">{rsvp.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            rsvp.attendance === 'yes'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rsvp.attendance === 'yes' ? (
                            <>
                              <Icon icon="mdi:check-circle" className="mr-1" />
                              Sí
                            </>
                          ) : (
                            <>
                              <Icon icon="mdi:close-circle" className="mr-1" />
                              No
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-olive">
                        {rsvp.attendance === 'yes' ? rsvp.guests : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-olive/70 max-w-xs truncate">
                        {rsvp.message || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-olive/60">
                        {new Date(rsvp.submittedAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 space-y-6">
          {/* Ubicación de datos */}
          <div className="p-6 bg-gradient-to-r from-olive/10 to-olive/5 rounded-xl border-2 border-olive/20">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="mdi:folder-database" className="text-3xl text-olive" />
              <h3 className="text-xl font-semibold text-olive">📁 Ubicación de los datos</h3>
            </div>
            <p className="text-sm text-olive/70 mb-3">
              Los datos se almacenan automáticamente en:
            </p>
            <div className="bg-white/80 px-4 py-3 rounded-lg border border-olive/20">
              <code className="text-sm font-mono text-olive font-semibold">server/data/rsvp.json</code>
            </div>
          </div>

          {/* Endpoints API */}
          <div className="p-6 bg-gradient-to-br from-olive/15 via-olive/10 to-sage/20 rounded-xl border-2 border-olive/30 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon="mdi:api" className="text-3xl text-olive" />
              <h3 className="text-xl font-semibold text-olive">🔌 Consultar mediante los Endpoints de la API</h3>
            </div>
            <p className="text-sm text-olive/70 mb-6">
              Puedes consultar los datos directamente mediante estos endpoints:
            </p>
            
            <div className="space-y-4">
              {/* GET All RSVPs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">GET</span>
                    <span className="text-sm font-semibold text-olive">Ver todos los RSVPs</span>
                  </div>
                  <button
                    onClick={() => {
                      window.open('http://localhost:3001/api/rsvp', '_blank')
                    }}
                    className="text-olive hover:text-olive/70 transition-colors"
                    title="Abrir en nueva pestaña"
                  >
                    <Icon icon="mdi:open-in-new" className="text-xl" />
                  </button>
                </div>
                <code className="block text-xs md:text-sm text-olive/80 bg-olive/5 px-3 py-2 rounded mt-2 font-mono break-all">
                  http://localhost:3001/api/rsvp
                </code>
              </div>

              {/* GET Stats */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">GET</span>
                    <span className="text-sm font-semibold text-olive">Ver estadísticas</span>
                  </div>
                  <button
                    onClick={() => {
                      window.open('http://localhost:3001/api/rsvp/stats', '_blank')
                    }}
                    className="text-olive hover:text-olive/70 transition-colors"
                    title="Abrir en nueva pestaña"
                  >
                    <Icon icon="mdi:open-in-new" className="text-xl" />
                  </button>
                </div>
                <code className="block text-xs md:text-sm text-olive/80 bg-olive/5 px-3 py-2 rounded mt-2 font-mono break-all">
                  http://localhost:3001/api/rsvp/stats
                </code>
              </div>

              {/* POST RSVP */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">POST</span>
                    <span className="text-sm font-semibold text-olive">Crear nuevo RSVP</span>
                  </div>
                  <Icon icon="mdi:information-outline" className="text-xl text-olive/60" title="Usado automáticamente por el formulario" />
                </div>
                <code className="block text-xs md:text-sm text-olive/80 bg-olive/5 px-3 py-2 rounded mt-2 font-mono break-all">
                  http://localhost:3001/api/rsvp
                </code>
                <p className="text-xs text-olive/60 mt-2 italic">
                  Este endpoint se usa automáticamente cuando alguien envía el formulario RSVP
                </p>
              </div>
            </div>

            {/* Ejemplo de uso */}
            <div className="mt-6 p-4 bg-olive/5 rounded-lg border border-olive/20">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:code-tags" className="text-olive" />
                <span className="text-sm font-semibold text-olive">Ejemplo de uso (cURL):</span>
              </div>
              <div className="bg-olive/10 p-3 rounded text-xs font-mono text-olive/90 overflow-x-auto">
                <div className="mb-2">
                  <span className="text-olive/60"># Ver todos los RSVPs</span>
                </div>
                <div className="mb-2">
                  <span className="text-green-600">curl</span> http://localhost:3001/api/rsvp
                </div>
                <div className="mb-2">
                  <span className="text-olive/60"># Ver estadísticas</span>
                </div>
                <div>
                  <span className="text-green-600">curl</span> http://localhost:3001/api/rsvp/stats
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

