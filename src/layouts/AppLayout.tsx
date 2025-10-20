import { Outlet } from "react-router-dom";

export const AppLayout = () => {
    return (
        <div id="review-ui-web"  data-testid="root-layout" className="w-full font-neue">
            <div className="bg-gradient-to-br from-slate-900 flex flex-col px-2 rounded-xl">
                <header className="mb-6">
                    <h2 className="text-xl font-bold text-center py-2">
                        Currency Rates Dashboard
                    </h2>
                </header>
                <div className="flex-1 w-full overflow-auto">
                    <main className="mx-auto w-full max-w-4xl">
                        <Outlet />
                    </main>
                </div>
                <footer className="mt-8 text-xs opacity-60 text-center">
                    Built with React + Vite + React Query. Tests: Vitest + @testing-library/react.
                </footer>
            </div>
        </div>
    );
};