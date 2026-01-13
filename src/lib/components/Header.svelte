<script lang="ts">
  import { authService } from '$lib/services/authService';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';

  $: user = $authStore.user;

  async function handleLogout() {
    await authService.logout();
    goto('/auth/login');
  }
</script>

<header>
  <div class="brand">
    <span class="logo">🏦</span>
    <span class="name">NeoBank</span>
  </div>

  <div class="actions">
    {#if user}
      <div class="user-info">
        <span class="avatar">{user.name[0]}</span>
        <span class="username">{user.name}</span>
      </div>
      <button class="logout-btn" on:click={handleLogout}>Logout</button>
    {/if}
  </div>
</header>

<style>
  header {
    height: 64px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .logo {
    font-size: 1.5rem;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
    background: #4f46e5;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .username {
    font-size: 0.95rem;
    color: #374151;
    font-weight: 500;
  }

  .logout-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0.5rem;
    transition: color 0.2s;
  }

  .logout-btn:hover {
    color: #ef4444;
  }
</style>
