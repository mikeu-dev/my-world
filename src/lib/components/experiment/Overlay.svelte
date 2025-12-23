<script lang="ts">
	import { experienceState } from './state.svelte';
	import { AudioManager } from '$lib/components/experiment/AudioManager';
	import { fade, fly } from 'svelte/transition';

	let isMuted = $state(false);

	function toggleAudio() {
		isMuted = !isMuted;
		AudioManager.getInstance().toggleMute(isMuted);
	}

	// Narrative Sections (Bahasa Indonesia)
	// Epic Scale: 20 Chapters
	const narrativeChapters = [
		// ERA 1: GENESIS (0-4)
		{
			title: 'KEHENINGAN ABADI',
			subtitle:
				'Di dalam ruang hampa yang tak berujung, di mana waktu belum memiliki nama, sebuah benih kesadaran mulai berdenyut perlahan, menanti panggilan takdir.',
			id: 'gen_1'
		},
		{
			title: 'DENYUT PERTAMA',
			subtitle:
				'Sebuah getaran halus merambat melalui kegelapan pekat, membangunkan partikel-partikel purba yang telah tertidur selama ribuan tahun cahaya.',
			id: 'gen_2'
		},
		{
			title: 'KABUT CAHAYA',
			subtitle:
				'Perlahan namun pasti, kabut luminesensi mulai terurai, melukiskan pola-pola abstrak di kanvas semesta yang sebelumnya mati dan dingin.',
			id: 'gen_3'
		},
		{
			title: 'KELAHIRAN BENTUK',
			subtitle:
				'Dari ketiadaan,materi mulai memadat. Geometri suci terbentuk secara spontan, menentang hukum entropi dengan keanggunan yang membisukan.',
			id: 'gen_4'
		},
		{
			title: 'FAJAR KESADARAN',
			subtitle:
				'Mata batin terbuka. Entitas ini kini menyadari keberadaannya sendiri, memandang ke dalam luasnya kemungkinan yang tak terbatas.',
			id: 'gen_5'
		},

		// ERA 2: ENERGY (5-9)
		{
			title: 'ALIRAN EMAS',
			subtitle:
				'Sungai-sungai energi mulai mengalir deras, membawa kehidupan ke setiap sudut struktur kristalin yang baru terbentuk.',
			id: 'nrg_1'
		},
		{
			title: 'MOMENTUM',
			subtitle:
				'Kecepatan bertambah. Apa yang dulunya diam kini berputar dalam tarian kosmik, menciptakan gravitasi dan magnetisme yang kuat.',
			id: 'nrg_2'
		},
		{
			title: 'GELOMBANG PANAS',
			subtitle:
				'Temperatur meningkat seiring gesekan antar dimensi. Cahaya berubah menjadi emas cair, membakar sisa-sisa keraguan.',
			id: 'nrg_3'
		},
		{
			title: 'EKSPLOSI MIKRO',
			subtitle:
				'Setiap detak adalah ledakan kecil yang melahirkan bintang-bintang baru. Semesta mini tercipta dan musnah dalam hitungan detik.',
			id: 'nrg_4'
		},
		{
			title: 'PUNCAK DAYA',
			subtitle:
				'Kekuatan mencapai titik kritis. Struktur ini bergetar hebat, siap untuk melampaui batas fisiknya menuju evolusi berikutnya.',
			id: 'nrg_5'
		},

		// ERA 3: CHAOS (10-14)
		{
			title: 'RETAKAN REALITAS',
			subtitle:
				'Tekanan menjadi terlalu besar. Garis-garis realitas mulai retak, membiarkan ketidakteraturan merembes masuk dengan liar.',
			id: 'chs_1'
		},
		{
			title: 'DISTORSI LIAR',
			subtitle:
				'Keindahan kini berubah menjadi teror yang memukau. Bentuk-bentuk tajam mencabik ruang, menciptakan simfoni visual yang memekakkan mata.',
			id: 'chs_2'
		},
		{
			title: 'FRAGMENTASI',
			subtitle:
				'Satu menjadi banyak. Kesatuan pecah menjadi serpihan-serpihan otonom yang saling bertabrakan dalam kekacauan yang sempurna.',
			id: 'chs_3'
		},
		{
			title: 'BADAI ENTROPI',
			subtitle:
				'Tidak ada lagi aturan. Hukum fisika dilanggar. Ini adalah tarian kehancuran yang mutlak, namun di dalamnya tersembunyi benih ciptaan baru.',
			id: 'chs_4'
		},
		{
			title: 'TITIK NOL',
			subtitle:
				'Di pusat badai, keheningan yang menakutkan terjadi. Segala sesuatu runtuh ke dalam dirinya sendiri sebelum ledakan terakhir.',
			id: 'chs_5'
		},

		// ERA 4: HARMONY (15-19)
		{
			title: 'TRANSFORMASI',
			subtitle:
				'Debu-debu kekacauan mulai mengendap. Dari reruntuhan, struktur baru yang lebih kuat dan lebih indah mulai menampakkan diri.',
			id: 'hrm_1'
		},
		{
			title: 'KRISTALISASI',
			subtitle:
				'Cahaya menjadi lembut. Warna-warna pastel menyelimuti permukaan yang kini halus seperti cermin, memantulkan kebijaksanaan zaman.',
			id: 'hrm_2'
		},
		{
			title: 'SIMFONI BARU',
			subtitle:
				'Semua elemen bergerak dalam keselarasan. Tidak ada lagi konflik, hanya kerja sama yang indah antar setiap partikel penyusun.',
			id: 'hrm_3'
		},
		{
			title: 'KESEIMBANGAN',
			subtitle:
				'Yin dan Yang bersatu. Gelap dan terang, diam dan gerak, semuanya menemukan tempatnya yang tepat dalam orkestra semesta ini.',
			id: 'hrm_4'
		},
		{
			title: 'KEABADIAN',
			subtitle:
				'Perjalanan berakhir di sini, namun juga baru dimulai. Sebuah siklus sempurna telah tercipta, abadi dalam keindahannya yang tak lekang oleh waktu.',
			id: 'hrm_5'
		}
	];
