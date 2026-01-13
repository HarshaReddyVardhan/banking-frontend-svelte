<script lang="ts">
  export let label: string = '';
  export let type: string = 'text';
  export let value: string;
  export let placeholder: string = '';
  export let error: string = '';
  export let id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="input-group">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input
    {id}
    {type}
    bind:value
    {placeholder}
    class:has-error={!!error}
    on:input
    on:change
    on:blur
  />
  {#if error}
    <span class="error-msg">{error}</span>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;
    outline: none;
    background: #f9fafb;
  }

  input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }

  input.has-error {
    border-color: #ef4444;
  }

  input.has-error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .error-msg {
    font-size: 0.8rem;
    color: #ef4444;
  }
</style>
