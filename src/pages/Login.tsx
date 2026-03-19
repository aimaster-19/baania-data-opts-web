import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login-email', { email, password });
      if (response.data.status === 200 && response.data.token) {
        login(response.data.token, response.data.payload);
        navigate('/profile');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md animate-fade-in text-left">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-blue-100 text-left">
          Email address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-blue-300" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-white/20 rounded-lg py-2.5 bg-white/5 text-white placeholder-blue-300 transition-colors"
            placeholder="admin@data-opts.dev"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-blue-100">
            Password
          </label>
          <a href="#" className="text-xs text-blue-300 hover:text-white transition-colors">Forgot password?</a>
        </div>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-blue-300" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-white/20 rounded-lg py-2.5 bg-white/5 text-white placeholder-blue-300 transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-blue-900 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              Secure Sign In
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-all" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
