'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
	AtSignIcon,
	ChevronLeftIcon,
	PhoneIcon,
	SendIcon,
	UserIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function IletisimPage() {
	const [activeTab, setActiveTab] = useState<'iletisim' | 'lokasyon'>('iletisim');

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2" style={{
			colorScheme: 'light',
			['--background' as string]: '#ffffff',
			['--foreground' as string]: '#171717',
			['--muted' as string]: '#f5f5f4',
			['--muted-foreground' as string]: '#78716c',
			background: '#ffffff',
			color: '#171717',
		}}>

			{/* SOL — kodundan birebir, sadece metin değişti */}
			<div className="bg-white relative hidden h-full flex-col border-r border-gray-100 p-10 lg:flex">
				<div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
				<div className="z-10 flex items-center">
					<img src="/logo/baburlogo.png" alt="Babur Mobilya" className="h-16 w-auto" suppressHydrationWarning />
				</div>
				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl">
							&ldquo;1970&apos;den bu yana her projeyi sanata dönüştürüyoruz.
							Hayalinizdeki mobilya bir mesaj uzağınızda.&rdquo;
						</p>
						<footer className="font-mono text-sm font-semibold">
							~ Babur Mobilya
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>

			{/* SAĞ — kodunun sağ yapısı aynı, içerik form */}
			<div className="relative flex min-h-screen flex-col justify-center p-4">

				{/* Mobilde arka plan animasyonu */}
				<div className="pointer-events-none absolute inset-0 lg:hidden" style={{ opacity: 0.5 }}>
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>

				<div
					aria-hidden
					className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full" />
				</div>

				<Link href="/" className="absolute top-7 left-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
					<ChevronLeftIcon className="size-4" />
					Ana Sayfa
				</Link>

				<div className="mx-auto space-y-4 sm:w-sm pt-16 lg:pt-0">
					<div className="flex items-center lg:hidden">
						<img src="/logo/baburlogo.png" alt="Babur Mobilya" className="h-14 w-auto" suppressHydrationWarning />
					</div>

					<div className="flex flex-col space-y-1">
						<h1 className="font-heading text-2xl font-bold tracking-wide">
							Bize Ulaşın
						</h1>
						<p className="text-muted-foreground text-base">
							Projenizi anlatın, en kısa sürede dönelim.
						</p>
					</div>

					<ContactForm />

					<p className="text-muted-foreground mt-8 text-sm">
						Bilgileriniz yalnızca sizinle iletişim kurmak için kullanılır.
					</p>

					{/* Tab switcher */}
					<div className="mt-6">
						<div style={{
							display: 'flex',
							position: 'relative',
							background: '#f3f4f6',
							borderRadius: '0.75rem',
							padding: '4px',
							gap: 0,
						}}>
							{/* Glider */}
							<div style={{
								position: 'absolute',
								top: 4, bottom: 4,
								left: 4,
								width: 'calc(50% - 4px)',
								background: '#ffffff',
								borderRadius: '0.6rem',
								boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
								transition: 'transform 0.4s cubic-bezier(0.37, 1.95, 0.66, 0.56)',
								transform: activeTab === 'lokasyon' ? 'translateX(100%)' : 'translateX(0%)',
							}} />
							{(['iletisim', 'lokasyon'] as const).map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									style={{
										flex: 1,
										padding: '0.55rem 0',
										fontSize: '0.8rem',
										fontWeight: 600,
										letterSpacing: '0.02em',
										background: 'transparent',
										border: 'none',
										borderRadius: '0.6rem',
										cursor: 'pointer',
										position: 'relative',
										zIndex: 2,
										color: activeTab === tab ? '#0a0806' : '#9ca3af',
										transition: 'color 0.3s ease',
									}}
								>
									{tab === 'iletisim' ? 'İletişim' : 'Lokasyon'}
								</button>
							))}
						</div>

						{/* İletişim içeriği */}
						<div style={{ display: activeTab === 'iletisim' ? 'block' : 'none' }}
							className="mt-3 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
							{[
								{ num: '+90 535 786 52 25', name: 'Suat Babur' },
								{ num: '+90 533 717 02 39', name: 'Kamuran Babur' },
								{ num: '+90 542 467 74 94', name: 'Özer Babur' },
							].map(({ num, name }, i, arr) => (
								<a
									key={num}
									href={`tel:${num.replace(/\s/g, '')}`}
									className={`flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors${i < arr.length - 1 ? ' border-b border-gray-100' : ''}`}
								>
									<div>
										<p className="text-sm font-medium text-foreground">{name}</p>
										<p className="text-xs text-muted-foreground mt-0.5">{num}</p>
									</div>
									<PhoneIcon className="size-3.5 text-muted-foreground shrink-0" />
								</a>
							))}
						</div>

						{/* Lokasyon içeriği — her zaman DOM'da, sayfa açılırken arka planda yüklensin */}
						<div style={{ display: activeTab === 'lokasyon' ? 'block' : 'none', height: 180 }}
							className="mt-3 rounded-xl overflow-hidden border border-gray-100">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.5!2d29.4185469!3d40.7878458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cadfa135a29edb%3A0x229e2037e5c7fb89!2sBabur%20Mobilya%20%26%20Dekorasyon!5e0!3m2!1str!2str!4v1"
								width="100%"
								height="100%"
								style={{ border: 0, display: 'block' }}
								allowFullScreen
								loading="eager"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

