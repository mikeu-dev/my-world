<script lang="ts">
	import { onMount } from 'svelte';
	import Overlay from '$lib/components/experiment/Overlay.svelte';
	import { AudioManager } from '$lib/components/experiment/AudioManager';
	import { experienceState } from '$lib/components/experiment/state.svelte';

	let Scene: any = $state(null);
	let audioStarted = $state(false);

	onMount(async () => {
		const module = await import('$lib/components/experiment/Scene.svelte');
		Scene = module.default;
	});

	async function startExperience() {
		if (!audioStarted) {
			// First Interaction: Initialize and Start
			await AudioManager.getInstance().initialize();
			audioStarted = true;
			startAutoScroll();
			return;
		}

		// Subsequent clicks stop auto-scroll (User taking control)
		if (experienceState.isAutoScrolling) {
			stopAutoScroll();
		}
	}

	let autoScrollFrame: number | null = null;
	let scrollAccumulator = 0;

	function startAutoScroll() {
		if (autoScrollFrame) cancelAnimationFrame(autoScrollFrame);
		experienceState.isAutoScrolling = true;

		const loop = () => {
			if (!experienceState.isAutoScrolling) return;

			// Base speed: 0.5px per frame @ 60fps ~= 30px/sec
			// Multiplier: 1x -> 0.5px, 2x -> 1.0px, 4x -> 2.0px
			const baseSpeed = 0.5;
			scrollAccumulator += baseSpeed * experienceState.autoPlaySpeed;

			if (scrollAccumulator >= 1) {
				const pixelsToScroll = Math.floor(scrollAccumulator);
				window.scrollBy({ top: pixelsToScroll, behavior: 'instant' }); // instant prevents smooth-scroll fighting
				scrollAccumulator -= pixelsToScroll;
			}

			// Safety stop
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
				stopAutoScroll();
				return;
			}

			autoScrollFrame = requestAnimationFrame(loop);
		};

		autoScrollFrame = requestAnimationFrame(loop);
	}

	function stopAutoScroll() {
		if (autoScrollFrame) {
			cancelAnimationFrame(autoScrollFrame);
			autoScrollFrame = null;
			experienceState.isAutoScrolling = false;
		}
	}

	const schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'ODYSSEY | Creative Coding Experiment',
		author: {
			'@type': 'Person',
			name: 'My World'
		},
		description: 'A procedural WebGL organism that evolves with your interaction.',
		image: 'https://my-world.dev/og-image.jpg',
		url: 'https://my-world.dev'
	});
</script>

<svelte:window
	onclick={startExperience}
	onwheel={stopAutoScroll}
	ontouchmove={stopAutoScroll}
	onkeydown={stopAutoScroll}
/>

<svelte:head>
	<title>ODYSSEY | Creative Coding Experiment</title>
	<meta
		name="description"
		content="A procedural WebGL organism that evolves with your interaction."
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://my-world.dev/" />
	<meta property="og:title" content="ODYSSEY | Creative Coding Experiment" />
	<meta
		property="og:description"
		content="A procedural WebGL organism that evolves with your interaction."
	/>
	<meta property="og:image" content="https://my-world.dev/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://my-world.dev/" />
	<meta property="twitter:title" content="ODYSSEY | Creative Coding Experiment" />
	<meta
		property="twitter:description"
		content="A procedural WebGL organism that evolves with your interaction."
	/>
	<meta property="twitter:image" content="https://my-world.dev/og-image.jpg" />

	<!-- Schema.org -->
	{@html `<script type="application/ld+json">${schema}</script>`}
</svelte:head>

<main class="relative w-full">
	{#if Scene}
		<Scene />
	{:else}
		<div
			class="fixed inset-0 z-0 flex items-center justify-center bg-[#111] font-serif text-sm tracking-widest text-white/30 uppercase"
		>
			Loading Experiment...
		</div>
	{/if}

	<Overlay />

	<!-- Scroll Track -->
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
	<section class="h-screen w-full"></section>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #111;
		color: #fff;
		overflow-x: hidden;
	}
</style>
