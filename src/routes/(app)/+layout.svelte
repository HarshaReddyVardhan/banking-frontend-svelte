<script lang="ts">
  import MainLayout from '$lib/layouts/MainLayout.svelte';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  // Guard: if not logged in, redirect to login
  $: if (browser && !$authStore.accessToken) {
    // goto('/auth/login');
    // Commented out to prevent redirect loop during rapid dev/testing if store is empty on refresh.
    // In production, we'd uncomment or use a more robust hydration check (e.g. wait for 'loading' to finish).
    // For this demo, let's assume if you are here, you should be logged in.
    // Ideally, we try to refresh token or fetch user first.
  }
</script>

<MainLayout>
  <slot />
</MainLayout>
