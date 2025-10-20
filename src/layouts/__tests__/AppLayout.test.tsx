import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppLayout } from '../AppLayout';

// Mocking only Outlet from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="mock-outlet">Outlet content</div>,
  };
});

describe('AppLayout', () => {
  it('renders the header title', () => {
    render(<AppLayout />);
    expect(screen.getByRole('heading', { level: 2, name: /currency rates dashboard/i })).toBeInTheDocument();
  });

  it('renders the Outlet area', () => {
    render(<AppLayout />);
    expect(screen.getByTestId('mock-outlet')).toHaveTextContent('Outlet content');
  });

  it('has a semantic main region', () => {
    render(<AppLayout />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows the footer note', () => {
    render(<AppLayout />);
    expect(
      screen.getByText(/Built with React \+ Vite \+ React Query\. Tests: Vitest \+ @testing-library\/react\./i)
    ).toBeInTheDocument();
  });

  it('sets the root layout id', () => {
    render(<AppLayout />);
    expect(screen.getByTestId('root-layout')).toBeInTheDocument();
  });
});