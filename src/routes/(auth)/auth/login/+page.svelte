<script lang="ts">
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { authService } from '$lib/services/authService';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleSubmit() {
    loading = true;
    error = '';
    try {
      const res = await authService.login(username, password);
      if (res.mfaRequired) {
        goto('/auth/mfa');
      } else {
        goto('/dashboard');
      }
    } catch (e: any) {
      error = e.message || 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Welcome Back</h2>
  <Input label="Username" bind:value={username} placeholder="Enter your username" />
  <Input label="Password" type="password" bind:value={password} placeholder="Enter your password" />
  
  {#if error}
    <div class="error">{error}</div>
  {/if}

  <Button type="submit" fullWidth {loading} disabled={!username || !password}>Login</Button>
</form>

<style>
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #111827;
    text-align: center;
  }

  .error {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
  }
</style>