</script>

<!-- 
	Cinematic Overlay 
	- Minimal UI
	- Focus on Typography (Serif for titles, clean Sans for details)
	- Slow, emotional transitions
-->
<div
	class="pointer-events-none fixed top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center p-8 text-white mix-blend-difference"
>
	<!-- Simple Grain/texture overlay could go here, but keeping it clean for now -->

	<!-- Ambient Navigation / Chapter Indicator (Minimal) -->
	<header class="absolute top-8 flex w-full justify-center opacity-40">
		<div class="flex gap-4">
			{#each narrativeChapters as chapter, i}
				<div
					class="h-1 rounded-full transition-all duration-700 ease-out"
					style="width: {experienceState.section === i ? '32px' : '8px'}; background-color: white;"
				></div>
			{/each}
		</div>
	</header>

	<!-- Main Narrative Content -->
	<div
		class="pointer-events-none relative z-20 flex w-full max-w-4xl items-center justify-center text-center"
	>
		{#key experienceState.section}
			<div
				in:fly={{ y: 40, duration: 2000, delay: 300, opacity: 0 }}
				out:fade={{ duration: 1000 }}
				class="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 will-change-transform"
			>
				<!-- Chapter Number (Roman Numerals for grandeur) -->
				<div class="font-serif text-sm tracking-[0.3em] italic opacity-60">
					BAB {[
						'I',
						'II',
						'III',
						'IV',
						'V',
						'VI',
						'VII',
						'VIII',
						'IX',
						'X',
						'XI',
						'XII',
						'XIII',
						'XIV',
						'XV',
						'XVI',
						'XVII',
						'XVIII',
						'XIX',
						'XX'
					][experienceState.section]}
				</div>

				<!-- Main Title - Cinematic Typography -->
				<!-- Using a Serif stack that looks elegant -->
				<h1
					class="bg-gradient-to-b from-white to-white/60 bg-clip-text font-serif text-7xl tracking-widest text-transparent uppercase drop-shadow-2xl md:text-9xl"
				>
					{narrativeChapters[experienceState.section].title}
				</h1>

				<!-- Divider -->
				<div
					class="my-2 h-[1px] w-24 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
				></div>

				<!-- Subtitle / Narrative Text -->
				<p
					class="max-w-xl font-sans text-lg leading-relaxed font-light tracking-wide opacity-90 md:text-2xl"
				>
					{@html narrativeChapters[experienceState.section].subtitle}
				</p>
			</div>
		{/key}
	</div>

	<!-- Scroll Prompt (only active at start) -->
	{#if experienceState.section === 0 && experienceState.scrollProgress < 0.1 && !experienceState.isAutoScrolling}
		<div
			in:fade
			out:fade
			class="absolute bottom-12 flex flex-col items-center gap-4 text-center opacity-70 mix-blend-difference"
		>
			<div class="flex flex-col items-center gap-1">
				<span class="text-[10px] tracking-[0.3em] uppercase">Klik Untuk Memulai Auto-Play</span>
				<span class="text-[8px] tracking-[0.2em] uppercase opacity-60"
					>( Disarankan Menggunakan Headphone )</span
				>
			</div>
			<div class="h-12 w-[1px] animate-pulse bg-gradient-to-b from-transparent to-white"></div>
		</div>
	{/if}

	<!-- Active Indicator -->
	{#if experienceState.isAutoScrolling}
		<div
			in:fade
			out:fade
			class="pointer-events-none absolute top-8 right-8 flex items-center gap-2 mix-blend-difference"
		>
			<div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
			<span class="font-mono text-[10px] tracking-widest text-white uppercase opacity-80">REC</span>
		</div>
	{/if}

	<!-- Audio Control -->
	<button
		onclick={toggleAudio}
		class="pointer-events-auto absolute bottom-8 left-8 z-50 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white uppercase opacity-50 mix-blend-difference transition-opacity hover:cursor-pointer hover:opacity-100"
	>
		<span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
		<div class="h-2 w-2 rounded-full {isMuted ? 'bg-red-500' : 'bg-green-500'}"></div>
	</button>

	<!-- Persistent ambient footer (optional, keeping minimal) -->
	<div
		class="absolute right-8 bottom-8 hidden font-mono text-[10px] tracking-widest opacity-30 md:block"
	>
		DIMENSI {(experienceState.scrollProgress * 100).toFixed(0)}%
	</div>
</div>

<style>
	/* Custom Utilities for cinematic feel */
	/* If using a specific font from Google Fonts, ensure it is loaded in app.html. 
	   For now, strictly using system serif which usually defaults to Times or Georgia, 
	   or we can rely on Tailwind's font-serif. */
</style>
