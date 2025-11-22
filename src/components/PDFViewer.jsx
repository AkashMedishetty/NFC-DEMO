import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker - using unpkg instead of cdnjs for better reliability
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export function PDFViewer({ pdfFile, onClose }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  // Calculate scale based on window size for better fit
  const getScale = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // PDF page aspect ratio is typically 8.5:11 (0.773)
      const pdfWidth = 612 // Standard PDF width in points
      const pdfHeight = 792 // Standard PDF height in points
      
      // Account for header (60px) and small padding
      const availableHeight = height - 80 // Header + minimal padding
      const availableWidth = width - 20 // Minimal side padding
      
      // Calculate scale to fit both dimensions
      const scaleByWidth = availableWidth / pdfWidth
      const scaleByHeight = availableHeight / pdfHeight
      
      // Use the smaller scale to ensure the whole page fits, with higher max
      return Math.min(scaleByWidth, scaleByHeight, 3.0) // Increased max scale to 3.0
    }
    return 1.5
  }

  const [baseScale] = useState(getScale())
  const [scale, setScale] = useState(getScale())
  const [isPinching, setIsPinching] = useState(false)

  // Update scale on window resize
  useEffect(() => {
    const handleResize = () => {
      const newScale = getScale()
      setScale(newScale)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pinch-to-zoom functionality
  useEffect(() => {
    let initialDistance = 0
    let initialScale = scale

    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        setIsPinching(true)
        initialDistance = getDistance(e.touches)
        initialScale = scale
        e.preventDefault()
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && isPinching) {
        const currentDistance = getDistance(e.touches)
        const scaleChange = currentDistance / initialDistance
        const newScale = Math.min(Math.max(initialScale * scaleChange, 0.5), 5.0)
        setScale(newScale)
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      setIsPinching(false)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [scale, isPinching])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Allow arrow key scrolling when zoomed, page navigation when not zoomed
      if (scale <= baseScale * 1.1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          goToNextPage()
          e.preventDefault()
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          goToPrevPage()
          e.preventDefault()
        }
      }
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [pageNumber, numPages, scale, baseScale])

  const goToNextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setDirection(1)
      setPageNumber(prev => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setDirection(-1)
      setPageNumber(prev => prev - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header with controls */}
      <div className="bg-black border-b border-white/10 px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onClose}
            className="text-white hover:text-white/70 transition-colors text-sm uppercase tracking-wider font-bold whitespace-nowrap"
          >
            ← Back
          </button>
          <span className="text-white/60 text-xs sm:text-sm whitespace-nowrap">
            Page {pageNumber} of {numPages || '...'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
            className="px-2 py-1.5 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={() => setScale(s => Math.min(s + 0.2, 5.0))}
            className="px-2 py-1.5 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setScale(baseScale)}
            className="hidden sm:block px-2 py-1.5 bg-white/10 text-white text-xs uppercase tracking-wider font-bold rounded hover:bg-white/20 transition-colors whitespace-nowrap"
            title="Reset Zoom"
          >
            Fit
          </button>
          <div className="w-px h-6 bg-white/20"></div>
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="px-3 py-1.5 bg-white/10 text-white text-xs uppercase tracking-wider font-bold rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Prev
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="px-3 py-1.5 bg-white/10 text-white text-xs uppercase tracking-wider font-bold rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Next
          </button>
          <a
            href={pdfFile}
            download="NFC-Conference-Brochure.pdf"
            className="hidden sm:flex px-3 py-1.5 bg-white text-black text-xs uppercase tracking-wider font-bold rounded hover:bg-white/90 transition-colors items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
          <a
            href={pdfFile}
            download="NFC-Conference-Brochure.pdf"
            className="sm:hidden p-1.5 bg-white text-black rounded hover:bg-white/90 transition-colors flex items-center justify-center"
            title="Download PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </div>

      {/* PDF Document */}
      <div 
        className="flex-1 overflow-auto bg-black flex items-center justify-center p-1"
        style={{ touchAction: scale > baseScale * 1.1 ? 'pan-x pan-y' : 'auto' }}
        onTouchStart={(e) => {
          // Only allow swipe navigation when not zoomed in
          if (e.touches.length === 1 && !isPinching && scale <= baseScale * 1.1) {
            const touchStart = e.touches[0].clientX
            const touchStartY = e.touches[0].clientY
            let hasMoved = false
            
            const handleTouchMove = (moveEvent) => {
              const moveDistance = Math.abs(moveEvent.touches[0].clientX - touchStart)
              const verticalDistance = Math.abs(moveEvent.touches[0].clientY - touchStartY)
              // Only consider it a swipe if horizontal movement is greater than vertical
              if (moveDistance > 10 || verticalDistance > 10) {
                hasMoved = true
              }
            }
            
            const handleTouchEnd = (endEvent) => {
              const touchEnd = endEvent.changedTouches[0].clientX
              const distance = Math.abs(touchStart - touchEnd)
              const verticalDistance = Math.abs(touchStartY - endEvent.changedTouches[0].clientY)
              
              // Only navigate if horizontal swipe and not zoomed
              if (distance > 75 && distance > verticalDistance && scale <= baseScale * 1.1) {
                if (touchStart - touchEnd > 75) goToNextPage() // Swipe left
                if (touchEnd - touchStart > 75) goToPrevPage() // Swipe right
              }
              document.removeEventListener('touchmove', handleTouchMove)
              document.removeEventListener('touchend', cleanup)
            }
            
            const cleanup = (endEvent) => {
              handleTouchEnd(endEvent)
            }
            
            document.addEventListener('touchmove', handleTouchMove, { passive: true })
            document.addEventListener('touchend', cleanup)
          }
        }}
      >
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-white text-center py-20">
              <div className="text-lg font-bold uppercase tracking-wider">Loading PDF...</div>
            </div>
          }
          error={
            <div className="text-white text-center py-20">
              <div className="text-lg font-bold uppercase tracking-wider text-red-500">
                Failed to load PDF
              </div>
            </div>
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={pageNumber}
              custom={direction}
              initial={{ 
                opacity: 0,
                x: direction === 1 ? 100 : -100,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1,
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0,
                x: direction === 1 ? -100 : 100,
                scale: 0.95
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="md:hidden bg-black border-t border-white/10 px-4 py-3 flex items-center justify-center gap-4">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider font-black rounded hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider font-black rounded hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </motion.div>
  )
}
