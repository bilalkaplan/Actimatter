import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">ACTIMATTER'a Hoş Geldiniz</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Modern ve dinamik etkinlik yönetim platformu. Etkinlikleri keşfedin, katılın veya kendi etkinliklerinizi organize edin.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Giriş Yap</Link>
        <Link to="/register" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition">Kayıt Ol</Link>
      </div>
    </div>
  );
};

export default Home;
