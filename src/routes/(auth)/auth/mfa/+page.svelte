<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { authService } from '$lib/services/authService';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';

  let code = '';
  let loading = false;
  let error = '';

  $: mfaToken = $authStore.mfaToken;

  async function handleSubmit() {
    if (!mfaToken) {
      error = 'Session expired. Please login again.';
      return;
    }
    loading = true;
    error = '';
    try {
      await authService.verifyMfa(mfaToken, code);
      goto('/dashboard');
    } catch (e: any) {
      error = e.message || 'Verification failed';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Two-Factor Authentication</h2>
  <p>Please enter the 6-digit code sent to your device.</p>
  
  <Input label="Verification Code" bind:value={code} placeholder="123456" />
  
  {#if error}
    <div class="error">{error}</div>
  {/if}

  <Button type="submit" fullWidth {loading} disabled={code.length < 6}>Verify</Button>
  
  <div class="back">
    <a href="/auth/login">Back to Login</a>
  </div>
</form>

<style>
  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    color: #111827;
    text-align: center;
  }

  p {
    color: #6b7280;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .error {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .back {
    text-align: center;
    margin-top: 1rem;
  }
  
  .back a {
    color: #6b7280;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .back a:hover {
    color: #111827;
  }
</style>
