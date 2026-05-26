'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = container.clientWidth || 600;
		const height = container.clientHeight || 400;

		const SEPARATION = 100;
		const AMOUNTX = 30;
		const AMOUNTY = 30;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
		camera.position.set(0, 355, 1000);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.setClearColor(0xffffff, 1);

		container.appendChild(renderer.domElement);

		const positions: number[] = [];
		const colors: number[] = [];
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions.push(
					ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
					0,
					iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
				);
				colors.push(0, 0, 0);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 6,
			vertexColors: true,
			transparent: true,
			opacity: 0.85,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number;

		const animate = () => {
			animationId = requestAnimationFrame(animate);
			const posAttr = geometry.attributes.position;
			const arr = posAttr.array as Float32Array;
			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					arr[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}
			posAttr.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.03;
		};

		const handleResize = () => {
			const w = container.clientWidth;
			const h = container.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};

		window.addEventListener('resize', handleResize);
		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
			scene.traverse((obj) => {
				if (obj instanceof THREE.Points) {
					obj.geometry.dispose();
					(obj.material as THREE.Material).dispose();
				}
			});
			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('absolute inset-0 w-full h-full', className)}
			{...props}
		/>
	);
}
