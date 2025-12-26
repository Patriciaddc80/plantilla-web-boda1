import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

export default function FooterCard() {
  return (
    <motion.footer 
      className="py-6 md:py-10 px-4 md:px-6 bg-olive text-cream"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-3xl mb-3 md:mb-2">¡Nos vemos pronto!</h2>
          <p className="text-lg md:text-base text-cream/90 mb-6 md:mb-4">
            Estamos emocionados de compartir este día especial contigo
          </p>
          <div className="h-px bg-cream/20 w-32 mx-auto mb-6 md:mb-4" />
          <div className="mb-4 md:mb-4">
            <p className="text-base md:text-sm text-cream/80 mb-3 md:mb-2">
              Para cualquier pregunta o información adicional:
            </p>
            <div className="space-y-2 md:space-y-2 text-lg md:text-base">
              <p className="flex items-center justify-center gap-2">
                <Icon icon="mdi:email-outline" className="text-cream" />
                <a href="mailto:manuela.daniel@boda2026.com" className="hover:underline text-cream">manuela.daniel@boda2026.com</a>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Icon icon="mdi:phone-outline" className="text-cream" />
                <a href="tel:+34612345678" className="hover:underline text-cream">+34 000 000 000</a>
              </p>
            </div>
          </div>
          <div className="pt-4 md:pt-4 border-t border-cream/20">
            <p className="text-xl md:text-xl font-kalufonia text-cream mb-3 md:mb-2 tracking-wide">
              Con amor, Manuela & Daniel
            </p>
            <p className="text-sm text-yellow-200 flex items-center justify-center gap-1 flex-wrap">
              <span>© 2026 - Hecho con</span>
              <Icon icon="mdi:heart-outline" className="inline-block text-yellow-300" />
              <span>por</span>
              <a 
                href="https://www.instagram.com/_patriciadiaz.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-yellow-100 hover:text-yellow-50 transition-colors"
              >
                <Icon icon="mdi:instagram" className="text-yellow-100" />
                <span>patriciadiaz.dev</span>
              </a>
              <span>para nuestro día especial</span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

