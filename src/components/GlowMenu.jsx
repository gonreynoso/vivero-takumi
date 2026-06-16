import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/utils'

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: 'spring', stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const sharedTransition = { type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }

// Menú con efecto "glow" y flip 3D al pasar el mouse, usado en la navbar de la tienda
export const GlowMenu = forwardRef(({ className, items, activeItem, onItemClick, ...props }, ref) => {
  return (
    <motion.nav
      ref={ref}
      className={cn(
        'p-1.5 rounded-2xl bg-gray-50 border border-gray-100 relative overflow-hidden',
        className
      )}
      initial="initial"
      whileHover="hover"
      {...props}
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.06), transparent 70%)' }}
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-1 relative z-10">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.label === activeItem

          return (
            <li key={item.label} className="relative">
              <button onClick={() => onItemClick?.(item)} className="block w-full">
                <motion.div
                  className="block rounded-xl overflow-visible group relative"
                  style={{ perspective: '600px' }}
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    variants={glowVariants}
                    animate={isActive ? 'hover' : 'initial'}
                    style={{
                      background: item.gradient,
                      opacity: isActive ? 1 : 0,
                      borderRadius: '16px',
                    }}
                  />
                  <motion.div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl text-sm font-medium',
                      isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-900'
                    )}
                    variants={itemVariants}
                    transition={sharedTransition}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'center bottom' }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.div>
                  <motion.div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl text-sm font-medium',
                      isActive ? 'text-primary' : 'text-gray-900'
                    )}
                    variants={backVariants}
                    transition={sharedTransition}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top', rotateX: 90 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </motion.div>
              </button>
            </li>
          )
        })}
      </ul>
    </motion.nav>
  )
})

GlowMenu.displayName = 'GlowMenu'
