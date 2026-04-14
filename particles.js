/**
 * MOTHERLODE ADVISING, LLC - GEMSTONE PARTICLES
 * Animated background particles in brand colors
 */

class GemstoneParticles {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) {
            console.warn('Particles canvas not found');
            return;
        }
        
        // Disable particles entirely on mobile devices
        if (window.innerWidth <= 768) {
            this.canvas.style.display = 'none';
            return;
        }

        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowNetwork = conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (slowNetwork || reducedMotion) {
            this.canvas.style.display = 'none';
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        
        // Gemstone colors with distribution percentages
        this.colors = [
            { color: 'rgba(2, 153, 179, 0.6)', weight: 0.25 },     // Teal - 25%
            { color: 'rgba(242, 3, 88, 0.6)', weight: 0.15 },      // Hot Pink - 15%
            { color: 'rgba(94, 24, 232, 0.6)', weight: 0.25 },     // Purple - 25%
            { color: 'rgba(83, 114, 255, 0.6)', weight: 0.25 },    // Cerulean - 25%
            { color: 'rgba(235, 219, 163, 0.7)', weight: 0.10 }    // Gold - 10%
        ];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Set canvas buffer dimensions
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Explicitly set CSS dimensions to match buffer (prevents stretching)
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Adjust particle count based on screen size
        this.particleCount = this.getParticleCount();
        
        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    getParticleCount() {
        const area = window.innerWidth * window.innerHeight;
        // Sparse density: ~1 particle per 60000 pixels (50% reduction)
        const baseCount = Math.floor(area / 60000);
        
        // Reduce on mobile
        if (window.innerWidth < 768) {
            return Math.floor(baseCount * 0.5);
        }
        
        return baseCount;
    }
    
    getRandomColor() {
        // Weighted random color selection
        const random = Math.random();
        let cumulative = 0;
        
        for (let colorData of this.colors) {
            cumulative += colorData.weight;
            if (random <= cumulative) {
                return colorData.color;
            }
        }
        
        return this.colors[0].color; // Fallback
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2, // 2-6px diameter
                color: this.getRandomColor(),
                speedY: Math.random() * 0.3 + 0.1, // Slow upward drift (0.1-0.4)
                speedX: (Math.random() - 0.5) * 0.2, // Slight horizontal sway (-0.1 to 0.1)
                opacity: Math.random() * 0.3 + 0.4, // 0.4-0.7 opacity
                shimmerPhase: Math.random() * Math.PI * 2, // Random starting shimmer phase
                shimmerSpeed: Math.random() * 0.02 + 0.01 // Shimmer speed
            });
        }
    }
    
    updateParticle(particle) {
        // Move particle upward with slight horizontal sway
        particle.y -= particle.speedY;
        particle.x += particle.speedX;
        
        // Update shimmer phase
        particle.shimmerPhase += particle.shimmerSpeed;
        
        // Calculate shimmer opacity (oscillates between base and base+0.3)
        const shimmer = Math.sin(particle.shimmerPhase) * 0.15;
        particle.currentOpacity = Math.max(0.2, Math.min(1, particle.opacity + shimmer));
        
        // Wrap around screen edges
        if (particle.y < -10) {
            particle.y = this.canvas.height + 10;
            particle.x = Math.random() * this.canvas.width;
        }
        
        if (particle.x < -10) {
            particle.x = this.canvas.width + 10;
        } else if (particle.x > this.canvas.width + 10) {
            particle.x = -10;
        }
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Apply current opacity (with shimmer)
        const color = particle.color.replace(/[\d.]+\)$/g, particle.currentOpacity + ')');
        this.ctx.fillStyle = color;
        
        // No glow effect - clean solid particles
        this.ctx.shadowBlur = 0;
        
        this.ctx.fill();
        this.ctx.closePath();
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw each particle
        for (let particle of this.particles) {
            this.updateParticle(particle);
            this.drawParticle(particle);
        }
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', () => this.resize());
    }
}

// Initialize particles when DOM is ready (desktop only)
document.addEventListener('DOMContentLoaded', () => {
    // Don't initialize particles at all on mobile
    if (window.innerWidth > 768) {
        new GemstoneParticles();
    } else {
        // Hide canvas on mobile
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
});

// Pause animation when tab is not visible (performance optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Animation will pause naturally when tab is hidden
        // requestAnimationFrame stops calling when tab is hidden
    }
});
