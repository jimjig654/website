// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Add a simple animation to the hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition = 'opacity 1s ease, transform 1s ease';
    
    // Trigger the animation after a short delay
    setTimeout(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 300);
}

// Update year in footer
const yearElement = document.querySelector('footer p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `© ${currentYear} My Website. All rights reserved.`;
}
