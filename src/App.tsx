import { useState, useRef, useEffect } from 'react'
import './App.css'
import config from './config.json'

interface SequenceItem {
  name: string;
  audio: string;
}

interface Salah {
  name: string;
  audio: string;
  sequence: SequenceItem[];
}

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedSalah, setSelectedSalah] = useState<Salah | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number>(0)
  const [isSequencePlaying, setIsSequencePlaying] = useState<boolean>(false)
  const [isSequencePaused, setIsSequencePaused] = useState<boolean>(false)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const sequenceTimeoutRef = useRef<number | null>(null)
  
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language.toLowerCase())
  }
  
  const handleSalahSelect = (salah: Salah) => {
    setSelectedSalah(salah)
    setIsAudioPlaying(true)
    playAudio(salah)
  }
  
  const goBackToSalahs = () => {
    setSelectedSalah(null)
    setIsAudioPlaying(false)
    setIsSequencePlaying(false)
    setIsSequencePaused(false)
    setCurrentSequenceIndex(0)
    
    // Clear any pending timeouts
    if (sequenceTimeoutRef.current) {
      clearTimeout(sequenceTimeoutRef.current)
      sequenceTimeoutRef.current = null
    }
    
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
  }

  const startSequence = () => {
    if (!selectedSalah || selectedSalah.sequence.length === 0) return
    
    setIsSequencePlaying(true)
    setIsSequencePaused(false)
    setCurrentSequenceIndex(0)
    
    console.log('🎬 Starting sequence for:', selectedSalah.name)
  }

  const pauseSequence = () => {
    setIsSequencePaused(true)
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
    }
    if (sequenceTimeoutRef.current) {
      clearTimeout(sequenceTimeoutRef.current)
      sequenceTimeoutRef.current = null
    }
    console.log('⏸️ Sequence paused')
  }

  const resumeSequence = () => {
    setIsSequencePaused(false)
    if (currentAudioRef.current) {
      currentAudioRef.current.play()
    }
    console.log('▶️ Sequence resumed')
  }

  const previousSequence = () => {
    if (currentSequenceIndex > 0) {
      const newIndex = currentSequenceIndex - 1
      setCurrentSequenceIndex(newIndex)
      
      // Clear any pending timeouts
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current)
        sequenceTimeoutRef.current = null
      }
    }
  }

  const nextSequence = () => {
    if (selectedSalah && currentSequenceIndex < selectedSalah.sequence.length - 1) {
      const newIndex = currentSequenceIndex + 1
      setCurrentSequenceIndex(newIndex)
      
      // Clear any pending timeouts
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current)
        sequenceTimeoutRef.current = null
      }
    }
  }

  // Effect to play current sequence item when index changes
  useEffect(() => {
    if (isSequencePlaying && selectedSalah && selectedSalah.sequence[currentSequenceIndex]) {
      const currentItem = selectedSalah.sequence[currentSequenceIndex]
      
      const playAudio = () => {
        const basePath = import.meta.env.BASE_URL
        const audioPath = `${basePath}assets/audio/mp3/${selectedLanguage}/${currentItem.audio}.mp3`
        
        console.log('🎵 Playing sequence audio: v1', currentItem.name, audioPath)
        
        // Stop any currently playing audio
        if (currentAudioRef.current) {
          currentAudioRef.current.pause()
          currentAudioRef.current.currentTime = 0
        }

        let audio = currentAudioRef.current

        if(!audio) {
          audio = currentAudioRef.current = new Audio(audioPath);
        } else {
          audio.src = audioPath;
          audio.load();
          audio.currentTime = 0
        }
        
        
        // currentAudioRef.current = audio
        
        audio.addEventListener('ended', () => {
          console.log('🏁 Sequence audio finished:', currentItem.name)
          if (currentAudioRef.current === audio) {
            currentAudioRef.current = null
          }
          
          // Auto-play next sequence item after 2 seconds if not paused
          if (isSequencePlaying && !isSequencePaused && selectedSalah) {
            const nextIndex = currentSequenceIndex + 1
            if (nextIndex < selectedSalah.sequence.length) {
              sequenceTimeoutRef.current = window.setTimeout(() => {
                setCurrentSequenceIndex(nextIndex)
              }, 2000)
            } else {
              // Sequence completed
              setIsSequencePlaying(false)
              console.log('🎉 Sequence completed!')
            }
          }
        })
        
        audio.addEventListener('error', (e) => {
          console.error('❌ Sequence audio error:', e)
          alert(`❌ Could not load audio: ${currentItem.name}`)
        })
        
        audio.play().catch((error) => {
          console.error('❌ Error playing sequence audio:', error)
        })
      }
      
      playAudio()
    }
  }, [currentSequenceIndex, isSequencePlaying, selectedSalah, selectedLanguage, isSequencePaused])
  
  const playAudio = (salah: Salah) => {
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      console.log('🛑 Stopped previous audio')
    }

    // Use import.meta.env.BASE_URL to get the correct base path
    const basePath = import.meta.env.BASE_URL
    const audioPath = `${basePath}assets/audio/mp3/${selectedLanguage}/${salah.audio}.mp3`
    
    console.log('Base path:', basePath)
    console.log('Attempting to play audio:', audioPath)
    console.log('Selected language:', selectedLanguage)
    console.log('Salah audio file:', salah.audio)
    
    const audio = new Audio(audioPath)
    
    // Store reference to current audio
    currentAudioRef.current = audio
    
    audio.addEventListener('loadstart', () => {
      console.log('✅ Loading started for:', audioPath)
    })
    
    audio.addEventListener('canplay', () => {
      console.log('✅ Audio can play:', audioPath)
    })
    
    audio.addEventListener('loadeddata', () => {
      console.log('✅ Audio data loaded:', audioPath)
    })
    
    audio.addEventListener('ended', () => {
      console.log('🏁 Audio finished playing:', salah.name)
      // Clear the reference when audio ends
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null
      }
      // Navigate to salah details screen when audio finishes
      setIsAudioPlaying(false)
      console.log('📄 Navigating to salah details for:', salah.name)
    })
    
    audio.addEventListener('error', (e) => {
      console.error('❌ Audio error:', e)
      console.error('❌ Failed to load audio file:', audioPath)
      
      // Clear the reference on error
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null
      }
      
      // Check if it's a 404 error
      if (audio.error) {
        console.error('❌ Audio error code:', audio.error.code)
        console.error('❌ Audio error message:', audio.error.message)
      }
      
      alert(`❌ Audio file not found: ${audioPath}\n\nPlease check:\n1. File exists in public${audioPath}\n2. File name matches exactly\n3. No typos in the path`)
    })
    
    // Try to play the audio
    audio.play()
      .then(() => {
        console.log('✅ Audio playing successfully:', audioPath)
        console.log('🎵 Now playing:', salah.name)
      })
      .catch((error) => {
        console.error('❌ Error playing audio:', error)
        
        // Clear the reference on play error
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
        
        // Different error messages for different scenarios
        if (error.name === 'NotAllowedError') {
          alert(`🔊 Browser blocked audio playback for ${salah.name}.\n\nPlease:\n1. Click anywhere on the page first\n2. Try again\n\nBrowsers require user interaction before playing audio.`)
        } else if (error.name === 'NotSupportedError') {
          alert(`❌ Audio format not supported for ${salah.name}.\n\nError: ${error.message}`)
        } else {
          alert(`❌ Could not play audio for ${salah.name}.\n\nError: ${error.message}\n\nPath: ${audioPath}`)
        }
      })
  }

  // Language selection screen
  if (!selectedLanguage) {
    return (
      <div className="app-container">
        <h1>Select Language</h1>
        <div className="language-buttons">
          <button 
            className="language-btn"
            onClick={() => handleLanguageSelect('Malayalam')}
          >
            മലയാളം
          </button>
          <button 
            className="language-btn"
            onClick={() => handleLanguageSelect('English')}
          >
            English
          </button>
        </div>
      </div>
    )
  }

  // Salah details screen (after audio finishes)
  if (selectedSalah && !isAudioPlaying) {
    const currentSequenceItem = selectedSalah.sequence[currentSequenceIndex]
    
    return (
      <div className="app-container">
        <h1>🕌 {selectedSalah.name} Prayer Guide</h1>
        <div className="header">
          
          <p>Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</p>
        </div>
        
        <div className="sequence-player">
          {/* Sequence Progress */}
          <div className="sequence-progress">
            <p>Step {currentSequenceIndex + 1} of {selectedSalah.sequence.length}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentSequenceIndex + 1) / selectedSalah.sequence.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step Display */}
          <div className="current-step">
            <h2>📿 {currentSequenceItem?.name}</h2>
            <div className="step-indicator">
              {isSequencePlaying && !isSequencePaused ? (
                <div className="pulse-circle-small"></div>
              ) : (
                <div className="static-circle"></div>
              )}
            </div>
          </div>

          {/* Sequence Controls */}
          <div className="sequence-controls">
            <button 
              className="control-btn prev-btn"
              onClick={previousSequence}
              disabled={currentSequenceIndex === 0}
            >
              ⏮️ Previous
            </button>

            {isSequencePlaying ? (
              isSequencePaused ? (
                <button 
                  className="control-btn play-pause-btn"
                  onClick={resumeSequence}
                >
                  ▶️ Resume
                </button>
              ) : (
                <button 
                  className="control-btn play-pause-btn"
                  onClick={pauseSequence}
                >
                  ⏸️ Pause
                </button>
              )
            ) : (
              <button 
                className="control-btn play-pause-btn start-btn"
                onClick={startSequence}
              >
                ▶️ Start salah
              </button>
            )}

            <button 
              className="control-btn next-btn"
              onClick={nextSequence}
              disabled={currentSequenceIndex === selectedSalah.sequence.length - 1}
            >
              ⏭️ Next
            </button>
          </div>

          {/* Sequence List */}
          <div className="sequence-list">
            <h3>Prayer Sequence:</h3>
            <div className="sequence-items">
              {selectedSalah.sequence.map((item, index) => (
                <div 
                  key={index}
                  className={`sequence-item ${index === currentSequenceIndex ? 'active' : ''} ${index < currentSequenceIndex ? 'completed' : ''}`}
                  onClick={() => setCurrentSequenceIndex(index)}
                >
                  <span className="sequence-number">{index + 1}</span>
                  <span className="sequence-name">{item.name}</span>
                  {index === currentSequenceIndex && isSequencePlaying && !isSequencePaused && (
                    <span className="playing-indicator">🎵</span>
                  )}
                  {index < currentSequenceIndex && (
                    <span className="completed-indicator">✅</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="action-buttons">
            <button 
              className="back-btn"
              onClick={goBackToSalahs}
            >
              ← Back to Salahs
            </button>
            
            <button 
              className="change-language-btn"
              onClick={() => setSelectedLanguage('')}
            >
              Change Language
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Salahs screen or audio playing screen
  return (
    <div className="app-container">
      {isAudioPlaying ? (
        // Audio playing screen
        <div className="audio-playing">
          <h1>🎵 Playing {selectedSalah?.name}</h1>
          <div className="audio-indicator">
            <div className="pulse-circle"></div>
            <p>Listen carefully to the {selectedSalah?.name} prayer...</p>
            <p className="audio-note">You will be taken to the details screen when the audio finishes</p>
          </div>
          
          <button 
            className="stop-btn"
            onClick={goBackToSalahs}
          >
            ⏹️ Stop & Go Back
          </button>
        </div>
      ) : (
        // Salah selection screen
        <>
          <h1>Select Salah you want to pray</h1>
          <div className="header">
            <p>Selected Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</p>
            <button 
              className="change-language-btn"
              onClick={() => setSelectedLanguage('')}
            >
              Change Language
            </button>
          </div>
          
          <div className="salahs-container">
            {config.salahs.map((salah: Salah, index: number) => (
              <button
                key={index}
                className="salah-btn"
                onClick={() => handleSalahSelect(salah)}
              >
                {salah.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
