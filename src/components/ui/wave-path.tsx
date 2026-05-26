'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';

type WavePathProps = React.ComponentProps<'div'>;

export function WavePath({ className, ...props }: WavePathProps) {
	const path = useRef<SVGPathElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef(0);
	const xRef = useRef(0.5);
	const timeRef = useRef(Math.PI / 2);
	const reqIdRef = useRef<number | null>(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	const getWidth = () => containerRef.current?.clientWidth ?? window.innerWidth * 0.55;

	const setPath = (progress: number) => {
		if (!path.current) return;
		const width = getWidth();
		path.current.setAttributeNS(
			null,
			'd',
			`M0 100 Q${width * xRef.current} ${100 + progress * 0.6}, ${width} 100`,
		);
	};

	// Mobile: continuous sine wave auto-animation
	useEffect(() => {
		if (!isMobile) {
			setPath(0);
			return;
		}
		let t = 0;
		let animId: number;
		const loop = () => {
			t += 0.035;
			xRef.current = 0.5 + Math.sin(t * 0.6) * 0.12;
			setPath(Math.sin(t) * 70);
			animId = requestAnimationFrame(loop);
		};
		animId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animId);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile]);

	const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

	const manageMouseEnter = () => {
		if (reqIdRef.current) {
			cancelAnimationFrame(reqIdRef.current);
			timeRef.current = Math.PI / 2;
			progressRef.current = 0;
		}
	};

	const manageMouseMove = (e: React.MouseEvent) => {
		if (!path.current) return;
		const pathBound = path.current.getBoundingClientRect();
		xRef.current = (e.clientX - pathBound.left) / pathBound.width;
		progressRef.current += e.movementY;
		setPath(progressRef.current);
	};

	const manageMouseLeave = () => { animateOut(); };

	const animateOut = () => {
		const newProgress = progressRef.current * Math.sin(timeRef.current);
		progressRef.current = lerp(progressRef.current, 0, 0.025);
		timeRef.current += 0.2;
		setPath(newProgress);
		if (Math.abs(progressRef.current) > 0.75) {
			reqIdRef.current = requestAnimationFrame(animateOut);
		} else {
			timeRef.current = Math.PI / 2;
			progressRef.current = 0;
		}
	};

	return (
		<div
			ref={containerRef}
			className={cn('relative h-px w-[55vw] md:w-[65vw] max-w-lg md:max-w-2xl', className)}
			{...props}
		>
			{!isMobile && (
				<div
					onMouseEnter={manageMouseEnter}
					onMouseMove={manageMouseMove}
					onMouseLeave={manageMouseLeave}
					className="relative -top-5 z-10 h-10 w-full hover:-top-[150px] hover:h-[300px]"
				/>
			)}
			<svg className="absolute -top-[100px] h-[300px] w-full">
				<path ref={path} className="fill-none stroke-current" strokeWidth={1.5} />
			</svg>
		</div>
	);
}
