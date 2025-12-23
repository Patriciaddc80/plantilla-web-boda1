import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

export default function CountdownCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2026-07-26T15:00:00').getTime()

    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: 'Días', value: timeLeft.days, icon: 'mdi:calendar-outline' },
    { label: 'Horas', value: timeLeft.hours, icon: 'mdi:clock-outline' },
    { label: 'Minutos', value: timeLeft.minutes, icon: 'mdi:timer-outline' },
    { label: 'Seg', value: timeLeft.seconds, icon: 'mdi:timer-sand' }
  ]

  return (
    <motion.section 
      className="py-6 sm:py-8 md:py-16 px-2 sm:px-4 md:px-6 bg-transparent"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 text-center text-olive px-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Cuenta Regresiva
        </motion.h2>
        <div className="flex flex-row md:grid md:grid-cols-4 gap-2 sm:gap-3 md:gap-8 justify-center items-center">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="bg-white/70 backdrop-blur-sm p-1 sm:p-2 md:p-6 text-center shadow-lg border border-olive/40 sm:border-2 md:flex-1"
              style={{
                borderRadius: '50% 0% 50% 50% / 60% 60% 40% 40%',
                minWidth: '50px',
                maxWidth: '70px',
                minHeight: '50px',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex justify-center mb-0 md:mb-3">
                <Icon icon={unit.icon} className="text-xs sm:text-lg md:text-3xl text-olive/80" width="1em" height="1em" />
              </div>
              <div className="text-xs sm:text-lg md:text-5xl font-semibold text-olive mb-0 md:mb-2">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-[8px] sm:text-xs md:text-base text-olive/70 uppercase tracking-wide">
                {unit.label}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p 
          className="text-center text-olive/70 mt-8 text-sm italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
        </motion.p>
      </div>
    </motion.section>
  )
}

