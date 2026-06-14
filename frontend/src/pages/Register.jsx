import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'PARTICIPANT'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const regResult = await register(formData);
    
    if (regResult.success) {
      // Kayıt başarılıysa otomatik giriş yapıp dashboard'a yönlendir
      const loginResult = await login(formData.username, formData.password);
      if (loginResult.success) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      setError(regResult.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">Hesap Oluştur</h2>
          <p className="text-blue-200">ACTIMATTER dünyasına katılın</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 transition-all"
              placeholder="Kullanıcı adınızı belirleyin"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">E-posta Adresi</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 transition-all"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Şifre</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-300/50 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Hesap Türü</label>
            <div className="relative">
              <select
                name="role"
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white appearance-none transition-all"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="PARTICIPANT">Katılımcı (Etkinliklere katılmak için)</option>
                <option value="COORDINATOR">Koordinatör (Etkinlik düzenlemek için)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-blue-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-blue-200 text-sm">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Giriş Yapın
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

export default Register;
