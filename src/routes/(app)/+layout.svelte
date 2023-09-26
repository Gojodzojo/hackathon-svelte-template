<script lang="ts">
	import { page } from '$app/stores';
	import IconComponent from '$lib/components/IconComponent.svelte';
	import { FaWpforms, GoSignOut, MdDashboard } from '$lib/icons';
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailAnchor,
		TabGroup,
		TabAnchor
	} from '@skeletonlabs/skeleton';
	import MediaQuery from 'svelte-media-queries';

	let isMobile: boolean = false;

	const tabs = [
		{
			title: 'Dashboard',
			icon: MdDashboard,
			href: '/dashboard'
		},
		{
			title: 'Form',
			icon: FaWpforms,
			href: '/form'
		}
	];

	function logout() {
		console.log('logout');
	}
</script>

<AppShell>
	<MediaQuery query="(max-width: 480px)" bind:matches={isMobile} />

	<AppBar slot="header">
		<svelte:fragment slot="lead">
			<strong class="text-xl uppercase">Skeleton</strong>
		</svelte:fragment>
	</AppBar>

	<slot />

	<svelte:fragment slot="footer">
		{#if isMobile}
			<TabGroup
				justify="justify-center"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
				flex="flex-1 lg:flex-none"
				rounded=""
				border=""
				class="bg-surface-100-800-token w-full"
			>
				{#each tabs as { title, icon, href } (title)}
					<TabAnchor {href} selected={$page.url.pathname === href}>
						<IconComponent {icon} slot="lead" selected={$page.url.pathname === href} />
						<span>{title}</span>
					</TabAnchor>
				{/each}
			</TabGroup>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
		{#if !isMobile}
			<AppRail>
				{#each tabs as { title, icon, href } (title)}
					<AppRailAnchor {href} selected={$page.url.pathname === href}>
						<IconComponent {icon} slot="lead" selected={$page.url.pathname === href} />
						<span>{title}</span>
					</AppRailAnchor>
				{/each}

				<svelte:fragment slot="trail">
					<AppRailAnchor href="" on:click={logout}>
						<IconComponent icon={GoSignOut} slot="lead" />
						<span>Logout</span>
					</AppRailAnchor>
				</svelte:fragment>
			</AppRail>
		{/if}
	</svelte:fragment>
</AppShell>
