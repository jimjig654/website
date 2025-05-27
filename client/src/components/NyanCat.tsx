import React, { useEffect, useState, useRef } from "react";

// Cat expressions
const catExpressions = [
  "^ω^",   // happy
  "=^-^=", // smiling
  "=^•ω•^=", // curious
  "≧◡≦",  // excited
  "(^•o•^)", // surprised
  "( ^..^)", // whiskers
  "=＾● ⋏ ●＾=", // wide eyes
  "=^._.^= ∫", // classic cat
  "ฅ^•ﻌ•^ฅ", // playful
];

const scaredExpression = "(°ロ°)"; // scared expression

// Cat colors
const catColors = [
  "#f5a9b8", // pink
  "#8bc34a", // light green
  "#9c27b0", // purple
  "#ff9800", // orange
  "#2196f3", // blue
  "#e91e63", // rose
  "#ffeb3b", // yellow
  "#ff5722", // deep orange
  "#673ab7", // deep purple
];

interface CatState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  expression: string;
  color: string;
  isScared: boolean;
  size: number;
  rainbowLength: number;
}

interface NyanCatProps {
  index: number;
  mousePosition: { x: number; y: number } | null;
  allCats: CatState[];
  isScared: boolean;
  updateCatState: (index: number, newState: Partial<CatState>) => void;
}

