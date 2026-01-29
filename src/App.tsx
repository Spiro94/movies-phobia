import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PhobiaProvider } from './contexts/PhobiaContext';
import { MovieBrowser } from './components/MovieBrowser/MovieBrowser';
import { MovieDetail } from './components/MovieDetail/MovieDetail';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <header
            style={{
              backgroundColor: '#1a1a1a',
              borderBottom: '1px solid #333',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#fff',
              }}
            >
              Movies Phobia
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#aaa',
              }}
            >
              Browse movies safely with personalized danger scores
            </p>
          </header>
          <PhobiaProvider>
            <Routes>
              <Route path="/" element={<MovieBrowser />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
            </Routes>
          </PhobiaProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
