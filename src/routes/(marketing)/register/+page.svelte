<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let login = '';
	let password1 = '';
	let password2 = '';

	function submit() {
		let error = '';

		if (password1 !== password2) {
			error = "Passwords aren't identical";
		} else if (password1.length < 8) {
			error = 'Password is too short';
		} else if (login.length < 5) {
			error = 'Login is too short';
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
</script>

<div class="w-full h-full flex justify-center items-center flex-col">
	<h1 class="h1 mb-3">Create your account</h1>
	<span class="text-surface-400 mb-5">
		Already registered?
		<a href="/login" class="anchor">Login</a>
	</span>

	<form on:submit={submit} class="card p-4 space-y-4">
		<label class="label">
			<span>Login</span>
			<input bind:value={login} class="input" type="text" placeholder="Login" />
		</label>

		<label class="label">
			<span>Password</span>
			<input bind:value={password1} class="input" placeholder="Password" type="password" />
		</label>

		<label class="label">
			<span>Repeat password</span>
			<input bind:value={password2} class="input" placeholder="Repeat password" type="password" />
		</label>

		<button class="btn variant-filled-primary w-full">Register</button>
	</form>
</div>
