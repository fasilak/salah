import { useState, useRef } from 'react'
import './App.css'
import config from './config.json'

interface Salah {
  name: string;
  audio: string;
}

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedSalah, setSelectedSalah] = useState<Salah | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  
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
    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
  }
  
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
    return (
      <div className="app-container">
        <h1>{selectedSalah.name} Prayer Details</h1>
        {/* <div className="header">
          <p>Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</p>
        </div> */}
        
        <div className="salah-details">
          <div className="salah-info">
            <h2>🕌 {selectedSalah.name}</h2>
            {/* <p>You have just completed listening to the {selectedSalah.name} prayer audio.</p> */}
            
            <div className="salah-description">
              <h3>About {selectedSalah.name}:</h3>
              {selectedSalah.name === 'Fajr' && (
                <p>Fajr is the dawn prayer, performed before sunrise. It consists of 2 Rakat and is one of the five daily obligatory prayers.</p>
              )}
              {selectedSalah.name === 'Lohar' && (
                <p>Dhuhr (Lohar) is the midday prayer, performed after the sun passes its zenith. It consists of 4 Rakat.</p>
              )}
              {selectedSalah.name === 'Asr' && (
                <p>Asr is the afternoon prayer, performed in the late afternoon. It consists of 4 Rakat.</p>
              )}
              {selectedSalah.name === 'Maghrib' && (
                <p>Maghrib is the sunset prayer, performed just after sunset. It consists of 3 Rakat.</p>
              )}
              {selectedSalah.name === 'Isha' && (
                <p>Isha is the night prayer, performed after the twilight has disappeared. It consists of 4 Rakat.</p>
              )}
            </div>
            
            <div className="action-buttons">
              {/* <button 
                className="play-again-btn"
                onClick={() => handleSalahSelect(selectedSalah)}
              >
                🔄 Play Again
              </button> */}
              
              <button 
                className="back-btn"
                onClick={goBackToSalahs}
              >
                ← Back to Salahs
              </button>
              
              {/* <button 
                className="change-language-btn"
                onClick={() => setSelectedLanguage('')}
              >
                Change Language
              </button> */}
            </div>
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
