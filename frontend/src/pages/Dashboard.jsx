import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';

const AdminDashboard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Tüm Sistem Verileri</h3>
      <p className="text-gray-600">Burada tüm kullanıcıları ve etkinlikleri yönetebileceğiniz tablolar yer alacak.</p>
    </div>
  );
};

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        // İleride backend'den sadece kendi etkinliklerini döndüren bir endpoint yazıldığında değişebilir
        setEvents(data);
      } catch (err) {
        console.error("Etkinlikler getirilemedi", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Etkinliklerim</h3>
          <p className="text-gray-600 text-sm mt-1">Oluşturduğunuz etkinlikleri yönetin ve başvuruları inceleyin.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
          + Yeni Etkinlik Oluştur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
              <th className="p-4 border-b font-semibold">Etkinlik Adı</th>
              <th className="p-4 border-b font-semibold">Tarih</th>
              <th className="p-4 border-b font-semibold">Kapasite</th>
              <th className="p-4 border-b font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">Henüz etkinlik oluşturmadınız.</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{event.title}</td>
                  <td className="p-4 text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{event.capacity || 'Sınırsız'}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition">Düzenle</button>
                    <button className="text-red-600 hover:text-red-800 font-medium mr-4 transition">Sil</button>
                    <button className="text-green-600 hover:text-green-800 font-medium transition">Başvurular</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ParticipantDashboard = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Etkinlikler getirilemedi", err);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await registrationService.registerToEvent(eventId);
      alert("Başarıyla kayıt olundu! (Durum: Beklemede)");
    } catch (err) {
      alert("Kayıt başarısız: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-8">
      {/* Başvurularım Sekmesi (Şimdilik mock sekme UI) */}
      <div className="flex space-x-4 border-b border-gray-300 pb-1">
        <button className="pb-2 border-b-2 border-blue-600 font-semibold text-blue-600 px-2">Yaklaşan Etkinlikler</button>
        <button className="pb-2 text-gray-500 hover:text-gray-800 font-medium px-2 transition">Başvurularım</button>
      </div>

      <div className="bg-transparent">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Keşfet</h3>
          <p className="text-gray-600 text-sm mt-1">Sistemdeki tüm etkinliklere göz atın ve ilginizi çekenlere hemen kayıt olun.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">Mevcut etkinlik bulunmuyor.</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-semibold">Yakında</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">{event.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      {event.capacity ? `${event.capacity} Kapasite` : 'Sınırsız Kapasite'}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleRegister(event.id)}
                  className="w-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 py-2.5 rounded-lg font-semibold transition-colors duration-300"
                >
                  Hemen Kayıt Ol
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Yükleniyor...</p>
      </div>
    );
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'COORDINATOR':
        return <CoordinatorDashboard />;
      case 'PARTICIPANT':
        return <ParticipantDashboard />;
      default:
        return (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-bold text-lg mb-2">Hata</h3>
            <p>Geçersiz Kullanıcı Rolü algılandı. Sisteme erişiminiz kısıtlandı.</p>
            <button onClick={logout} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Tekrar Giriş Yap</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
          ACTIMATTER
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">{user.username}</p>
              <p className="text-xs text-gray-500 font-medium">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors flex items-center border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
          >
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderDashboardByRole()}
      </main>
    </div>
  );
};

export default Dashboard;
