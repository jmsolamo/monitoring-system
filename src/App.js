import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/login';
import RegisterPage from './Pages/register';
import ActualExpenses from './Pages/actualExpenses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/actual-expenses" element={<ActualExpenses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
