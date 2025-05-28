// Cat emoticons that will be used
const CAT_EMOTICONS = ['(=^･ω･^=)', '(=｀ω´=)', '(=^･ｪ･^=)', '(=^・ω・^=)', '(=^・・^=)', '(=^･ｪ･^=)ﾉ', '(=^ ◕ᴥ◕ ^=)', '(=^･ｪ･^=)ﾉ彡☆', 'ฅ^•ﻌ•^ฅ', '=＾● ⋏ ●＾=', '=^._.^= ∫', '=^._.^= ∫', '(=^･ω･^)y＝'];

// Configuration for floating cats
const CAT_CONFIG = {
    count: 15,               // Number of cat emoticons
    minSize: 14,             // Minimum font size
    maxSize: 32,             // Maximum font size
    speed: 0.5,              // Base movement speed
    rotation: 10,            // Maximum rotation in degrees
    colors: [
        '#ff2a6d', // Neon pink
        '#05d9e8', // Neon blue
        '#d300c5', // Neon purple
        '#00ff9f'  // Neon green
    ]
};


// Create floating cat emoticons
function createFloatingCats() {
    const container = document.getElementById('cat-container');
    if (!container) return;

    for (let i = 0; i < CAT_CONFIG.count; i++) {
        const cat = document.createElement('div');
        cat.className = 'cat-emoticon';
        
        // Random properties
        const size = Math.random() * (CAT_CONFIG.maxSize - CAT_CONFIG.minSize) + CAT_CONFIG.minSize;
        const color = CAT_CONFIG.colors[Math.floor(Math.random() * CAT_CONFIG.colors.length)];
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const rotation = (Math.random() * 2 - 1) * CAT_CONFIG.rotation;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        // Apply styles
        cat.textContent = CAT_EMOTICONS[Math.floor(Math.random() * CAT_EMOTICONS.length)];
        cat.style.left = `${x}%`;
        cat.style.top = `${y}%`;
        cat.style.fontSize = `${size}px`;
        cat.style.color = color;
        cat.style.transform = `rotate(${rotation}deg)`;
        cat.style.animationDuration = `${duration}s`;
        cat.style.animationDelay = `-${delay}s`;
        
        // Add hover effect
        cat.addEventListener('mouseenter', () => {
            cat.style.animationPlayState = 'paused';
            cat.style.transform = 'scale(1.5) rotate(0deg)';
            cat.style.transition = 'transform 0.3s ease';
        });
        
        cat.addEventListener('mouseleave', () => {
            cat.style.animationPlayState = 'running';
            cat.style.transform = `rotate(${rotation}deg)`;
            cat.style.transition = 'transform 0.3s ease';
        });
        
        // Make cats move around
        animateCat(cat);
        
        container.appendChild(cat);
    }
}

// Animate cat movement
function animateCat(cat) {
    const move = () => {
        if (cat.animationPlayState === 'paused') {
            requestAnimationFrame(move);
            return;
        }
        
        const currentX = parseFloat(cat.style.left) || 50;
        const currentY = parseFloat(cat.style.top) || 50;
        
        // Random target within bounds
        const targetX = Math.random() * 90 + 5; // 5% to 95%
        const targetY = Math.random() * 90 + 5; // 5% to 95%
        
        // Calculate distance and direction
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = CAT_CONFIG.speed * (1 + Math.random() * 0.5); // Random speed variation
        
        // Move towards target
        const moveInterval = setInterval(() => {
            if (cat.animationPlayState === 'paused') {
                clearInterval(moveInterval);
                return;
            }
            
            const currentX = parseFloat(cat.style.left);
            const currentY = parseFloat(cat.style.top);
            
            // Calculate new position
            const newX = currentX + (dx / distance) * speed;
            const newY = currentY + (dy / distance) * speed;
            
            // Update position
            cat.style.left = `${newX}%`;
            cat.style.top = `${newY}%`;
            
            // Check if close to target
            const remainingDistance = Math.sqrt(
                Math.pow(targetX - newX, 2) + 
                Math.pow(targetY - newY, 2)
            );
            
            if (remainingDistance < 1) {
                clearInterval(moveInterval);
                setTimeout(move, 1000 + Math.random() * 2000); // Wait before next move
            }
        }, 30);
    };
    
    // Start moving
    move();
}

// Add glitch effect to text
document.addEventListener('DOMContentLoaded', () => {
    // Create floating cats
    createFloatingCats();
    
    // Add hover effect to all links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Play a subtle sound effect (optional)
            // You'll need to add the sound file to your project
            // const hoverSound = new Audio('hover-sound.mp3');
            // hoverSound.volume = 0.3;
            // hoverSound.play().catch(e => console.log('Could not play sound:', e));
            
            // Add a subtle shake effect
            link.style.animation = 'none';
            void link.offsetWidth; // Trigger reflow
            link.style.animation = 'glitch 0.3s linear';
        });
    });
    
    // Add scanline effect variation
    const scanline = document.querySelector('.scanline');
    if (scanline) {
        setInterval(() => {
            // Randomly change scanline speed
            const speed = 0.3 + Math.random() * 0.7;
            scanline.style.animationDuration = `${speed}s`;
            
            // Randomly change opacity
            scanline.style.opacity = 0.2 + Math.random() * 0.3;
        }, 2000);
    }
    
    // Add noise effect variation
    const noise = document.querySelector('.noise');
    if (noise) {
        setInterval(() => {
            // Randomly change noise opacity
            noise.style.opacity = 0.03 + Math.random() * 0.04;
        }, 1000);
    }
});
