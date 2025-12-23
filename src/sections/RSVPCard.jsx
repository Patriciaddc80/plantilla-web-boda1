import { motion } from 'framer-motion'
import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function RSVPCard() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '',
    attendance: 'yes',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:3001/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('RSVP guardado correctamente:', result)
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: '', email: '', guests: '', attendance: 'yes', message: '' })
        }, 3000)
      } else {
        console.error('Error al guardar RSVP:', result.error)
        alert('Hubo un error al enviar tu RSVP. Por favor, intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error al enviar RSVP:', error)
      alert('Hubo un error de conexión. Por favor, verifica que el servidor esté corriendo.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.section 
      className="min-h-screen py-8 md:py-20 px-4 md:px-6 bg-cream relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Imagen de fondo decorativa */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden opacity-10">
        <img
          src="/assets/arreglo-de-boda.jpg"
          alt="Flores"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-center text-olive">RSVP</h2>
          <p className="text-center text-lg md:text-xl text-olive/70 mb-12 font-bold">
            Por favor confirma tu asistencia antes del 1 de Julio de 2026
          </p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl"
            >
              <div className="flex justify-center mb-6">
                <Icon icon="mdi:check-circle-outline" className="text-6xl text-olive" />
              </div>
              <p className="text-2xl text-olive font-semibold mb-2">¡Gracias por confirmar!</p>
              <p className="text-base text-olive/70">Nos vemos pronto</p>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-3 md:space-y-6 bg-white/50 backdrop-blur-sm p-4 md:p-12 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Tu nombre *"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Tu email *"
                required
              />
              <div className="flex gap-2 md:gap-4">
                <label className="flex-1 flex items-center justify-center p-2 md:p-4 border-2 border-olive/20 rounded-full cursor-pointer hover:bg-olive/5 transition-colors bg-white">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={handleChange}
                    className="mr-1 md:mr-2"
                  />
                  <span className="text-xs md:text-base">Asistiré</span>
                </label>
                <label className="flex-1 flex items-center justify-center p-2 md:p-4 border-2 border-olive/20 rounded-full cursor-pointer hover:bg-olive/5 transition-colors bg-white">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={handleChange}
                    className="mr-1 md:mr-2"
                  />
                  <span className="text-xs md:text-base">No asistiré</span>
                </label>
              </div>
              {formData.attendance === 'yes' && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  name="guests"
                  type="number"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full border-2 border-olive/20 rounded-full px-4 py-2 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                  placeholder="Número de invitados"
                  min="1"
                />
              )}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border-2 border-olive/20 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base h-24 md:h-32 resize-none focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive/50 bg-white"
                placeholder="Mensaje (opcional)"
              />
              <motion.button
                type="submit"
                className="w-full bg-olive text-cream rounded-full py-3 md:py-4 text-sm md:text-lg font-semibold hover:bg-olive/90 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Confirmar Asistencia
              </motion.button>
            </motion.form>
          )}
          
          <motion.p 
            className="mt-8 text-center text-sm italic text-olive/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Gracias desde el fondo de nuestros corazones por ser parte de nuestro día especial.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}
