import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GenerativeArtScene } from './components/GenerativeArtScene'
import { VerticalCutReveal } from './components/VerticalCutReveal'
import { PDFViewer } from './components/PDFViewer'
import pdfFile from './NFC-for-Conferences-The-Future-of-Seamless-Engagement-by-PurpleHat-Events (5).pdf'

function App() {
  const [animationPhase, setAnimationPhase] = useState('loader')
  const [showPDF, setShowPDF] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('content')
    }, 1200)

    return () => clearTimeout(timer1)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* White Loader with Black Ball */}
      <AnimatePresence>
        {animationPhase === 'loader' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 100 }}
              transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
              className="w-4 h-4 rounded-full bg-black"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Black Background */}
      <div className="fixed inset-0 bg-black"></div>

      {/* Main Layout: 60% Animation + 40% Content */}
      {animationPhase === 'content' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-screen flex flex-col"
        >
          
          {/* Top 60%: 3D Generative Art Animation */}
          <div className="h-[60vh] w-full relative">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <GenerativeArtScene />
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></div>
          </div>

          {/* Bottom 40%: Content */}
          <div className="h-[40vh] px-8 md:px-16 py-4 md:py-6 flex flex-col overflow-hidden max-w-7xl mx-auto w-full">
            
            <div className="space-y-3 md:space-y-4">
              {/* Welcome Header with Vertical Cut Reveal */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.015}
                    staggerFrom="first"
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                    }}
                  >
                    WELCOME
                  </VerticalCutReveal>
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mt-0.5">
                  <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.012}
                    staggerFrom="last"
                    reverse={true}
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      delay: 0.2,
                    }}
                  >
                    Dr. PurpleHat Events
                  </VerticalCutReveal>
                </h2>
              </div>

              {/* Conference Info */}
              <div className="space-y-0.5">
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.008}
                    staggerFrom="center"
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      delay: 0.4,
                    }}
                  >
                    To the Annual Conference of
                  </VerticalCutReveal>
                </p>
                <p className="text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-tight">
                  <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.01}
                    staggerFrom="first"
                    transition={{
                      type: 'spring',
                      stiffness: 250,
                      damping: 25,
                      delay: 0.6,
                    }}
                  >
                    Cardiology Excellence 2025
                  </VerticalCutReveal>
                </p>
              </div>

              {/* Registration Details + QR Code */}
              <div className="flex justify-between items-start gap-6 md:gap-8">
                {/* Left: Details */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="space-y-2 flex-1"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-white/50 uppercase tracking-wider min-w-[90px]">Registration</span>
                    <span className="text-sm sm:text-base font-bold text-white">CE2025-1847</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-white/50 uppercase tracking-wider min-w-[90px]">Dates</span>
                    <span className="text-sm sm:text-base font-bold text-white">Dec 15–17, 2025</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-white/50 uppercase tracking-wider min-w-[90px]">Venue</span>
                    <span className="text-sm sm:text-base font-bold text-white">Hitex</span>
                  </div>
                </motion.div>

                {/* Right: QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded grid grid-cols-3 gap-0.5 p-2">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-black'}`}></div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-6"
            >
              <button
                onClick={() => setShowPDF(true)}
                className="w-full bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest py-3 sm:py-4 transition-all duration-300 hover:bg-white/90 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation"
              >
                <VerticalCutReveal
                  splitBy="characters"
                  staggerDuration={0.01}
                  staggerFrom="center"
                  transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 25,
                    delay: 1.2,
                  }}
                >
                  View Conference Brochure
                </VerticalCutReveal>
                <span className="text-base">→</span>
              </button>
            </motion.div>

          </div>

        </motion.div>
      )}

      {/* PDF Viewer Overlay */}
      <AnimatePresence>
        {showPDF && (
          <PDFViewer
            pdfFile={pdfFile}
            onClose={() => setShowPDF(false)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default App
