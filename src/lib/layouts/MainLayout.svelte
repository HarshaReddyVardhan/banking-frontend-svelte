<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { notificationsStore } from '$lib/stores/notificationsStore';
  
  // Example of using notifications directly in layout for toasts?
  // For now just basic structure
</script>

<div class="app-container">
  <Header />
  <div class="main-body">
    <Sidebar />
    <main>
      <div class="content">
        <slot />
      </div>
    </main>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
    background: #fdfdfd;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-body {
    display: flex;
    flex: 1;
  }

  main {
    flex: 1;
    background: #ffffff;
    overflow-y: auto;
    /* Optional sleek background effect */
    background: radial-gradient(circle at top right, #f3f4f6 0%, transparent 40%);
  }

  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
