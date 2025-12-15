import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { GenerativeArtScene } from './components/GenerativeArtScene'
import { VerticalCutReveal } from './components/VerticalCutReveal'
import { PDFViewer } from './components/PDFViewer'
import pdfFile from './NFC-for-Conferences-The-Future-of-Seamless-Engagement-by-PurpleHat-Events (5).pdf'

function AttendeeCard() {
  const [animationPhase, setAnimationPhase] = useState('loader')
  const [showPDF, setShowPDF] = useState(false)

  const attendee = {
    name: 'Vikram Pola',
    phone: '9014666161',
    organization: 'Alpcord Network',
    designation: 'Event Organiser',
    country: 'India',
    regId: 'CE2025-1848',
    dates: 'Dec 15–17, 2025',
    venue: 'Hitex',
    conference: 'MBSE 2025'
  }

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('content')
    }, 1200)
    return () => clearTimeout(timer1)
  }, [])

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${attendee.name}
ORG:${attendee.organization}
TITLE:${attendee.designation}
TEL;TYPE=CELL:${attendee.phone}
NOTE:Registration: ${attendee.regId} | ${attendee.conference}
END:VCARD`
    return vcard
  }

  const downloadContact = () => {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${attendee.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const qrData = `REG:${attendee.regId}|NAME:${attendee.name}|ORG:${attendee.organization}`

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      
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

      {animationPhase === 'content' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 h-[100dvh] flex flex-col"
        >
          
          {/* 3D Animation - takes remaining space above content */}
          <div className="flex-1 w-full relative">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <GenerativeArtScene />
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></div>
          </div>

          {/* Content area - fixed at bottom */}
          <div className="flex-shrink-0 px-6 sm:px-8 md:px-16 pb-4 sm:pb-6 max-w-7xl mx-auto w-full">
            
            {/* All content - bottom aligned */}
            <div className="space-y-1.5 sm:space-y-2">
              {/* Welcome Header */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                  <VerticalCutReveal splitBy="characters" staggerDuration={0.015} staggerFrom="first" transition={{ type: 'spring', stiffness: 250, damping: 25 }}>
                    WELCOME
                  </VerticalCutReveal>
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-tight mt-0.5">
                  <VerticalCutReveal splitBy="characters" staggerDuration={0.012} staggerFrom="last" reverse={true} transition={{ type: 'spring', stiffness: 250, damping: 25, delay: 0.2 }}>
                    {attendee.name}
                  </VerticalCutReveal>
                </h2>
              </div>

              {/* Conference Info */}
              <div>
                <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider">
                  <VerticalCutReveal splitBy="characters" staggerDuration={0.008} staggerFrom="center" transition={{ type: 'spring', stiffness: 250, damping: 25, delay: 0.4 }}>
                    To the Annual Conference of
                  </VerticalCutReveal>
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                  <VerticalCutReveal splitBy="characters" staggerDuration={0.01} staggerFrom="first" transition={{ type: 'spring', stiffness: 250, damping: 25, delay: 0.6 }}>
                    {attendee.conference}
                  </VerticalCutReveal>
                </p>
              </div>

              {/* Registration Details + QR Code */}
              <div className="flex justify-between items-start gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.8 }} className="space-y-0.5 flex-1 text-[10px] sm:text-xs">
                  {[['Registration', attendee.regId], ['Company', attendee.organization], ['Role', attendee.designation], ['Country', attendee.country], ['Dates', attendee.dates], ['Venue', attendee.venue]].map(([label, value]) => (
                    <div key={label} className="flex items-baseline gap-2 sm:gap-3">
                      <span className="text-white/50 uppercase tracking-wider min-w-[65px] sm:min-w-[80px]">{label}</span>
                      <span className="font-bold text-white">{value}</span>
                    </div>
                  ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 1.0 }} className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                  <QRCodeSVG value={qrData} size={48} level="M" />
                </motion.div>
              </div>

              {/* Buttons */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }} className="space-y-2 pt-1">
                <button onClick={downloadContact} className="w-full bg-white text-black font-black text-[10px] sm:text-xs uppercase tracking-widest py-2.5 sm:py-3 transition-all duration-300 hover:bg-white/90 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Save Contact
                </button>
                <button onClick={() => setShowPDF(true)} className="w-full bg-transparent border border-white/30 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest py-2.5 sm:py-3 transition-all duration-300 hover:bg-white/10 active:scale-[0.98] flex items-center justify-center gap-2 touch-manipulation">
                  View Conference Brochure <span className="text-sm">→</span>
                </button>
              </motion.div>
            </div>

          </div>

        </motion.div>
      )}

      <AnimatePresence>
        {showPDF && (
          <PDFViewer pdfFile={pdfFile} onClose={() => setShowPDF(false)} />
        )}
      </AnimatePresence>

    </div>
  )
}

export default AttendeeCard
