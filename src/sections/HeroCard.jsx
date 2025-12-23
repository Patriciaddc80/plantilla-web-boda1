import { motion } from 'framer-motion'

export default function HeroCard() {
  return (
    <motion.section 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Imagen de fondo con overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        <img
          src="/assets/pareja-comiendo.jpg"
          alt="Pareja"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </motion.div>
      
      {/* Contenido principal */}
      <div className="relative z-10 text-center px-3 sm:px-6 py-12 sm:py-20 max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl mb-4 sm:mb-6 text-cream font-kalufonia font-light md:font-light whitespace-nowrap md:whitespace-nowrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Manuela & Daniel
        </motion.h1>
        <motion.p 
          className="italic text-base sm:text-xl md:text-2xl text-cream/90 mb-6 sm:mb-8 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Te invitamos a nuestra boda
        </motion.p>
      {/* Separador */}
      <motion.div 
        className="relative z-10 w-full max-w-[200px] sm:max-w-xs md:max-w-md mx-auto px-3 sm:px-6 mb-4 sm:mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <img
          src="/assets/divisor-lineas1.png"
          alt="Separador decorativo"
          className="w-full h-auto"
        />
      </motion.div>
      
        <motion.p 
          className="uppercase tracking-widest text-xs sm:text-sm md:text-base mb-3 sm:mb-4 text-cream/80 mt-4 sm:mt-8 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Guarda la fecha
        </motion.p>
        <motion.p 
          className="text-xl sm:text-2xl md:text-4xl font-semibold text-cream px-2 break-words"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          26 · Julio · 2026 · Sábado
        </motion.p>
      </div>

      {/* Sombra inferior difuminada */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-green-950/50 via-green-950/30 to-transparent pointer-events-none z-5 translate-x-1"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-10">
        <motion.button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            })
          }}
          className="cursor-pointer bg-transparent hover:bg-transparent p-3 sm:p-4 transition-all duration-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          aria-label="Deslizar hacia abajo"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-cream"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.button>
      </div>
    </motion.section>
  )
}
