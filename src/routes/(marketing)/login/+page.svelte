<script lang="ts">
	import { goto } from '$app/navigation';
	import IconComponent from '$lib/components/IconComponent.svelte';
	import { GoEye, GoEyeClosed } from '$lib/icons';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let login = '';
	let password = '';
	let hidePassword = true;

	$: passwordInputType = hidePassword ? 'password' : 'text';

	function submit() {
		let error = '';

		if (login === '') {
			error = "Login can't be empty";
		} else if (password === '') {
			error = "Password can't be empty";
		}

		if (error !== '') {
			const t: ToastSettings = {
				background: 'variant-filled-error',
				message: error,
				hideDismiss: true,
				timeout: 5000
			};
			toastStore.trigger(t);
		} else {
			setTimeout(() => goto('/dashboard'), 0); // setTimeout is to fix some weird bug
		}
	}

	function togglePasswordVisibility(
		e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		e.preventDefault(); // Prevent submitting the form
		hidePassword = !hidePassword;
	}
</script>

<div class="w-full h-full flex justify-center items-center flex-col">
	<h1 class="h1 mb-3">Login to your account</h1>
	<span class="text-surface-400 mb-5">
		You don't have an account yet?
		<a href="/register" class="anchor">Create one</a>
	</span>

	<form on:submit={submit} class="card p-4 space-y-4">
		<label class="label">
			<span>Login</span>
			<input bind:value={login} class="input" type="text" placeholder="Login" />
		</label>

		<label class="label">
			<span>Password</span>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input
					bind:value={password}
					class="input"
					placeholder="Password"
					{...{ type: passwordInputType }}
				/>
				<button on:click={togglePasswordVisibility} class="variant-filled-surface">
					<IconComponent icon={hidePassword ? GoEye : GoEyeClosed} />
				</button>
			</div>
		</label>

		<button class="btn variant-filled-primary w-full">Login</button>
	</form>
</div>
