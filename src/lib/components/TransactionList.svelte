<script lang="ts">
    import { onMount } from "svelte";
    import { transactionsStore } from "$lib/stores/transactionsStore";

    // Fake large list optimization: Pagination / Load More
    // In a real app, we'd use virtual scrolling if we expected 1000s of items in DOM.
    // Here we limit DOM nodes.

    export let accountId: string | null = null;

    let page = 1;
    const pageSize = 10;

    // Derived state for display
    // If accountId is provided, look up in the map. Otherwise flatten all.
    $: rawTransactions = accountId
        ? $transactionsStore.byAccountId[accountId] || []
        : Object.values($transactionsStore.byAccountId).flat();

    $: sorted = [...rawTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    $: displayedTransactions = sorted.slice(0, page * pageSize);
    $: hasMore = displayedTransactions.length < sorted.length;

    function loadMore() {
        page++;
    }
</script>

<div class="transaction-list">
    <h3>Recent Transactions</h3>

    {#if displayedTransactions.length === 0}
        <p class="empty">No transactions found.</p>
    {:else}
        <ul class="list">
            {#each displayedTransactions as transaction (transaction.id)}
                <li class="item">
                    <div class="details">
                        <span class="desc"
                            >{transaction.description ||
                                "Unknown Transaction"}</span
                        >
                        <span class="date"
                            >{new Date(
                                transaction.date,
                            ).toLocaleDateString()}</span
                        >
                    </div>
                    <div class="amount" class:negative={transaction.amount < 0}>
                        {transaction.amount < 0 ? "-" : "+"}${Math.abs(
                            transaction.amount,
                        ).toFixed(2)}
                    </div>
                </li>
            {/each}
        </ul>

        {#if hasMore}
            <button class="load-more" on:click={loadMore}>Load More</button>
        {/if}
    {/if}
</div>

<style>
    .transaction-list {
        background: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h3 {
        margin-top: 0;
        color: #111827;
    }

    .list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f3f4f6;
    }

    .item:last-child {
        border-bottom: none;
    }

    .details {
        display: flex;
        flex-direction: column;
    }

    .desc {
        font-weight: 500;
        color: #374151;
    }

    .date {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .amount {
        font-weight: 600;
    }

    .amount.negative {
        color: #ef4444;
    }

    .amount:not(.negative) {
        color: #10b981;
    }

    .load-more {
        width: 100%;
        padding: 0.5rem;
        margin-top: 1rem;
        background: #f3f4f6;
        border: none;
        border-radius: 0.25rem;
        color: #4b5563;
        font-weight: 500;
        cursor: pointer;
    }

    .load-more:hover {
        background: #e5e7eb;
    }
</style>
