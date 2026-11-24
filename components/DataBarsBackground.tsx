
import React, { useRef, useEffect } from 'react';

const DataBarsBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let bars: Bar[] = [];
        const barCount = 25;
        
        const colors = [
            'rgba(168, 85, 247, 0.4)', // purple-500
            'rgba(59, 130, 246, 0.4)',  // blue-500
            'rgba(245, 158, 11, 0.4)',  // amber-500
            'rgba(236, 72, 153, 0.4)',  // pink-500
            'rgba(20, 184, 166, 0.4)',  // teal-500
            'rgba(132, 204, 22, 0.4)'   // lime-500
        ];

        const resizeCanvas = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            init();
        };

        class Bar {
            x: number;
            y: number;
            height: number;
            width: number;
            speed: number;
            color: string;

            constructor() {
                if(!canvas) return;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.height = Math.random() * 80 + 20;
                this.width = Math.random() * 2 + 1;
                this.speed = Math.random() * 0.4 + 0.1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if(!ctx) return;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            update() {
                if(!canvas) return;
                this.y -= this.speed;
                if (this.y + this.height < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
            }
        }

        const init = () => {
            bars = [];
            for (let i = 0; i < barCount; i++) {
                bars.push(new Bar());
            }
        };

        const animate = () => {
            if(!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bars.forEach(b => {
                b.update();
                b.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        
        const resizeObserver = new ResizeObserver(() => resizeCanvas());
        resizeObserver.observe(container);

        resizeCanvas();
        animate();

        return () => {
            resizeObserver.unobserve(container);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default React.memo(DataBarsBackground);