<script lang="ts">
  import type { Account } from '$lib/types';
  export let account: Account;

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }
</script>

<div class="card">
  <div class="header">
    <span class="name">{account.name}</span>
    <span class="type">{account.type}</span>
  </div>
  <div class="balance">
    {formatCurrency(account.balance, account.currency)}
  </div>
  <div class="available">
    Available: {formatCurrency(account.availableBalance, account.currency)}
  </div>
</div>

<style>
  .card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s;
    border: 1px solid #f3f4f6;
    min-width: 250px;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .name {
    font-weight: 600;
    color: #1f2937;
  }

  .type {
    font-size: 0.75rem;
    background: #e0e7ff;
    color: #4338ca;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: 600;
  }

  .balance {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
  }

  .available {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
</style>
