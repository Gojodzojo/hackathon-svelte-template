<script>
	import '../app.postcss';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { Toast, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { tryLoginFromCookie } from '$lib/scripts/authentication';
	import { browser } from '$app/environment';

	// Floating UI for Popups
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();
	browser && tryLoginFromCookie();
</script>

<Toast />
<slot />
