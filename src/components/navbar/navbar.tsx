"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CurvedNavbar } from "./sidebar";

const navItems = [
	{ heading: "Anasayfa", href: "/" },
	{ heading: "Hizmetler", href: "/urunler" },
	{ heading: "Süreç", href: "/surec" },
	{ heading: "Hakkımızda", href: "/hakkimizda" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [lightBg, setLightBg] = useState(false);

	useEffect(() => {
		const check = () => {
			// dark-forced flag varsa (GSAP siyah kart açık) — beyaz navbar
			if (document.body.dataset.navbarDark === "1") { setLightBg(false); return; }

			const sections = document.querySelectorAll('[data-light-nav]');
			let found = false;
			sections.forEach(el => {
				const rect = el.getBoundingClientRect();
				if (rect.top < 80 && rect.bottom > 20) found = true;
			});
			setLightBg(found);
		};
		check();
		window.addEventListener('scroll', check, { passive: true });
		window.addEventListener('navbar-check', check);
		return () => {
			window.removeEventListener('scroll', check);
			window.removeEventListener('navbar-check', check);
		};
	}, []);

	const navBg = lightBg ? "bg-transparent border border-black/20" : "bg-transparent border border-white/20";
	const linkColor = lightBg ? "text-gray-700 hover:text-black" : "text-white/80 hover:text-white";
	const ctaBg = lightBg ? "bg-black/10 text-gray-900 hover:bg-black/20" : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm";
	const hamburgerColor = (isOpen || lightBg) ? "bg-black" : "bg-white";

	return (
		<>
			{/* Desktop */}
			<header className="fixed top-5 left-0 right-0 z-50 hidden md:flex justify-center px-6">
				<nav className={`relative flex items-center justify-between w-full max-w-4xl rounded-full px-6 py-3 overflow-visible transition-all duration-500 ${navBg}`}>
					{/* Genişlik placeholder — flex düzenini korur, yüksekliği etkilemez */}
					<div className="w-47.5 shrink-0" />
					<Link href="/" className="absolute left-6 top-1/2 -translate-y-1/2">
						<Image
							src="/logo/baburlogo.png"
							alt="Babur Mobilya"
							width={190}
							height={70}
							className="object-contain h-17.5 w-auto"
							priority
						/>
					</Link>

					<div className="flex items-center gap-7">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`text-sm font-semibold transition-colors duration-500 ${linkColor}`}
								style={{ fontFamily: "var(--font-general)", letterSpacing: "0.01em" }}
							>
								{item.heading}
							</Link>
						))}
					</div>

					<Link
						href="/iletisim"
						className={`text-sm font-bold px-5 py-2 rounded-full transition-all duration-500 ${ctaBg}`}
						style={{ fontFamily: "var(--font-general)", letterSpacing: "0.01em" }}
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
							alt="Babur Mobilya"
							width={110}
							height={34}
							className="object-contain h-7 w-auto"
							priority
						/>
					</Link>
					<button
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Menüyü aç/kapat"
						className="w-10 h-10 flex flex-col justify-center items-center gap-1.25"
					>
						<span className={`block h-0.5 w-6 transition-all duration-300 origin-center ${hamburgerColor} ${isOpen ? "rotate-45 translate-y-1.75" : ""}`} />
						<span className={`block h-0.5 w-6 transition-all duration-300 ${hamburgerColor} ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
						<span className={`block h-0.5 w-6 transition-all duration-300 origin-center ${hamburgerColor} ${isOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
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