// Component for a single Nyan Cat with rainbow trail
const NyanCat: React.FC<NyanCatProps> = ({ 
  index, 
  mousePosition, 
  allCats, 
  isScared,
  updateCatState 
}) => {
  const catRef = useRef<HTMLDivElement>(null);
  const cat = allCats[index];
  
  // Physics constants
  const maxSpeed = isScared ? 15 : 4;
  const mouseRepelStrength = isScared ? 0.8 : 0.3;
  const catRepelStrength = 0.12;
  const catAttractStrength = 0.01;
  const friction = 0.97; // Increased to make movement smoother
  const edgeBounce = 0.8; // Increased for more lively bounces
  const mouseInfluenceRadius = 150;
  const catInfluenceRadius = 80; // Reduced to prevent too much clustering
  
  // Rainbow trail colors
  const rainbowColors = [
    "#ff0000", "#ff7f00", "#ffff00", 
    "#00ff00", "#0000ff", "#4b0082", "#8b00ff"
  ];

  // Update cat physics
  useEffect(() => {
    let animationFrameId: number;
    
    const updatePhysics = () => {
      if (!cat) return;
      
      // Apply mouse influence if mouse is present
      let acceleration = { x: 0, y: 0 };
      
      if (mousePosition) {
        const dx = cat.position.x - mousePosition.x;
        const dy = cat.position.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only apply force if mouse is close enough
        if (distance < mouseInfluenceRadius) {
          // Calculate repulsion strength (stronger when closer)
          const strength = mouseRepelStrength * (1 - distance / mouseInfluenceRadius);
          // Normalize direction vector
          const angle = Math.atan2(dy, dx);
          
          // Apply force away from mouse
          acceleration.x += Math.cos(angle) * strength;
          acceleration.y += Math.sin(angle) * strength;
        }
      }
      
      // Apply influence from other cats
      allCats.forEach((otherCat, otherIndex) => {
        if (otherIndex === index) return; // Skip self
        
        const dx = cat.position.x - otherCat.position.x;
        const dy = cat.position.y - otherCat.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < catInfluenceRadius && distance > 0) {
          // Normalize direction vector
          const angle = Math.atan2(dy, dx);
          
          if (distance < 40) {
            // Repel if too close
            const repelStrength = catRepelStrength * (1 - distance / 40);
            acceleration.x += Math.cos(angle) * repelStrength;
            acceleration.y += Math.sin(angle) * repelStrength;
          } else {
            // Attract if at medium distance (creates flocking behavior)
            const attractStrength = catAttractStrength;
            acceleration.x -= Math.cos(angle) * attractStrength;
            acceleration.y -= Math.sin(angle) * attractStrength;
          }
        }
      });
      
      // Scared behavior - run to the edge of the screen
      if (isScared) {
        // Find the nearest edge and run toward it
        const distToLeft = cat.position.x;
        const distToRight = window.innerWidth - cat.position.x;
        const distToTop = cat.position.y;
        const distToBottom = window.innerHeight - cat.position.y;
        
        // Find the nearest edge
        const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
        
        if (minDist === distToLeft) {
          acceleration.x -= 0.2;
        } else if (minDist === distToRight) {
          acceleration.x += 0.2;
        } else if (minDist === distToTop) {
          acceleration.y -= 0.2;
        } else {
          acceleration.y += 0.2;
        }
      } else {
        // Normal behavior - random movement with occasional changes in direction
        // Add slight random acceleration to create more varied movements
        acceleration.x += (Math.random() - 0.5) * 0.05;
        acceleration.y += (Math.random() - 0.5) * 0.05;
        
        // Occasionally change direction more dramatically (every ~3 seconds for each cat)
        if (Math.random() < 0.01) {
          acceleration.x += (Math.random() - 0.5) * 0.5;
          acceleration.y += (Math.random() - 0.5) * 0.5;
        }
      }
      
      // Update velocity and apply friction
      const newVelocity = {
        x: (cat.velocity.x + acceleration.x) * friction,
        y: (cat.velocity.y + acceleration.y) * friction,
      };
      
      // Limit max speed
      const speed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
      if (speed > maxSpeed) {
        newVelocity.x = (newVelocity.x / speed) * maxSpeed;
        newVelocity.y = (newVelocity.y / speed) * maxSpeed;
      }
      
      // Update position
      let newPosition = {
        x: cat.position.x + newVelocity.x,
        y: cat.position.y + newVelocity.y,
      };
      
      // Bounce off the edges
      const catWidth = cat.size;
      const catHeight = cat.size * 0.8;
      const borderPadding = 5;
      
      if (isScared) {
        // When scared, cats can exit the screen
        if (newPosition.x < 0) {
          newPosition.x = 0;
          newVelocity.x = Math.abs(newVelocity.x) * edgeBounce;
        } else if (newPosition.x > window.innerWidth) {
          newPosition.x = window.innerWidth;
          newVelocity.x = -Math.abs(newVelocity.x) * edgeBounce;
        }
        
        if (newPosition.y < 0) {
          newPosition.y = 0;
          newVelocity.y = Math.abs(newVelocity.y) * edgeBounce;
        } else if (newPosition.y > window.innerHeight) {
          newPosition.y = window.innerHeight;
          newVelocity.y = -Math.abs(newVelocity.y) * edgeBounce;
        }
      } else {
        // When not scared, bounce properly off the borders
        if (newPosition.x < borderPadding) {
          newPosition.x = borderPadding;
          newVelocity.x = Math.abs(newVelocity.x) * edgeBounce;
        } else if (newPosition.x > window.innerWidth - catWidth - borderPadding) {
          newPosition.x = window.innerWidth - catWidth - borderPadding;
          newVelocity.x = -Math.abs(newVelocity.x) * edgeBounce;
        }
        
        if (newPosition.y < borderPadding) {
          newPosition.y = borderPadding;
          newVelocity.y = Math.abs(newVelocity.y) * edgeBounce;
        } else if (newPosition.y > window.innerHeight - catHeight - borderPadding) {
          newPosition.y = window.innerHeight - catHeight - borderPadding;
          newVelocity.y = -Math.abs(newVelocity.y) * edgeBounce;
        }
      }
      
      // If cat is scared and out of bounds, remove it
      if (isScared && 
          (newPosition.x <= -50 || 
           newPosition.x >= window.innerWidth + 50 || 
           newPosition.y <= -50 || 
           newPosition.y >= window.innerHeight + 50)) {
        // Mark as out of bounds
        updateCatState(index, {
          position: newPosition,
          velocity: newVelocity,
          acceleration: acceleration,
          isScared: true
        });
      } else {
        // Make sure velocity never gets too close to zero
        // This prevents cats from getting "stuck"
        if (!isScared && Math.abs(newVelocity.x) < 0.2 && Math.abs(newVelocity.y) < 0.2) {
          newVelocity.x += (Math.random() - 0.5) * 0.5;
          newVelocity.y += (Math.random() - 0.5) * 0.5;
        }
        
        // Update state
        updateCatState(index, {
          position: newPosition,
          velocity: newVelocity,
          acceleration: acceleration,
          isScared: isScared
        });
      }
      
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    
    animationFrameId = requestAnimationFrame(updatePhysics);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cat, mousePosition, allCats, isScared, index, updateCatState]);

  // Generate rainbow trail segments
  const renderRainbowTrail = () => {
    return rainbowColors.slice(0, cat.rainbowLength).map((color, i) => (
      <div
        key={i}
        className="absolute rounded-sm"
        style={{
          backgroundColor: color,
          width: `${cat.size * 0.7}px`,
          height: `${cat.size * 0.4}px`,
          right: cat.size * 1.2 + i * 5,
          top: cat.size * 0.5,
          opacity: 0.8,
          transform: `scaleY(${1 + Math.sin(Date.now() / 100 + i) * 0.2})` // Pulsing effect
        }}
      />
    ));
  };

  // Don't render if cat is scared and out of bounds
  if (isScared && (
      cat.position.x <= -50 || 
      cat.position.x >= window.innerWidth + 50 || 
      cat.position.y <= -50 || 
      cat.position.y >= window.innerHeight + 50
  )) {
    return null;
  }
  
  return (
    <div
      ref={catRef}
      className="fixed z-10 pointer-events-none"
      style={{
        transform: `translate(${cat.position.x}px, ${cat.position.y}px)`,
        transition: "transform 0.05s linear"
      }}
    >
      {/* Rainbow trail */}
      {!isScared && renderRainbowTrail()}
      
      {/* Cat body */}
      <div 
        className="relative rounded-md overflow-hidden flex items-center justify-center"
        style={{
          width: `${cat.size}px`,
          height: `${cat.size * 0.8}px`,
          backgroundColor: cat.color,
          transition: "background-color 0.2s",
          transform: `rotate(${Math.atan2(cat.velocity.y, cat.velocity.x) * 180 / Math.PI}deg)`,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
        }}
      >
        <span 
          className="text-center font-bold"
          style={{ 
            fontSize: `${cat.size * 0.25}px`,
            color: "#000000"
          }}
        >
          {cat.isScared ? scaredExpression : cat.expression}
        </span>
      </div>
    </div>
  );
};

