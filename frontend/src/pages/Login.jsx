import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadToast = toast.loading(t('logging_in'));

    const result = await login(username, password);
    
    if (result.success) {
      toast.success(t('login_success'), { id: loadToast });
      navigate('/dashboard');
    } else {
      toast.error(result.message, { id: loadToast });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">{t('welcome')}</h2>
          <p className="text-green-200">{t('login_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-100 mb-2">{t('username')}</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-green-300/50 transition-all"
              placeholder={t('enter_username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-100 mb-2">{t('password')}</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-white placeholder-green-300/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-green-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? t('logging_in') : t('login_btn')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-green-200 text-sm">
            {t('no_account')}{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              {t('register_here')}
            </Link>
          </p>
          <div className="mt-4">
            <Link to="/" className="text-green-300/70 hover:text-white text-sm transition-colors">
              &larr; {t('back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
