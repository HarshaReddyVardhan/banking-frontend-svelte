<script lang="ts">
  import { onMount } from "svelte";
  import { accountsService } from "$lib/services/accountsService";
  import { accountsStore } from "$lib/stores/accountsStore";
  import AccountCard from "$lib/components/AccountCard.svelte";
  import TransactionList from "$lib/components/TransactionList.svelte";

  // Could also list recent transactions here

  onMount(() => {
    loadData();
  });

  async function loadData() {
    try {
      await accountsService.fetchAccounts();
      // Fetch recent transactions for primary account?
      // For now just accounts.
    } catch (e) {
      console.error(e);
    }
  }

  $: accounts = $accountsStore.accounts;
  $: loading = $accountsStore.loading;

  $: totalAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0); // Simplified (currency mixing ignored for demo)
</script>

<div class="dashboard">
  <header>
    <h1>Dashboard</h1>
    <div class="total">
      <span class="label">Total Assets</span>
      <span class="value">${totalAssets.toLocaleString()}</span>
    </div>
  </header>

  {#if loading && accounts.length === 0}
    <div class="loading">Loading accounts...</div>
  {:else}
    <div class="accounts-grid">
      {#each accounts as account}
        <AccountCard {account} />
      {/each}
    </div>

    <TransactionList />

    {#if accounts.length === 0 && !loading}
      <div class="empty">No accounts found.</div>
    {/if}
  {/if}
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }

  .total {
    text-align: right;
  }

  .total .label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .total .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .loading,
  .empty {
    text-align: center;
    color: #6b7280;
    padding: 2rem;
  }
</style>
