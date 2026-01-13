<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
</script>

<button
  {type}
  class="btn {variant} {fullWidth ? 'full-width' : ''}"
  {disabled}
  on:click
>
  {#if loading}
    <span class="spinner"></span>
  {:else}
    <slot />
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    outline: none;
    font-family: inherit;
    gap: 0.5rem;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);
  }

  .primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #5b5df0 0%, #4338ca 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(79, 70, 229, 0.3);
  }

  .primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .secondary {
    background: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
  }

  .secondary:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  }

  .full-width {
    width: 100%;
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
