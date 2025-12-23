<script lang="ts">
	import { onMount } from 'svelte';
	import Overlay from '$lib/components/experiment/Overlay.svelte';
	import { AudioManager } from '$lib/components/experiment/AudioManager';

	let Scene: any = $state(null);
	let audioStarted = $state(false);

	onMount(async () => {
		const module = await import('$lib/components/experiment/Scene.svelte');
		Scene = module.default;
	});

	async function startExperience() {
		if (audioStarted) return;
		await AudioManager.getInstance().initialize();
		audioStarted = true;
	}

	const schema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Living | Creative Coding Experiment',
		author: {
			'@type': 'Person',
			name: 'My World'
		},
		description: 'A procedural WebGL organism that evolves with your interaction.',
		image: 'https://my-world.dev/og-image.jpg',
		url: 'https://my-world.dev'
	});
</script>

<svelte:window onclick={startExperience} onscroll={startExperience} />

<svelte:head>
	<title>Living | Creative Coding Experiment</title>
	<meta
		name="description"
		content="A procedural WebGL organism that evolves with your interaction."
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://my-world.dev/" />
	<meta property="og:title" content="Living | Creative Coding Experiment" />
	<meta
		property="og:description"
		content="A procedural WebGL organism that evolves with your interaction."
	/>
	<meta property="og:image" content="https://my-world.dev/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://my-world.dev/" />
	<meta property="twitter:title" content="Living | Creative Coding Experiment" />
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
