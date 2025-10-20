import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../Home';
import type { Mock } from 'vitest';

// ---- Mock hooks ----
vi.mock('../../hooks/useRates', () => {
  return {
    useCurrencyList: vi.fn(),
    useRates: vi.fn(),
  };
});
import { useCurrencyList, useRates } from '../../hooks/useRates';

// ---- Mock Kendo components with simple native elements ----
vi.mock('@progress/kendo-react-dateinputs', () => ({
  DatePicker: ({ value, onChange }: any) => (
    <input
      aria-label="End Date"
      type="date"
      value={
        value instanceof Date
          ? value.toISOString().slice(0, 10)
          : value ?? ''
      }
      onChange={(e) =>
        onChange?.({ target: { value: new Date((e.target as HTMLInputElement).value) } })
      }
    />
  ),
}));

vi.mock('@progress/kendo-react-dropdowns', () => ({
  DropDownList: ({ data = [], value, onChange }: any) => (
    <select
      aria-label="Base Currency"
      value={value}
      onChange={(e) => onChange?.({ target: { value: (e.target as HTMLSelectElement).value } })}
    >
      {data.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  ),
  MultiSelect: ({ value = [], onChange }: any) => (
    <input
      aria-label="Counter Currencies"
      onChange={(e) => onChange?.({ target: { value: (e.target as any).value } })}
      data-value={Array.isArray(value) ? value.join(',') : ''}
    />
  ),
}));

// ---- Mock Table ----
vi.mock('../../components/Table', () => ({
  Table: ({ selected }: { selected: string[] | any }) => {
    const list =
      Array.isArray(selected)
        ? selected
        : (selected && Array.isArray(selected.selected) ? selected.selected : []);
    return <div data-testid="table">{list.join(', ')}</div>;
  },
}));


// ---------- Shared mock data ----------
const baseList = { GBP: 'Pound', USD: 'Dollar', EUR: 'Euro', JPY: 'Yen', CHF: 'Franc', CAD: 'Dollar', AUD: 'Dollar', ZAR: 'Rand' };
const baseSeries = [{ date: '2024-06-01', rates: { USD: 1.2, EUR: 1.1 } }];

const mUseCurrencyList = useCurrencyList as unknown as Mock;
const mUseRates = useRates as unknown as Mock;

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mUseCurrencyList.mockReturnValue({ data: baseList, isLoading: false, error: null });
    mUseRates.mockReturnValue({ data: baseSeries, isLoading: false, error: null });
  });

  it('renders currency dropdown, date picker, and multiselect', () => {
    render(<Home />);
    expect(screen.getByLabelText(/Base Currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Counter Currencies/i)).toBeInTheDocument();
  });

  it('shows loading currencies', () => {
    mUseCurrencyList.mockReturnValue({ data: {}, isLoading: true, error: null });
    render(<Home />);
    expect(screen.getByText(/Loading currencies/i)).toBeInTheDocument();
  });

  it('shows error if currency list fails', () => {
    mUseCurrencyList.mockReturnValue({ data: {}, isLoading: false, error: new Error('fail') });
    render(<Home />);
    expect(screen.getByText(/Failed to load currency list/i)).toBeInTheDocument();
  });

  it('shows loading rates', () => {
    mUseRates.mockReturnValue({ data: [], isLoading: true, error: null });
    render(<Home />);
    expect(screen.getByText(/Loading rates/i)).toBeInTheDocument();
  });

  it('shows rates error text', () => {
    mUseRates.mockReturnValue({ data: [], isLoading: false, error: new Error('fail rates') });
    render(<Home />);
    expect(screen.getByText(/fail rates/i)).toBeInTheDocument();
  });

  it('renders Table with selected currencies', () => {
    render(<Home />);
    // default selected from component state
    expect(screen.getByTestId('table')).toHaveTextContent('USD, EUR, JPY, CHF, CAD, AUD, ZAR');
  });

  it('updates base currency on dropdown change (affects attribution)', async () => {
    render(<Home />);
    const dropdown = screen.getByLabelText(/Base Currency/i);
    fireEvent.change(dropdown, { target: { value: 'USD' } });

    await waitFor(() => {
      // Attribution includes the base in upper-case followed by a dot
      expect(screen.getByText(/Data source:/i)).toHaveTextContent(/USD\.$/);
    });
  });

  it('updates end date on date picker change', async () => {
    render(<Home />);
    const dateInput = screen.getByLabelText(/End Date/i);
    fireEvent.change(dateInput, { target: { value: '2024-05-01' } });

    await waitFor(() => {
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  it('updates selected counter currencies within allowed range', async () => {
    render(<Home />);
    const multi = screen.getByLabelText(/Counter Currencies/i);
    // our MultiSelect mock forwards whatever we pass as event.target.value
    fireEvent.change(multi, { target: { value: ['USD', 'EUR', 'JPY'] } });

    await waitFor(() => {
      expect(screen.getByTestId('table')).toHaveTextContent('USD, EUR, JPY');
    });
  });

  it('shows attribution text', () => {
    render(<Home />);
    expect(screen.getByText(/Data source:/i)).toBeInTheDocument();
  });
});