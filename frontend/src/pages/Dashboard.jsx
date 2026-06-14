import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', eventDate: '', location: '', capacity: '' });

  // For Registrations Modal
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getMyEvents();
      setEvents(data);
    } catch (err) {
      console.error("Etkinlikler getirilemedi", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    // Geçmiş tarih kontrolü
    const selectedDate = new Date(newEvent.eventDate);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      toast.error("Geçmiş bir tarihe etkinlik oluşturamazsınız!");
      return;
    }

    const loadToast = toast.loading("Etkinlik oluşturuluyor...");
    try {
      const dataToSubmit = { ...newEvent };
      if (!dataToSubmit.capacity) dataToSubmit.capacity = null;
      await eventService.createEvent(dataToSubmit);
      toast.success("Etkinlik başarıyla oluşturuldu!", { id: loadToast });
      setIsModalOpen(false);
      setNewEvent({ title: '', description: '', eventDate: '', location: '', capacity: '' });
      fetchEvents();
    } catch (err) {
      toast.error("Hata: " + (err.response?.data?.error || err.message), { id: loadToast });
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bu etkinliği silmek istediğinize emin misiniz? (Etkinliğe yapılan başvurular da silinebilir)")) {
      const loadToast = toast.loading("Etkinlik siliniyor...");
      try {
        await eventService.deleteEvent(id);
        toast.success("Etkinlik başarıyla silindi!", { id: loadToast });
        fetchEvents();
      } catch (err) {
        toast.error("Silme başarısız: " + (err.response?.data?.error || err.message), { id: loadToast });
      }
    }
  };

  const handleOpenRegistrations = async (event) => {
    setSelectedEvent(event);
    setIsRegModalOpen(true);
    const loadToast = toast.loading("Başvurular yükleniyor...");
    try {
      const data = await registrationService.getRegistrationsByEventId(event.id);
      setRegistrations(data);
      toast.dismiss(loadToast);
    } catch (err) {
      toast.error("Başvurular alınamadı: " + (err.response?.data?.error || err.message), { id: loadToast });
    }
  };

  const handleUpdateRegStatus = async (regId, status) => {
    const loadToast = toast.loading("Durum güncelleniyor...");
    try {
      await registrationService.updateRegistrationStatus(regId, status);
      toast.success("Başvuru durumu güncellendi!", { id: loadToast });
      // Refresh registrations
      const data = await registrationService.getRegistrationsByEventId(selectedEvent.id);
      setRegistrations(data);
    } catch (err) {
      toast.error("Durum güncellenemedi: " + (err.response?.data?.error || err.message), { id: loadToast });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Etkinliklerim</h3>
          <p className="text-gray-600 text-sm mt-1">Oluşturduğunuz etkinlikleri yönetin ve başvuruları inceleyin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
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
              <th className="p-4 border-b font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="text-gray-500 font-medium text-lg">Henüz etkinlik oluşturmadınız.</p>
                    <p className="text-gray-400 text-sm mt-1">İlk etkinliğinizi oluşturmak için yukarıdaki butonu kullanın.</p>
                  </div>
                </td>
              </tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{event.title}</td>
                  <td className="p-4 text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">{event.capacity || 'Sınırsız'}</td>
                  <td className="p-4 text-right space-x-3">
                    <button 
                      onClick={() => handleOpenRegistrations(event)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      Başvurular
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Yeni Etkinlik Oluştur</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı *</label>
                <input required type="text" className="w-full border p-2 rounded-md" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea className="w-full border p-2 rounded-md" rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                  <input required type="datetime-local" className="w-full border p-2 rounded-md" value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasite</label>
                  <input type="number" min="1" placeholder="Sınırsız" className="w-full border p-2 rounded-md" value={newEvent.capacity} onChange={e => setNewEvent({...newEvent, capacity: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konum / Link</label>
                <input type="text" className="w-full border p-2 rounded-md" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">İptal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {isRegModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedEvent.title} - Başvurular</h3>
              <button onClick={() => setIsRegModalOpen(false)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider sticky top-0">
                    <th className="p-3 border-b font-semibold">Kullanıcı</th>
                    <th className="p-3 border-b font-semibold">Başvuru Tarihi</th>
                    <th className="p-3 border-b font-semibold">Durum</th>
                    <th className="p-3 border-b font-semibold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          <p className="text-gray-500 font-medium">Henüz bu etkinliğe başvuru yapılmamış.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    registrations.map(reg => (
                      <tr key={reg.id} className="border-b">
                        <td className="p-3 font-medium text-gray-900">{reg.user?.username} ({reg.user?.email})</td>
                        <td className="p-3 text-gray-600">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {reg.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleUpdateRegStatus(reg.id, 'APPROVED')} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Onayla</button>
                              <button onClick={() => handleUpdateRegStatus(reg.id, 'REJECTED')} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Reddet</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setIsRegModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  
  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, []);

  useEffect(() => {
    if (activeTab === 'myRegistrations') {
      fetchMyRegistrations();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error("Etkinlikler getirilemedi", err);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setMyRegistrations(data);
    } catch (err) {
      console.error("Başvurular getirilemedi", err);
    }
  };

  const handleRegister = async (eventId) => {
    const loadToast = toast.loading("Kayıt işlemi yapılıyor...");
    try {
      await registrationService.registerToEvent(eventId);
      toast.success("Başarıyla kayıt olundu! (Durum: Beklemede)", { id: loadToast });
      if (activeTab === 'myRegistrations') fetchMyRegistrations();
    } catch (err) {
      toast.error("Kayıt başarısız: " + (err.response?.data?.error || err.message), { id: loadToast });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex space-x-4 border-b border-gray-300 pb-1">
        <button 
          onClick={() => setActiveTab('explore')}
          className={`pb-2 px-2 font-semibold transition ${activeTab === 'explore' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Yaklaşan Etkinlikler
        </button>
        <button 
          onClick={() => setActiveTab('myRegistrations')}
          className={`pb-2 px-2 font-semibold transition ${activeTab === 'myRegistrations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Başvurularım
        </button>
      </div>

      <div className="bg-transparent">
        {activeTab === 'explore' && (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Keşfet</h3>
              <p className="text-gray-600 text-sm mt-1">Sistemdeki tüm etkinliklere göz atın ve ilginizi çekenlere hemen kayıt olun.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <p className="text-gray-500 text-lg font-medium">Sistemde henüz bir etkinlik bulunmuyor.</p>
                </div>
              ) : (
                events.map(event => {
                  const hasApplied = myRegistrations.some(reg => reg.event?.id === event.id);
                  return (
                    <div key={event.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between group relative overflow-hidden">
                      {hasApplied && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                          Başvurdunuz
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 mb-1">{event.title}</h4>
                        {event.location && (
                          <p className="text-blue-600 text-sm font-medium flex items-center mb-3">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {event.location}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-gray-500 text-sm font-semibold">{new Date(event.eventDate).toLocaleDateString()}</span>
                          <span className="text-indigo-600 text-sm font-bold bg-indigo-50 px-2 py-1 rounded">Kap: {event.capacity || 'Sınırsız'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRegister(event.id)} 
                        disabled={hasApplied}
                        className={`w-full mt-5 py-2.5 rounded-lg font-bold transition flex justify-center items-center ${
                          hasApplied 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow'
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Kayıt Alındı
                          </>
                        ) : 'Hemen Kayıt Ol'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === 'myRegistrations' && (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Başvurularım</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b font-semibold">Etkinlik</th>
                    <th className="p-4 border-b font-semibold">Tarih</th>
                    <th className="p-4 border-b font-semibold">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {myRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                          <p className="text-gray-500 text-lg font-medium">Henüz hiçbir etkinliğe başvurmadınız.</p>
                          <p className="text-gray-400 text-sm mt-1">Keşfet sekmesinden yeni etkinlikler bulabilirsiniz.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    myRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b">
                        <td className="p-4 font-medium text-gray-900">{reg.event?.title}</td>
                        <td className="p-4 text-gray-600">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            reg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
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