function ContactForm() {
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => { setLoading(false); setSent(true); }, 1200);
	};

	if (sent) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col items-center gap-3 py-10 text-center"
			>
				<div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
					<SendIcon className="size-5" />
				</div>
				<p className="text-lg font-semibold">Mesajınız İletildi!</p>
				<p className="text-muted-foreground text-sm">
					En kısa sürede sizinle iletişime geçeceğiz.
				</p>
			</motion.div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-2">

			<div className="relative h-max">
				<input
					required
					placeholder="Ad Soyad"
					className="peer ps-9 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
				/>
				<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<UserIcon className="size-4" aria-hidden="true" />
				</div>
			</div>

			<div className="relative h-max">
				<input
					required
					type="email"
					placeholder="E-posta adresi"
					className="peer ps-9 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
				/>
				<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<AtSignIcon className="size-4" aria-hidden="true" />
				</div>
			</div>

			<div className="relative h-max">
				<input
					type="tel"
					placeholder="Telefon (opsiyonel)"
					className="peer ps-9 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
				/>
				<div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<PhoneIcon className="size-4" aria-hidden="true" />
				</div>
			</div>

			<select
				defaultValue=""
				className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
			>
				<option value="" disabled>Hizmet seçin</option>
				{['Mutfak Dolabı', 'Banyo Dolabı', 'Gardrop', 'Ofis Mobilyası', 'Diğer'].map(h => (
					<option key={h} value={h}>{h}</option>
				))}
			</select>

			<textarea
				required
				rows={4}
				placeholder="Projenizi kısaca anlatın..."
				className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 resize-none"
			/>

			<button
				type="submit"
				disabled={loading}
				className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
			>
				{loading
					? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					: <><SendIcon className="size-4 me-2" />Gönder</>
				}
			</button>
		</form>
	);
}

function FloatingPaths({ position }: { position: number }) {
	const paths = Array.from({ length: 36 }, (_, i) => ({
		id: i,
		d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
			380 - i * 5 * position
		} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
			152 - i * 5 * position
		} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
			684 - i * 5 * position
		} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
		color: `rgba(15,23,42,${0.1 + i * 0.03})`,
		width: 0.5 + i * 0.03,
	}));

	return (
		<div className="pointer-events-none absolute inset-0">
			<svg
				className="h-full w-full"
				style={{ color: 'rgb(15,23,42)' }}
				viewBox="0 0 696 316"
				fill="none"
			>
				<title>Background Paths</title>
				{paths.map((path) => (
					<motion.path
						key={path.id}
						d={path.d}
						stroke="currentColor"
						strokeWidth={path.width}
						strokeOpacity={0.1 + path.id * 0.03}
						initial={{ pathLength: 0.3, opacity: 0.6 }}
						animate={{
							pathLength: 1,
							opacity: [0.3, 0.6, 0.3],
							pathOffset: [0, 1, 0],
						}}
						transition={{
							duration: 20 + Math.random() * 10,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				))}
			</svg>
		</div>
	);
}
