import { motion } from 'framer-motion'

export default function GiftsCard() {
  return (
    <motion.section 
      className="min-h-screen pt-0 pb-6 sm:pb-8 md:pb-20 px-2 sm:px-4 md:px-6 bg-gradient-to-b from-sage to-cream flex items-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-5xl mb-6 sm:mb-8 text-center text-olive px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Regalos
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-olive/80 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Tu presencia es el mejor regalo que podemos recibir. Sin embargo, si deseas 
            hacernos un obsequio, apreciaríamos mucho tu contribución para nuestra luna de miel.
          </p>
          <motion.div 
            className="max-w-lg mx-auto rounded-lg sm:rounded-xl overflow-hidden mb-6 sm:mb-8 px-2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.4
            }}
          >
            <img
              src="/assets/regalos.jpg"
              alt="Regalos de boda"
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
            />
          </motion.div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 px-2">
          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-olive mb-3 sm:mb-4">Transferencia Bancaria</h3>
            <div className="space-y-2 text-olive/70">
              <p className="text-xs sm:text-sm bg-olive/10 px-2 sm:px-3 py-1 rounded-lg inline-block font-bold break-all">IBAN: ES12 3456 7890 1234 5678 9012</p>
              <p className="text-sm sm:text-base">Titular: Manuela & Daniel</p>
            </div>
          </motion.div>
          <motion.div
            className="p-4 sm:p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-olive mb-3 sm:mb-4">Lista de Deseos</h3>
            <p className="text-sm sm:text-base text-olive/70 mb-4 sm:mb-6">
              También tenemos una lista de deseos en las siguientes tiendas:
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              <button 
                type="button"
                className="px-3 sm:px-4 py-1.5 sm:py-2 md:px-6 md:py-3 bg-olive text-cream rounded-full text-xs md:text-sm font-semibold hover:bg-olive/90 transition-colors cursor-pointer"
                onClick={() => window.open('https://www.amazon.es', '_blank')}
              >
                Amazon
              </button>
              <button 
                type="button"
                className="px-3 sm:px-4 py-1.5 sm:py-2 md:px-6 md:py-3 bg-olive text-cream rounded-full text-xs md:text-sm font-semibold hover:bg-olive/90 transition-colors cursor-pointer"
                onClick={() => window.open('https://www.elcorteingles.es', '_blank')}
              >
                El Corte Inglés
              </button>
            </div>
          </motion.div>
        </div>
        <motion.p 
          className="mt-12 text-center text-sm md:text-base italic text-olive/70 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Cualquier regalo será recibido con mucho amor y gratitud.
        </motion.p>
      </div>
    </motion.section>
  )
}

