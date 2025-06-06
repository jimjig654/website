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

// Cursor Trail Effect
class ParticleTrail {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1500';
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse move listener
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.addParticle();
        });
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addParticle() {
        const colors = ['#ff2a6d', '#05d9e8', '#d300c5', '#00ff9f'];
        this.particles.push({
            x: this.mouseX,
            y: this.mouseY,
            size: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= 0.02;
            p.x += p.speedX;
            p.y += p.speedY;
            p.size *= 0.95;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
            
            if (p.life <= 0 || p.size < 0.5) {
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail effect and audio player
document.addEventListener('DOMContentLoaded', () => {
    new ParticleTrail();
    
    // Audio player setup
    const audio = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = 'Pause Music';
            playPauseBtn.classList.add('playing');
        } else {
            audio.pause();
            playPauseBtn.textContent = 'Play Music';
            playPauseBtn.classList.remove('playing');
        }
    });
    
    // Add spans back after text content change
    const updateButtonSpans = () => {
        const spans = playPauseBtn.querySelectorAll('span');
        if (spans.length === 0) {
            for (let i = 0; i < 4; i++) {
                const span = document.createElement('span');
                playPauseBtn.appendChild(span);
            }
        }
    };
    
    // Update button spans when text changes
    const observer = new MutationObserver(updateButtonSpans);
    observer.observe(playPauseBtn, { childList: true });
});
