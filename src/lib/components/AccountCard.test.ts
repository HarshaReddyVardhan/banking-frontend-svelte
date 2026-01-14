import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import AccountCard from './AccountCard.svelte';

describe('AccountCard Component', () => {
    const mockAccount = {
        id: 'acc-123',
        name: 'Checking Account',
        type: 'CHECKING' as const, // Fix literal type
        balance: 5000.50,
        availableBalance: 4500.00,
        currency: 'USD'
    };

    it('renders account details correctly', () => {
        render(AccountCard, { account: mockAccount });

        expect(screen.getByText('Checking Account')).toBeInTheDocument();
        expect(screen.getByText('$5,000.50')).toBeInTheDocument(); // Assuming formatting
        expect(screen.getByText('CHECKING')).toBeInTheDocument();
    });

    it('handles click or interaction if any (future proofing)', () => {
        const { container } = render(AccountCard, { account: mockAccount });
        expect(container.firstChild).toHaveClass('account-card');
    });
});
