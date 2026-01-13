<script lang="ts">
  // Minimal logic
</script>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <span class="logo">🏦</span>
      <h1>NeoBank</h1>
    </div>
    <slot />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #f3f4f6;
  }

  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%);
  }

  .auth-card {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .logo {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
</style>