// Component to manage multiple Nyan Cats
const NyanCats: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isScared, setIsScared] = useState(false);
  const [cats, setCats] = useState<CatState[]>([]);
  const catCount = 80;
  
  // Initialize cats
  useEffect(() => {
    const initialCats = Array.from({ length: catCount }, (_, i) => ({
      position: { 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight 
      },
      velocity: { 
        x: (Math.random() * 4 - 2), 
        y: (Math.random() * 4 - 2) 
      },
      acceleration: { x: 0, y: 0 },
      expression: catExpressions[Math.floor(Math.random() * catExpressions.length)],
      color: catColors[Math.floor(Math.random() * catColors.length)],
      isScared: false,
      size: 35, // Fixed size for all cats
      rainbowLength: Math.floor(Math.random() * 3) + 5 // Random rainbow length 5-7 segments
    }));
    
    setCats(initialCats);
  }, []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Listen for space key to trigger scared mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsScared(true);
        
        // Reset scared state after cats have run away
        setTimeout(() => {
          setIsScared(false);
          
          // Reset cats to new positions when they return
          setCats(prev => prev.map(cat => ({
            ...cat,
            position: { 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            },
            velocity: { 
              x: (Math.random() * 4 - 2), 
              y: (Math.random() * 4 - 2) 
            },
            acceleration: { x: 0, y: 0 },
            isScared: false,
            expression: catExpressions[Math.floor(Math.random() * catExpressions.length)],
          })));
        }, 3000);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Function to update a specific cat's state
  const updateCatState = (index: number, newState: Partial<CatState>) => {
    setCats(prevCats => {
      const newCats = [...prevCats];
      newCats[index] = { ...newCats[index], ...newState };
      return newCats;
    });
  };
  
  return (
    <>
      {cats.map((_, index) => (
        <NyanCat 
          key={index} 
          index={index} 
          mousePosition={mousePosition}
          allCats={cats}
          isScared={isScared}
          updateCatState={updateCatState}
        />
      ))}
      
      {/* Instructions for spacebar */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/30 backdrop-blur-sm p-2 rounded-md text-white text-sm">
        Press <kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> to scare the cats!
      </div>
    </>
  );
};

export default NyanCats;
