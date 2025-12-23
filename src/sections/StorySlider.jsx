import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

const storySlides = [
  {
    image: "/assets/pareja-enamorada-parque_1303-10225.jpg",
    title: "Nuestro Encuentro",
    text: "Nos conocimos en una tarde de verano en París, donde el destino nos unió en una pequeña cafetería cerca del Sena. Desde ese momento, supimos que habíamos encontrado algo especial."
  },
  {
    image: "/assets/mujer-feliz-joven-hombre-positivo-cerca-pared-ladrillo.jpg",
    title: "Nuestras Aventuras",
    text: "Después de años de aventuras juntos, viajes, risas y momentos inolvidables, decidimos dar el siguiente paso y unir nuestras vidas para siempre."
  },
  {
    image: "/assets/pareja-comiendo.jpg",
    title: "Nuestro Compromiso",
    text: "Estamos emocionados de compartir este día tan especial con todos ustedes y comenzar juntos esta nueva etapa de nuestras vidas."
  }
]

export default function StorySlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % storySlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length)
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % storySlides.length)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <motion.section 
      className="w-full py-8 md:py-12 px-4 md:px-6 bg-transparent"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              <div className="relative h-full">
                <img
                  src={storySlides[currentSlide].image}
                  alt={storySlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-cream">
                  <motion.h3 
                    className="text-3xl md:text-4xl font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {storySlides[currentSlide].title}
                  </motion.h3>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botones de navegación */}
          <button
            onClick={goToPrevious}
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-cream p-3 rounded-full transition-all cursor-pointer"
            aria-label="Slide anterior"
          >
            <Icon icon="mdi:chevron-left" className="text-2xl" />
          </button>
          <button
            onClick={goToNext}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-cream p-3 rounded-full transition-all cursor-pointer"
            aria-label="Slide siguiente"
          >
            <Icon icon="mdi:chevron-right" className="text-2xl" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {storySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-olive w-8' 
                  : 'bg-olive/30 w-2 hover:bg-olive/50'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

