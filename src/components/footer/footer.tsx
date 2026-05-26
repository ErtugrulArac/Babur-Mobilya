'use client';

import Image from 'next/image';

const IgSvg = () => (
	<svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
		<rect x="2" y="2" width="20" height="20" rx="5"/>
		<circle cx="12" cy="12" r="4"/>
		<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
	</svg>
)

const LnSvg = () => (
	<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10v-7a6 6 0 0 1 6-6z"/>
		<rect x="2" y="9" width="4" height="12"/>
		<circle cx="4" cy="4" r="2"/>
	</svg>
)

const koleksiyonlar = [
	{ title: 'Yaşam Alanları', href: '/urunler' },
	{ title: 'Ofis Mobilyaları', href: '/urunler' },
	{ title: 'Gardrop & Depolama', href: '/urunler' },
	{ title: 'Mutfak Üniteleri', href: '/urunler' },
];

const kurumsal = [
	{ title: 'Hakkımızda', href: '/hakkimizda' },
	{ title: 'Referanslar', href: '/hakkimizda' },
	{ title: 'Sıkça Sorulanlar', href: '/' },
	{ title: 'İletişim', href: '/iletisim' },
];

const socialLinks = [
	{ icon: <IgSvg />, link: '#' },
	{ icon: <LnSvg />, link: '#' },
	{
		icon: (
			<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
			</svg>
		),
		link: '#',
	},
];

export default function Footer({ variant = "dark" }: { variant?: "dark" | "light" }) {
	const year = new Date().getFullYear();

	const dk = variant === "dark";
	const bg        = dk ? "#000000" : "#d7d5d1";
	const divider   = dk ? "rgba(255,255,255,0.08)" : "rgba(26,23,18,0.1)";
	const borderX   = dk ? "border-white/8" : "border-black/8";
	const tagline   = dk ? "rgba(255,255,255,0.35)" : "rgba(26,23,18,0.45)";
	const label     = dk ? "rgba(255,255,255,0.3)"  : "rgba(26,23,18,0.35)";
	const link      = dk ? "rgba(255,255,255,0.35)" : "rgba(26,23,18,0.5)";
	const linkHover = dk ? "rgba(255,255,255,0.85)" : "rgba(26,23,18,0.9)";
	const iconBorder= dk ? "rgba(255,255,255,0.1)"  : "rgba(26,23,18,0.15)";
	const iconColor = dk ? "rgba(255,255,255,0.4)"  : "rgba(26,23,18,0.45)";
	const iconBgHov = dk ? "rgba(255,255,255,0.06)" : "rgba(26,23,18,0.07)";
	const iconHov   = dk ? "rgba(255,255,255,0.8)"  : "rgba(26,23,18,0.85)";
	const copy      = dk ? "rgba(255,255,255,0.2)"  : "rgba(26,23,18,0.3)";
const creditHov = dk ? "rgba(255,255,255,0.5)"  : "rgba(26,23,18,0.55)";
	const creditHov2= dk ? "rgba(255,255,255,0.9)"  : "rgba(26,23,18,0.9)";

	return (
		<footer className="relative">
			<div className={`mx-auto max-w-6xl md:border-x ${borderX}`} style={{ background: bg }}>
				<div className="absolute inset-x-0 h-px w-full" style={{ background: divider }} />
				<div className="grid max-w-6xl grid-cols-6 gap-6 p-6 md:p-10" style={{ fontFamily: "var(--font-poppins)" }}>

					{/* Logo + tagline + sosyal */}
					<div className="col-span-6 flex flex-col gap-5 md:col-span-4">
						<a href="/" className="w-max">
							<Image
								src="/logo/baburlogo.png"
								alt="Babur Mobilya"
								width={130}
								height={48}
								className="h-10 w-auto object-contain"
								style={{ filter: dk ? "none" : "brightness(0)" }}
								suppressHydrationWarning
							/>
						</a>
						<p className="max-w-sm text-sm font-light text-balance" style={{ color: tagline, lineHeight: 1.7 }}>
							El işçiliği ve modern tasarımın kesişiminde, her mekâna anlam katan özel mobilya koleksiyonları. Est. 1970.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((item, i) => (
								<a key={i}
									className="rounded-md p-1.5 transition-colors duration-200"
									style={{ border: `1px solid ${iconBorder}`, color: iconColor }}
									target="_blank" rel="noopener noreferrer" href={item.link}
									onMouseEnter={e => { e.currentTarget.style.background = iconBgHov; e.currentTarget.style.color = iconHov; }}
									onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = iconColor; }}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>

					{/* Koleksiyonlar */}
					<div className="col-span-3 w-full md:col-span-1">
						<span className="mb-3 block text-xs font-semibold tracking-widest uppercase" style={{ color: label }}>
							Koleksiyonlar
						</span>
						<div className="flex flex-col gap-1.5">
							{koleksiyonlar.map(({ href, title }, i) => (
								<a key={i} href={href}
									className="w-max py-0.5 text-sm font-light transition-colors duration-200"
									style={{ color: link }}
									onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
									onMouseLeave={e => (e.currentTarget.style.color = link)}
								>{title}</a>
							))}
						</div>
					</div>

					{/* Kurumsal */}
					<div className="col-span-3 w-full md:col-span-1">
						<span className="mb-3 block text-xs font-semibold tracking-widest uppercase" style={{ color: label }}>
							Kurumsal
						</span>
						<div className="flex flex-col gap-1.5">
							{kurumsal.map(({ href, title }, i) => (
								<a key={i} href={href}
									className="w-max py-0.5 text-sm font-light transition-colors duration-200"
									style={{ color: link }}
									onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
									onMouseLeave={e => (e.currentTarget.style.color = link)}
								>{title}</a>
							))}
						</div>
					</div>
				</div>

				<div className="absolute inset-x-0 h-px w-full" style={{ background: divider }} />
				<div className="flex max-w-6xl flex-col md:flex-row justify-between gap-2 px-6 md:px-10 pt-3 pb-6" style={{ fontFamily: "var(--font-poppins)" }}>
					<p className="text-xs font-light" style={{ color: copy }}>
						© {year} Babur Mobilya. Tüm hakları saklıdır.
					</p>
					<p className="text-xs font-light" style={{ color: "#ffffff" }}>
						Tasarım & Geliştirme{' '}
						<a href="https://arlanmedya.com" target="_blank" rel="noopener noreferrer"
							className="font-semibold transition-colors duration-200"
							style={{ color: creditHov }}
							onMouseEnter={e => (e.currentTarget.style.color = creditHov2)}
							onMouseLeave={e => (e.currentTarget.style.color = creditHov)}
						>ArlanMedya</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
