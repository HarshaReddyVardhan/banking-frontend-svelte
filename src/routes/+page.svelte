<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="landing">
  <div class="hero">
    <h1>NextGen Banking</h1>
    <p>Experience the future of finance.</p>
    <div class="cta">
      <Button on:click={() => goto('/auth/login')}>Login</Button>
    </div>
  </div>
</div>

<style>
  .landing {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: white;
  }

  .hero {
    text-align: center;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.5rem;
    color: #9ca3af;
    margin-bottom: 2rem;
  }
</style>
