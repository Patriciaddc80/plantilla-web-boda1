import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const photos = [
  { 
    src: "/assets/recien-casados-amigos-posando-parque_1153-2737.jpg", 
    alt: "Amigos posando"
  },
  { 
    src: "/assets/gente-celebrando.jpg", 
    alt: "Celebración"
  },
  { 
    src: "/assets/cortando-pastel.jpg", 
    alt: "Cortando pastel"
  },
  { 
    src: "/assets/pareja-comiendo.jpg", 
    alt: "Pareja comiendo"
  },
  { 
    src: "/assets/hermosas-damas-honor.jpg", 
    alt: "Damas de honor"
  },
  { 
    src: "/assets/celebracion-vengalas.jpg", 
    alt: "Celebración"
  },
]

export default function GalleryCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(0)

  // Auto-play cada 4 segundos (pausa en hover)
  useEffect(() => {
    if (isPaused) return
    
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isPaused])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Calcular índices de imágenes visibles
  const prevIndex = (currentIndex - 1 + photos.length) % photos.length
  const nextIndex = (currentIndex + 1) % photos.length

  return (
    <motion.section 
      className="pt-4 pb-4 md:pt-0 md:pb-4 px-2 sm:px-4 md:px-6 bg-sage"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Separador */}
        <motion.div 
          className="w-full max-w-[280px] sm:max-w-xs md:max-w-md mx-auto px-3 sm:px-6 mt-4 sm:mt-6 mb-4 sm:mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          <img
            src="/assets/divisor-lineas1.png"
            alt="Separador decorativo"
            className="w-full h-auto"
          />
        </motion.div>
        
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-5xl mb-2 text-center text-olive font-kalufonia px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Nuestros Momentos
        </motion.h2>
        
        <motion.p 
          className="text-center text-sm sm:text-base md:text-lg text-olive/70 mb-4 sm:mb-6 max-w-2xl mx-auto px-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Compartimos contigo algunos de los momentos más especiales que hemos vivido juntos.
        </motion.p>
        
        {/* Carrusel moderno */}
        <section 
          className="relative w-full mb-8"
          aria-label="Galería de fotos - Pausa automática al pasar el mouse"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[300px] sm:h-[350px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
            {/* Contenedor del carrusel */}
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
              {/* Imagen izquierda (anterior) */}
              <motion.div
                key={`prev-${prevIndex}`}
                className="absolute z-10 cursor-pointer hidden sm:block"
                style={{
                  left: '10%',
                  transform: 'translateX(-50%)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 0.6, 
                  scale: 0.75
                }}
                transition={{ 
                  type: "tween",
                  ease: [0.25, 0.1, 0.25, 1],
                  duration: 0.5
                }}
                onClick={goToPrevious}
              >
                <div className="relative w-[120px] h-[150px] sm:w-[150px] sm:h-[190px] md:w-[220px] md:h-[275px] rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                  <img
                    src={photos[prevIndex].src}
                    alt={photos[prevIndex].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
                </div>
              </motion.div>

              {/* Imagen central (actual) */}
              <div className="relative z-20 flex items-center justify-center">
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{
                      opacity: 0,
                      x: direction > 0 ? 30 : -30,
                      scale: 0.98
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      x: direction < 0 ? 30 : -30,
                      scale: 0.98
                    }}
                    transition={{
                      type: "tween",
                      ease: [0.25, 0.1, 0.25, 1],
                      duration: 1,
                      opacity: { duration: 0.6, ease: "easeOut" },
                      x: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
                      scale: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }
                    }}
                    className="relative w-[200px] h-[250px] sm:w-[240px] sm:h-[300px] md:w-[360px] md:h-[450px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-white group"
                  >
                    <motion.img
                      src={photos[currentIndex].src}
                      alt={photos[currentIndex].alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{
                        scale: 1.1,
                        transition: { 
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          duration: 0.5
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ 
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <Icon icon="mdi:image-expand" className="text-2xl text-olive" />
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Imagen derecha (siguiente) */}
              <motion.div
                key={`next-${nextIndex}`}
                className="absolute z-10 cursor-pointer hidden sm:block"
                style={{
                  right: '10%',
                  transform: 'translateX(50%)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 0.6, 
                  scale: 0.75
                }}
                transition={{ 
                  type: "tween",
                  ease: [0.25, 0.1, 0.25, 1],
                  duration: 0.5
                }}
                onClick={goToNext}
              >
                <div className="relative w-[120px] h-[150px] sm:w-[150px] sm:h-[190px] md:w-[220px] md:h-[275px] rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                  <img
                    src={photos[nextIndex].src}
                    alt={photos[nextIndex].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
                </div>
              </motion.div>
            </div>

            {/* Botones de navegación modernos */}
            <motion.button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md hover:bg-white text-olive p-3 md:p-4 rounded-full shadow-xl border border-olive/20"
              aria-label="Imagen anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              <Icon icon="mdi:chevron-left" className="text-2xl md:text-3xl" />
            </motion.button>
            <motion.button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md hover:bg-white text-olive p-3 md:p-4 rounded-full shadow-xl border border-olive/20"
              aria-label="Imagen siguiente"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              <Icon icon="mdi:chevron-right" className="text-2xl md:text-3xl" />
            </motion.button>
          </div>

          {/* Indicadores modernos */}
          <div className="flex justify-center items-center gap-2 md:gap-3 mt-8">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-500 ease-out rounded-full ${
                  index === currentIndex 
                    ? 'bg-olive w-10 md:w-12 h-2 md:h-3' 
                    : 'bg-olive/30 w-2 md:w-3 h-2 md:h-3 hover:bg-olive/50 hover:w-6 md:hover:w-8'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-olive rounded-full"
                    layoutId="activeIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                      mass: 0.5
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contador de imágenes */}
          <motion.div
            className="text-center mt-4 text-olive/60 text-sm md:text-base"
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
          >
            {currentIndex + 1} / {photos.length}
          </motion.div>
        </section>

        <motion.p 
          className="text-center text-base md:text-lg text-olive/70 italic mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          Comparte tus fotos con nosotros usando <span className="font-bold bg-olive/20 px-3 py-1.5 rounded-md text-olive text-lg md:text-xl">#ManuelaYDaniel2026</span>
        </motion.p>
      </div>
    </motion.section>
  )
}
