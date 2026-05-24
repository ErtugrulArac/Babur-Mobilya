'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WeaveSpinner = () => (
  <>
    <style>{`
      .spinner-container {
        position: relative;
        width: 160px;
        height: 160px;
        transform-style: preserve-3d;
        perspective: 1200px;
      }
      .node {
        position: absolute;
        top: 50%; left: 50%;
        width: 80px; height: 80px;
        transform: translate(-50%, -50%);
        animation: nodePulse 1.6s cubic-bezier(0.68,-0.55,0.27,1.55) infinite;
        display: flex; align-items: center; justify-content: center;
      }
      .node img {
        width: 100%; height: 100%;
        object-fit: contain;
      }
      .thread {
        position: absolute;
        background: linear-gradient(90deg, transparent, rgba(255,170,0,0.8), transparent);
        box-shadow: 0 0 10px rgba(255,170,0,0.5);
        transform-origin: center;
      }
      .t1 { width:100%; height:2px; top:30%;  left:0;   animation: weave1 2s   cubic-bezier(0.45,0,0.55,1) infinite; }
      .t2 { width:2px; height:100%; top:0;    left:70%; animation: weave2 2.2s cubic-bezier(0.68,-0.55,0.27,1.55) infinite; }
      .t3 { width:100%; height:2px; bottom:30%; left:0; animation: weave3 2.4s cubic-bezier(0.23,1,0.32,1) infinite; }
      .t4 { width:2px; height:100%; top:0;    left:30%; animation: weave4 2.6s cubic-bezier(0.36,0,0.66,-0.56) infinite; }
      @keyframes nodePulse {
        0%,100% { transform:translate(-50%,-50%) scale(1); }
        50%      { transform:translate(-50%,-50%) scale(1.1); }
      }
      @keyframes weave1 {
        0%,100% { transform:translateY(0)    rotateX(0deg)   rotateZ(0deg);  opacity:0.8; }
        50%     { transform:translateY(40px) rotateX(60deg)  rotateZ(20deg); opacity:1;   }
      }
      @keyframes weave2 {
        0%,100% { transform:translateX(0)     rotateY(0deg)  rotateZ(0deg);   opacity:0.8; }
        50%     { transform:translateX(-40px) rotateY(60deg) rotateZ(-20deg); opacity:1;   }
      }
      @keyframes weave3 {
        0%,100% { transform:translateY(0)     rotateX(0deg)   rotateZ(0deg);  opacity:0.8; }
        50%     { transform:translateY(-40px) rotateX(-60deg) rotateZ(15deg); opacity:1;   }
      }
      @keyframes weave4 {
        0%,100% { transform:translateX(0)    rotateY(0deg)   rotateZ(0deg);   opacity:0.8; }
        50%     { transform:translateX(40px) rotateY(-60deg) rotateZ(-15deg); opacity:1;   }
      }
    `}</style>
    <div className="spinner-container">
      <div className="thread t1" />
      <div className="thread t2" />
      <div className="thread t3" />
      <div className="thread t4" />
      <div className="node">
        <img src="/logo/baburlogo.png" alt="Babür Mobilya" />
      </div>
    </div>
  </>
)

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [])

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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <WeaveSpinner />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
