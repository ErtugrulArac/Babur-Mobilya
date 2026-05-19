"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CurvedNavbar } from "./sidebar";

const navItems = [
	{ heading: "Anasayfa", href: "/" },
	{ heading: "Ürünler", href: "/urunler" },
	{ heading: "Hakkımızda", href: "/hakkimizda" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 2.5);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navBg = scrolled
		? "bg-white shadow-lg border-transparent"
		: "bg-transparent border border-white/30";

	const textColor = scrolled ? "text-gray-900" : "text-white";
	const linkColor = scrolled ? "text-gray-700 hover:text-black" : "text-white/80 hover:text-white";
	const ctaBg = scrolled
		? "bg-gray-900 text-white hover:bg-black"
		: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm";
	const hamburgerColor = (scrolled || isOpen) ? "bg-black" : "bg-white";

	return (
		<>
			{/* Desktop */}
			<header className="fixed top-5 left-0 right-0 z-50 hidden md:flex justify-center px-6">
				<nav className={`relative flex items-center justify-between w-full max-w-4xl rounded-full px-6 py-3 overflow-visible transition-all duration-500 ${navBg}`}>
					{/* Genişlik placeholder — flex düzenini korur, yüksekliği etkilemez */}
					<div className="w-[190px] shrink-0" />
					<Link href="/" className="absolute left-6 top-1/2 -translate-y-1/2">
						<Image
							src="/logo/baburlogo.png"
							alt="Babür Mobilya"
							width={190}
							height={70}
							className="object-contain h-[70px] w-auto"
							priority
						/>
					</Link>

					<div className="flex items-center gap-7">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`text-sm transition-colors duration-500 ${linkColor}`}
							>
								{item.heading}
							</Link>
						))}
					</div>

					<Link
						href="/iletisim"
						className={`text-sm font-medium px-5 py-2 rounded-full transition-all duration-500 ${ctaBg}`}
					>
						İletişim
					</Link>
				</nav>
			</header>

			{/* Mobile */}
			<div className="fixed top-5 left-0 right-0 z-50 md:hidden flex justify-center px-5">
				<div className={`flex items-center justify-between w-full max-w-sm rounded-full px-4 py-2.5 transition-all duration-500 ${navBg}`}>
					<Link href="/">
						<Image
							src="/logo/baburlogo.png"
							alt="Babür Mobilya"
							width={110}
							height={34}
							className="object-contain h-7 w-auto"
							priority
						/>
					</Link>
					<button
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Menüyü aç/kapat"
						className="w-10 h-10 flex flex-col justify-center items-center gap-[5px]"
					>
						<span className={`block h-[2px] w-6 transition-all duration-300 origin-center ${hamburgerColor} ${isOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
						<span className={`block h-[2px] w-6 transition-all duration-300 ${hamburgerColor} ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
						<span className={`block h-[2px] w-6 transition-all duration-300 origin-center ${hamburgerColor} ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
					</button>
				</div>
			</div>

			{/* Mobile sidebar */}
			<AnimatePresence mode="wait">
				{isOpen && (
					<CurvedNavbar
						setIsActive={setIsOpen}
						navItems={[...navItems, { heading: "İletişim", href: "/iletisim" }]}
					/>
				)}
			</AnimatePresence>
		</>
	);
}