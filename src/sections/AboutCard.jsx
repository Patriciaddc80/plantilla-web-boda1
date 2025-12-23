import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

export default function AboutCard() {
  return (
    <motion.section 
      className="flex items-center justify-center py-0 sm:py-8 md:py-20 bg-cream overflow-x-hidden px-0 sm:px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Relato con comillas */}
        <motion.div
          className="relative mb-6 md:mb-12 w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
            {/* Imagen de fondo green-flower.png fija en contenedor */}
            <img
              src="/assets/green-flower.png"
              alt="Decoración floral"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
              style={{
                maskImage: 'radial-gradient(ellipse 90% 90% at center, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at center, black 70%, transparent 100%)'
              }}
            />
            {/* Overlay para difuminar bordes */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 90% 90% at center, transparent 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.3) 100%)'
              }}
            />
            
            {/* Contenido superpuesto: título, texto e imagen de novios */}
            <div className="relative flex flex-col items-center justify-center pt-6 px-3 gap-2 pb-6 sm:pt-8 sm:px-6 sm:gap-3 sm:pb-8 md:pt-12 md:px-12 md:gap-4 md:pb-12 h-full">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-5xl text-center text-olive px-2 mb-1 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Nuestra Historia
              </motion.h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-[10px] sm:text-sm md:text-lg leading-relaxed text-olive/90 italic text-justify px-1 sm:px-2">
                  <Icon icon="mdi:format-quote-open" className="inline-block text-xs sm:text-2xl md:text-3xl text-olive/80 align-top mr-1" />
                  Nos conocimos en una tarde de verano en París, donde el destino nos unió en una pequeña cafetería cerca del Sena. Desde ese momento, supimos que habíamos encontrado algo especial. Después de años de aventuras juntos, viajes, risas y momentos inolvidables, decidimos dar el siguiente paso y unir nuestras vidas para siempre. Estamos emocionados de compartir este día tan especial con todos ustedes.
                  <Icon icon="mdi:format-quote-close" className="inline-block text-xs sm:text-2xl md:text-3xl text-olive/80 align-top ml-1" />
                </p>
              </div>
              
              {/* Imágenes de los novios */}
              <div className="flex gap-4 sm:gap-4 md:gap-6 justify-center mt-2 sm:mt-6 md:mt-8 flex-wrap">
                <motion.div 
                  className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-xl ring-2 sm:ring-4 ring-olive/20"
                  initial={{ opacity: 0, x: -100 }}
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
                    src="/assets/pareja-enamorada-parque_1303-10225.jpg"
                    alt="Manuela y Daniel"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-xl ring-2 sm:ring-4 ring-olive/20"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.7
                  }}
                >
                  <img
                    src="/assets/mujer-feliz-joven-hombre-positivo-cerca-pared-ladrillo.jpg"
                    alt="Manuela y Daniel"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
