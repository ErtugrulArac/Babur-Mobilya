"use client";
import React, {useState, useRef} from "react";

import {motion, useMotionValue, AnimatePresence, type Variants} from "framer-motion";
import Link from "next/link";
import Image from "next/image";


interface iNavItem {
	heading: string;
	href: string;
	subheading?: string;
	imgSrc?: string;
}

interface iNavLinkProps extends iNavItem {
	setIsActive: (isActive: boolean) => void;
	index: number;
}

interface iCurvedNavbarProps {
	setIsActive: (isActive: boolean) => void;
	navItems: iNavItem[];
}

interface iHeaderProps {
	navItems?: iNavItem[];
	footer?: React.ReactNode;
}

const MENU_SLIDE_ANIMATION: Variants = {
	initial: {x: "calc(100% + 100px)"},
	enter: {x: "0", transition: {duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number]}},
	exit: {
		x: "calc(100% + 100px)",
		transition: {duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number]},
	},
};

const defaultNavItems: iNavItem[] = [
	{
		heading: "Home",
		href: "/",
		subheading: "Welcome to our website",
		imgSrc: "/images/home.jpg",
	},
	{
		heading: "Components",
		href: "/components",
		subheading: "View our components",
		imgSrc: "/images/about.jpg",
	},
	{
		heading: "Services",
		href: "/services",
		subheading: "What we offer",
		imgSrc: "/images/services.jpg",
	},
	{
		heading: "Contact",
		href: "/contact",
		subheading: "Get in touch with us",
		imgSrc: "/images/contact.jpg",
	},
];



const CustomFooter: React.FC = () => {
	return (
		<div className="flex w-full text-sm justify-between text-black px-10 md:px-24 py-5">
			<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
				<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
			</a>
			<a href="https://github.com" target="_blank" rel="noopener noreferrer">
				<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
			</a>
			<a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">
				<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
			</a>
			<a href="https://www.figma.com" target="_blank" rel="noopener noreferrer">
				<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>
			</a>
			<a href="https://www.figma.com" target="_blank" rel="noopener noreferrer">
				<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>
			</a>
		</div>
	);
};

const NavLink: React.FC<iNavLinkProps> = ({
	heading,
	href,
	setIsActive,
	index,
}) => {
	const ref = useRef<HTMLAnchorElement | null>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const handleMouseMove = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		const rect = ref.current!.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		x.set(mouseX / rect.width - 0.5);
		y.set(mouseY / rect.height - 0.5);
	};

	const handleClick = () => {
		return setIsActive(false);
	};

	const isExternalLink = index === 4 || index === 3;
	const linkProps = isExternalLink
		? {target: "_blank", rel: "noopener noreferrer"}
		: {};

	return (
		<motion.div
			onClick={handleClick}
			initial="initial"
			whileHover="whileHover"
			className="group relative flex items-center justify-between border-b border-black/30 py-4 transition-colors duration-500 md:py-8 uppercase"
			{...linkProps}
		>
			<Link ref={ref} onMouseMove={handleMouseMove} href={href}>
				<div className="relative flex items-start">
					<span className="text-black transition-colors duration-500  text-4xl font-thin mr-2">
						{index}.
					</span>
					<div className="flex flex-row gap-2">
						<motion.span
							variants={{
								initial: {x: 0},
								whileHover: {x: -16},
							}}
							transition={{
								type: "spring",
								staggerChildren: 0.075,
								delayChildren: 0.25,
							}}
							className="relative z-10 block text-4xl font-extralight text-black transition-colors duration-500  md:text-4xl"
						>
							{heading.split("").map((letter, i) => {
								return (
									<motion.span
										key={i}
										variants={{
											initial: {x: 0},
											whileHover: {x: 16},
										}}
										transition={{type: "spring"}}
										className="inline-block"
									>
										{letter}
									</motion.span>
								);
							})}
						</motion.span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

const Curve: React.FC = () => {
	const height = typeof window !== "undefined" ? window.innerHeight : 800;
	const initialPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q-100 ${height / 2} 100 0`;
	const targetPath = `M100 0 L200 0 L200 ${height} L100 ${height} Q100 ${height / 2} 100 0`;

	const curve: Variants = {
		initial: {d: initialPath},
		enter: {
			d: targetPath,
			transition: {duration: 1, ease: [0.76, 0, 0.24, 1] as [number, number, number, number]},
		},
		exit: {
			d: initialPath,
			transition: {duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number]},
		},
	};

	return (
		<svg
			className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full"
			style={{fill: "#ffffff"}}
		>
			<motion.path
				variants={curve}
				initial="initial"
				animate="enter"
				exit="exit"
			/>
		</svg>
	);
};

export const CurvedNavbar: React.FC<
	iCurvedNavbarProps & {footer?: React.ReactNode}
> = ({setIsActive, navItems, footer}) => {
	return (
		<motion.div
			variants={MENU_SLIDE_ANIMATION}
			initial="initial"
			animate="enter"
			exit="exit"
			className="h-[100dvh] w-screen max-w-screen-sm fixed right-0 top-0 z-40 bg-white"
		>
			<div className="h-full pt-24 flex flex-col justify-between">
				<div className="flex flex-col text-5xl gap-3 mt-0 px-10 md:px-24">
					<div className="border-b border-black/30 mb-0 pb-4">
						<Image
							src="/logo/baburlogo.png"
							alt="Babur Mobilya Logo"
							width={160}
							height={60}
							className="object-contain"
						/>
					</div>
					<section className="bg-transparent mt-0">
						<div className="mx-auto max-w-7xl">
							{navItems.map((item, index) => {
								return (
									<NavLink
										key={item.href}
										{...item}
										setIsActive={setIsActive}
										index={index + 1}
									/>
								);
							})}
						</div>
					</section>
				</div>
				{footer}
			</div>
			<Curve />
		</motion.div>
	);
};

const Header: React.FC<iHeaderProps> = ({
	navItems = defaultNavItems,
	footer = <CustomFooter />,
}) => {
	const [isActive, setIsActive] = useState(false);
	const openAudioRef = useRef<HTMLAudioElement | null>(null);
	const closeAudioRef = useRef<HTMLAudioElement | null>(null);

	const handleClick = () => {
		if (isActive) {
			closeAudioRef.current?.play();
		} else {
			openAudioRef.current?.play();
		}
		setIsActive(!isActive);
	};

	return (
		<>
			<Link href="/" className="fixed left-0 top-0 m-4 z-50">
				<Image
					src="/logo/baburlogo.png"
					alt="Babur Mobilya"
					width={140}
					height={52}
					className="object-contain"
					priority
				/>
			</Link>
			<div className="relative">
				<div
					onClick={handleClick}
					className="fixed -right-1 top-0 md:-right-1 m-5 z-50 w-12 h-12 rounded-none flex items-center justify-center cursor-pointer bg-white"
				>
					<div className="relative w-8 h-6 flex flex-col justify-between items-center">
						<span
							className={`block h-1 w-7 bg-black transition-transform duration-300 ${isActive ? "rotate-45 translate-y-2" : ""}`}
						></span>
						<span
							className={`block h-1 w-7 bg-black transition-opacity duration-300 ${isActive ? "opacity-0" : ""}`}
						></span>
						<span
							className={`block h-1 w-7 bg-black transition-transform duration-300 ${isActive ? "-rotate-45 -translate-y-3" : ""}`}
						></span>
					</div>
				</div>
			</div>

			<AnimatePresence mode="wait">
				{isActive && (
					<CurvedNavbar
						setIsActive={setIsActive}
						navItems={navItems}
						footer={footer}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default Header;