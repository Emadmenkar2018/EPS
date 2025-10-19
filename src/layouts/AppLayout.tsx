import { Outlet } from "react-router-dom";

export const AppLayout = () => {

    return (
        <div
            id="review-ui-web"
            className="min-h-screen w-full bg-white font-neue overflow-x-hidden"
        >
            <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-950 to-black flex flex-col px-2 sm:px-4 md:px-8 overflow-x-hidden overflow-y-hidden">
                <header className="mb-6">
                    <h1 className="text-lg sm:text-lg md:text-lg font-bold tracking-tight text-center sm:text-center md:text-center py-6">
                        Currency Rates Dashboard
                    </h1>
                </header>

                <div className="flex-1 w-full h-full overflow-auto">
                    <main className="w-full h-full mx-auto max-w-full sm:max-w-2xl md:max-w-4xl">
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