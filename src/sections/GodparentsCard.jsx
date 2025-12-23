import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

export default function GodparentsCard() {
  const godparents = [
    {
      name: "María González",
      role: "Madrina",
      image: "/assets/primer-plano-retrato-bella-dama-maquillaje-natural-sonriendo.jpg"
    },
    {
      name: "Carlos Martínez",
      role: "Padrino",
      image: "/assets/vista-frontal-hombre-sabio-posando-estudio_23-2149883496.jpg"
    }
  ]

  return (
    <motion.section 
      className="min-h-0 sm:min-h-screen flex items-start sm:items-center justify-center pt-2 sm:pt-8 md:pt-20 pb-2 sm:pb-2 md:pb-12 px-2 sm:px-4 md:px-6 bg-gradient-to-b from-cream to-sage"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-5xl mb-1 sm:mb-4 md:mb-8 text-center text-olive px-2 pt-0 sm:pt-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Nuestros Padrinos
        </motion.h2>
        
        <motion.p 
          className="text-center text-sm sm:text-base md:text-lg text-olive/80 mb-1 sm:mb-4 md:mb-8 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Estamos honrados de tener a estas personas especiales como nuestros padrinos, 
          quienes han sido una parte importante de nuestras vidas y nos acompañarán en este día tan especial.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 md:gap-12 max-w-3xl mx-auto px-2 pb-0 sm:pb-0">
          {godparents.map((person, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.4 + index * 0.2
              }}
            >
              <div className="relative mb-4 sm:mb-6">
                <motion.div 
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden shadow-xl ring-2 sm:ring-4 ring-olive/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    delay: 0.5 + index * 0.2
                  }}
                >
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-olive/90 text-cream px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {person.role}
                  </div>
                </div>
              </div>
              <h3 className="text-sm sm:text-base md:text-2xl font-semibold text-olive mb-1 sm:mb-2">{person.name}</h3>
              <div className="flex justify-center gap-2 text-olive/60">
                <Icon icon="mdi:heart-outline" className="text-base sm:text-lg md:text-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

