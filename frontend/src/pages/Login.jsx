import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">Hoş Geldiniz</h2>
          <p className="text-blue-200">ACTIMATTER hesabınıza giriş yapın</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 transition-all"
              placeholder="Kullanıcı adınızı girin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Şifre</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-blue-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-blue-200 text-sm">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Hemen Kayıt Olun
            </Link>
          </p>
          <div className="mt-4">
            <Link to="/" className="text-blue-300/70 hover:text-white text-sm transition-colors">
              &larr; Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
