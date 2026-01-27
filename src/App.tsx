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
        <div className="app">
          <header style={{
            padding: '20px',
            textAlign: 'center',
            borderBottom: '1px solid #333',
          }}>
            <h1>Movies Phobia</h1>
            <p>Browse movies safely with personalized danger scores</p>
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
