import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{t('home_welcome')}</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        {t('home_desc')}
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">{t('login_btn')}</Link>
        <Link to="/register" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition">{t('register_btn')}</Link>
      </div>
    </div>
  );
};

export default Home;
