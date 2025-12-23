<script lang="ts">
	import { experienceState } from './state.svelte';
	import { fade, fly } from 'svelte/transition';

	// Narrative Sections (Bahasa Indonesia)
	// Cinematic, poetic, and immersive.
	const narrativeChapters = [
		{
			title: 'KEHENINGAN',
			subtitle: 'Di dalam ketiadaan, sebuah nafas berhembus perlahan.',
			id: 'genesis'
		},
		{
			title: 'ALIRAN',
			subtitle: 'Energi mulai berkumpul, membentuk sebuah tujuan yang abadi.',
			id: 'energy'
		},
		{
			title: 'GEJOLAK',
			subtitle: 'Struktur retak. Ketidakpastian mengambil alih realitas.',
			id: 'chaos'
		},
		{
			title: 'HARMONI',
			subtitle: 'Dari kekacauan, lahirlah bentuk baru yang sempurna.',
			id: 'harmony'
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
					BAB {['I', 'II', 'III', 'IV'][experienceState.section]}
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
	{#if experienceState.section === 0 && experienceState.scrollProgress < 0.1}
		<div
			in:fade
			out:fade
			class="absolute bottom-12 flex flex-col items-center gap-4 text-center opacity-70 mix-blend-difference"
		>
			<div class="flex flex-col items-center gap-1">
				<span class="text-[10px] tracking-[0.3em] uppercase">Klik Atau Scroll Untuk Memulai</span>
				<span class="text-[8px] tracking-[0.2em] uppercase opacity-60"
					>( Disarankan Menggunakan Headphone )</span
				>
			</div>
			<div class="h-12 w-[1px] animate-pulse bg-gradient-to-b from-transparent to-white"></div>
		</div>
	{/if}

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
