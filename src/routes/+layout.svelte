<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { websocketService } from '$lib/services/websocketService';

  // Reactive statement to handle connection logic
  // If user is present (and has token), connect.
  // If user logs out, disconnect.
  $: if ($authStore.accessToken) {
    if (typeof window !== 'undefined') {
      websocketService.connect();
    }
  } else {
    if (typeof window !== 'undefined') {
      websocketService.disconnect();
    }
  }

  onMount(() => {
    // Check if we have token in memory (or localstorage if we implemented that)
    // For now, prompt assumes memory + cookie. 
    // If cookie is http-only, we might need an initial /auth/me call to hydrate store?
    // The prompt didn't specify hydration logic, so I'll assume login flow sets the store.
  });

  onDestroy(() => {
     if (typeof window !== 'undefined') {
      websocketService.disconnect();
    }
  });
</script>

<slot />

<style>
  :global(*), :global(*::before), :global(*::after) {
    box-sizing: border-box;
  }
</style>
