<script lang="ts">
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<AppBar slot="header">
		<svelte:fragment slot="lead">
			<a href="/">
				<strong class="text-xl uppercase">Skeleton</strong>
			</a>
		</svelte:fragment>
		<svelte:fragment slot="trail">
			<a
				class="btn btn-sm variant-ghost-surface"
				href="https://discord.gg/EXqV7W8MtY"
				target="_blank"
				rel="noreferrer"
			>
				Discord
			</a>
			<a
				class="btn btn-sm variant-ghost-surface"
				href="https://twitter.com/SkeletonUI"
				target="_blank"
				rel="noreferrer"
			>
				Twitter
			</a>
			<a
				class="btn btn-sm variant-ghost-surface"
				href="https://github.com/skeletonlabs/skeleton"
				target="_blank"
				rel="noreferrer"
			>
				GitHub
			</a>
		</svelte:fragment>
	</AppBar>

	<slot />
</AppShell>
