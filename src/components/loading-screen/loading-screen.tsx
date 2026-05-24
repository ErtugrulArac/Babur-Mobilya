'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [])

  const ringSize = 148

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0a0806',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          {/* Ring + Logo */}
          <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.08)',
            }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1px solid transparent',
                borderTopColor: 'rgba(255,255,255,0.85)',
                borderRightColor: 'rgba(255,255,255,0.2)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image
                src="/logo/baburlogo.png"
                alt="Babür Mobilya"
                width={72}
                height={72}
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                priority
              />
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
