import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ChronicleButton } from './ChronicleButton'

export function DicedHeroSection({
  topText,
  mainText,
  subMainText,
  buttonText,
  slides,
  onMainButtonClick,
  mobileBreakpoint = 1000,
}) {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < mobileBreakpoint)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  return (
    <main
      ref={containerRef}
      className="bg-primary dark:bg-gray-800 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-transparent dark:border-gray-700"
    >
      <div className={`flex-1 flex flex-col gap-3 ${isMobile ? 'text-center items-center' : ''}`}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-accent font-semibold text-sm uppercase tracking-wide"
        >
          {topText}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          {mainText}
        </motion.h2>
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: '6rem' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 bg-accent border-none rounded-full my-2"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white/80 max-w-md"
        >
          {subMainText}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2"
        >
          <ChronicleButton
            text={buttonText}
            onClick={onMainButtonClick}
            customBackground="#2d6a4f"
            customForeground="#ffffff"
            hoverColor="#52b788"
            hoverForeground="#ffffff"
            borderRadius="2rem"
            width="170px"
          />
        </motion.div>
      </div>

      <div className="flex-1 w-full">
        <div className="grid grid-cols-2 gap-4 aspect-square w-full max-w-sm mx-auto md:mx-0 md:ml-auto">
          {slides.map((slide) => (
            <div key={slide.title} className="relative w-full pb-[100%] rounded-2xl overflow-hidden bg-gray-900/20">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
