import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const timelineEvents = [
  { time: "14:00", event: "Bebidas de bienvenida", icon: "mdi:glass-tulip" },
  { time: "15:00", event: "Ceremonia", icon: "mdi:church-outline" },
  { time: "17:30", event: "Cena", icon: "mdi:food-outline" },
  { time: "19:00", event: "Brindis y discursos", icon: "mdi:microphone-outline" },
  { time: "21:00", event: "Primer baile", icon: "mdi:music-note-outline" },
  { time: "22:00", event: "Fiesta", icon: "mdi:gift-outline" },
]

export default function TimelineCard() {
  return (
    <motion.section 
      className="min-h-screen py-6 sm:py-8 md:py-20 px-2 sm:px-4 md:px-6 bg-gradient-to-b from-cream to-sage"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Programa del Día */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl mb-8 sm:mb-12 text-center text-olive px-2">Programa del Día</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-10 mb-12 sm:mb-20">
            {timelineEvents.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-1 md:flex-row md:items-center md:gap-6 p-1.5 sm:p-2 md:p-6 rounded-lg sm:rounded-xl md:bg-white/50 md:backdrop-blur-sm md:hover:bg-white/70 transition-all md:shadow-sm"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 text-center">
                  <div className="flex justify-center mb-0 md:mb-2">
                    <Icon icon={item.icon} className="text-base sm:text-lg md:text-4xl text-olive/80" width="1.5em" height="1.5em" />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-olive">{item.time}</p>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] sm:text-xs md:text-lg font-medium text-olive leading-tight sm:leading-normal">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ubicación */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="relative h-64 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl mb-6 sm:mb-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.5
            }}
          >
            <img
              src="/assets/elegante-recepcion-boda.jpg"
              alt="Ubicación"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-cream">
              <h2 className="text-xl sm:text-2xl md:text-4xl mb-2 sm:mb-4">Ubicación</h2>
              <p className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">Villa Erba · Lago de Como</p>
              <p className="text-sm sm:text-base text-cream/90 mb-4 sm:mb-6">Via Regina 2, Cernobbio, Italia</p>
              <a 
                href="https://www.google.com/maps?q=Villa+Erba,+Via+Regina+2,+Cernobbio,+Italia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-cream text-olive rounded-full text-sm sm:text-base font-semibold hover:bg-cream/90 transition-colors cursor-pointer"
              >
                Ver en mapa
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
