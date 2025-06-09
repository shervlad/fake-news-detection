import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import SubmissionPage from '@/pages/SubmissionPage';
import BrowsePage from '@/pages/BrowsePage';
import ExtensionPage from '@/pages/ExtensionPage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import NotFoundPage from '@/pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes - outside of layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
          
          {/* Main routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="submit" element={<SubmissionPage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="extension" element={<ExtensionPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;

