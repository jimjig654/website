import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  onScared?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onScared }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [hasScaredSound, setHasScaredSound] = useState(false);
  const nyanAudioRef = useRef<HTMLAudioElement | null>(null);
  const scaredAudioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create Nyan Cat audio element
    const nyanAudio = new Audio("/nyan-cat.mp3");
    nyanAudioRef.current = nyanAudio;
    nyanAudio.loop = true;
    nyanAudio.volume = 0.5;
    nyanAudio.muted = isMuted;
    
    // Create scared sound effect (we're just simulating this)
    const scaredAudio = new Audio();
    scaredAudioRef.current = scaredAudio;
    scaredAudio.volume = 0.7;
    scaredAudio.muted = isMuted;
    
    // Handle space key to play scared sound
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isMuted && !hasScaredSound) {
        // Temporarily reduce volume of nyan cat
        if (nyanAudioRef.current) {
          nyanAudioRef.current.volume = 0.2;
        }
        
        // Play scared sound
        if (scaredAudioRef.current) {
          scaredAudioRef.current.play().catch(err => console.log("Could not play scared sound"));
        }
        
        setHasScaredSound(true);
        
        // Restore nyan cat volume after delay
        setTimeout(() => {
          if (nyanAudioRef.current) {
            nyanAudioRef.current.volume = 0.5;
          }
          setHasScaredSound(false);
        }, 3000);
        
        // Notify parent component
        if (onScared) onScared();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Return cleanup function
    return () => {
      nyanAudio.pause();
      nyanAudio.src = "";
      if (scaredAudio) {
        scaredAudio.pause();
        scaredAudio.src = "";
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMuted, hasScaredSound, onScared]);

  useEffect(() => {
    if (!nyanAudioRef.current) return;
    
    if (isMuted) {
      nyanAudioRef.current.pause();
    } else {
      // Start playing when unmuted
      const playPromise = nyanAudioRef.current.play();
      
      // Handle autoplay policy
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio started playing successfully
          })
          .catch(error => {
            console.error("Autoplay prevented:", error);
            // Reset mute state if autoplay was prevented
            setIsMuted(true);
          });
      }
    }
    
    // Update muted state
    nyanAudioRef.current.muted = isMuted;
    if (scaredAudioRef.current) {
      scaredAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleMute}
        className={`bg-white/30 backdrop-blur-sm border-white/50 hover:bg-white/40 ${!isMuted ? 'animate-pulse' : ''}`}
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>
    </div>
  );
};

export default AudioPlayer;
