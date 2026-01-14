<script lang="ts">
    import { goto } from "$app/navigation";
    import Input from "$lib/components/Input.svelte";
    import Button from "$lib/components/Button.svelte";
    import { transfersService } from "$lib/services/transfersService";
    import { transferSchema } from "$lib/utils/validation";
    import { z } from "zod";

    let toAccountId = "";
    let amount = "";
    let description = "";
    let loading = false;
    let error = "";
    let success = "";

    async function handleTransfer() {
        loading = true;
        error = "";
        success = "";

        try {
            // Validate first
            const payload = {
                toAccountId,
                amount: parseFloat(amount),
                description,
            };

            transferSchema.parse(payload);

            await transfersService.createTransfer({
                fromAccountId: "CURRENT_ACCOUNT", // Placeholder for demo
                toAccountId,
                amount: parseFloat(amount),
                currency: "USD",
                memo: description,
            });
            success = "Transfer successful!";
            toAccountId = "";
            amount = "";
            description = "";
        } catch (e: any) {
            if (e instanceof z.ZodError) {
                error = e.errors[0]?.message || "Validation failed";
            } else {
                error = e.message || "Transfer failed";
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="transfer-page">
    <h1>Transfers</h1>
    <div class="card">
        <form on:submit|preventDefault={handleTransfer}>
            <Input
                label="Recipient Account ID"
                bind:value={toAccountId}
                placeholder="ACC-12345"
            />
            <Input
                label="Amount"
                type="number"
                bind:value={amount}
                placeholder="0.00"
            />
            <Input
                label="Description (Optional)"
                bind:value={description}
                placeholder="Rent, Dinner, etc."
            />

            {#if error}
                <div class="error">{error}</div>
            {/if}

            {#if success}
                <div class="success">{success}</div>
            {/if}

            <Button type="submit" {loading} fullWidth>Send Money</Button>
        </form>
    </div>
</div>

<style>
    .transfer-page {
        max-width: 600px;
        margin: 0 auto;
    }

    .card {
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h1 {
        margin-bottom: 2rem;
    }

    .error {
        color: #ef4444;
        padding: 0.5rem;
        background: #fee2e2;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
    }

    .success {
        color: #10b981;
        padding: 0.5rem;
        background: #d1fae5;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
    }
</style>
