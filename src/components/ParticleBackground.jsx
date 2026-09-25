import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ accent = 'blue' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const particleCount = Math.min(60, Math.floor((width * height) / 25000));
        const particles = [];

        const colors = {
            blue: ['#38bdf8', '#818cf8', '#0284c7'],
            purple: ['#c084fc', '#e879f9', '#9333ea'],
            orange: ['#fb923c', '#f59e0b', '#ea580c'],
            green: ['#34d399', '#10b981', '#059669'],
            red: ['#f43f5e', '#fb7185', '#e11d48'],
            gold: ['#facc15', '#f59e0b', '#d97706'],
            white: ['#ffffff', '#e2e8f0', '#94a3b8']
        };

        const activeColors = colors[accent] || colors.blue;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: activeColors[Math.floor(Math.random() * activeColors.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [accent]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none w-full h-full"
        />
    );
};

export default React.memo(ParticleBackground);
