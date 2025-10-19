import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './layouts/AppLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './ui/Home';

const queryClient = new QueryClient();

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      // errorElement: <Error />,

      children: [
        {
          path: '/',
          element: <Home />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
