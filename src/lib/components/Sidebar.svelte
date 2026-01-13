<script lang="ts">
  import { page } from '$app/stores';
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/accounts', label: 'Accounts', icon: '💳' },
    { href: '/transfers', label: 'Transfers', icon: '💸' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
  ];
</script>

<aside>
  <nav>
    {#each links as link}
      <a 
        href={link.href} 
        class:active={$page.url.pathname.startsWith(link.href)}
      >
        <span class="icon">{link.icon}</span>
        <span class="label">{link.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style>
  aside {
    width: 240px;
    background: #f9fafb; /* Light sidebar */
    /* glassmorphism style if desired, but sticking to clean structure first */
    border-right: 1px solid #e5e7eb;
    height: calc(100vh - 64px); /* Subtract header height */
    position: sticky;
    top: 64px;
    padding: 1.5rem 1rem;
    flex-shrink: 0;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: #4b5563;
    text-decoration: none;
    transition: all 0.2s;
    font-weight: 500;
  }

  a:hover {
    background: #f3f4f6;
    color: #111827;
  }

  a.active {
    background: #e0e7ff;
    color: #4f46e5;
  }
</style>
