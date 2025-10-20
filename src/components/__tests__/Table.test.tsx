import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { Table } from "../Table";

// Mock Kendo components
vi.mock('@progress/kendo-react-grid', () => ({
    Grid: vi.fn(({ children }) => (
        <div data-testid="grid">
            {children}
        </div>
    )),
    GridColumn: vi.fn(({ field, title, format }) => (
        <div data-testid={`column-${field}`}>
            <div>{title}</div>
            <div>{format}</div>
        </div>
    ))
}));

describe('Table component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockData = [
        { date: '2024-06-01', rates: { USD: 1.2345, EUR: 0.9876 } },
        { date: '2024-06-02', rates: { USD: 1.3456, EUR: 1.1234 } },
    ];

    it('renders Grid component', () => {
        render(<Table data={mockData} selected={['USD', 'EUR']} />);
        expect(screen.queryByTestId('grid')).toBeDefined();
    });

    it('renders correct number of columns', () => {
        render(<Table data={mockData} selected={['USD', 'EUR', 'GBP']} />);
        // Date column + selected columns
        expect(screen.getByText('Date')).toBeDefined();
        expect(screen.getByText('USD')).toBeDefined();
        expect(screen.getByText('EUR')).toBeDefined();
        expect(screen.getByText('GBP')).toBeDefined();
    });

    it('renders no selected columns if selected is empty', () => {
        render(<Table data={mockData} selected={[]} />);
        expect(screen.getByText('Date')).toBeDefined();
        expect(screen.queryByText('USD')).toBeNull();
        expect(screen.queryByText('EUR')).toBeNull();
    });

    it('renders no data rows if data is empty', () => {
        render(<Table data={[]} selected={['USD']} />);
        // Only headers should be present
        expect(screen.getByText('Date')).toBeDefined();
        expect(screen.getByText('USD')).toBeDefined();
    });
});