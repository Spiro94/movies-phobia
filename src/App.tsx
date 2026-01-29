import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MovieBrowser } from './components/MovieBrowser/MovieBrowser';
import { MovieDetail } from './components/MovieDetail/MovieDetail';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-app-bg text-white">
          <header className="bg-app-card border-b border-app-border p-5 text-center">
            <h1 className="m-0 mb-2 text-[28px] font-bold text-white">
              Movies Phobia
            </h1>
            <p className="m-0 text-sm text-gray-400">
              Browse movies safely with personalized danger scores
            </p>
          </header>
          <Routes>
            <Route path="/" element={<MovieBrowser />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
