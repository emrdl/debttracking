"use client";
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon, QrCodeIcon, MapPinIcon, ClockIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Debt {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  type: 'credit-card' | 'loan' | 'bill' | 'other';
}

export default function Home() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [formData, setFormData] = useState<Debt>({
    id: '',
    name: '',
    amount: 0,
    dueDate: new Date(),
    type: 'credit-card',
  });
  const [selectedTab, setSelectedTab] = useState('detail');

  useEffect(() => {
    fetch('/api/debts')
      .then(res => res.json())
      .then(setDebts);
  }, []);

  const addDebt = async () => {
    const response = await fetch('/api/debts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const newDebt = await response.json();
      setDebts([...debts, newDebt]);
      setFormData({
        id: '',
        name: '',
        amount: 0,
        dueDate: new Date(),
        type: 'credit-card',
      });
    }
  };

  const deleteDebt = async (id: string) => {
    await fetch(`/api/debts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const editDebt = async (id: string) => {
    const response = await fetch(`/api/debts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    const updatedDebt = await response.json();
    setDebts(debts.map(debt => debt.id === id ? updatedDebt : debt));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 bg-white border-r flex flex-col items-center py-6 space-y-8">
        <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <div className="space-y-6">
          <div className="p-2 rounded-lg bg-gray-100 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <ClockIcon className="w-6 h-6" />
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-72 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Borç Detayları</h2>
                  <p className="text-sm text-gray-500">#{formData.id || 'Yeni Kayıt'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <QrCodeIcon className="w-20 h-20 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Borç Adı</p>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="nereye borcunuz var?"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tutar</p>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  placeholder="0.00 TL"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Son Ödeme Tarihi</p>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={format(new Date(formData.dueDate), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Borç Türü</p>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Debt['type']})}
              >
                <option value="credit-card">Kredi Kartı</option>
                <option value="loan">Kredi</option>
                <option value="bill">Fatura</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setFormData({
                    id: '',
                    name: '',
                    amount: 0,
                    dueDate: new Date(),
                    type: 'credit-card',
                  });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={formData.id ? () => editDebt(formData.id) : addDebt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {formData.id ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('detail')}
                className={`pb-4 ${selectedTab === 'detail' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Borç Detayları
              </button>
              <button
                onClick={() => setSelectedTab('info')}
                className={`pb-4 ${selectedTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Borç Listesi
              </button>
              <button
                onClick={() => setSelectedTab('docs')}
                className={`pb-4 ${selectedTab === 'docs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Dökümanlar
              </button>
            </div>
          </div>

          {/* Debt List */}
          {selectedTab === 'info' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{debt.name}</h3>
                        <p className="text-sm text-gray-500">{debt.amount} TL</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-gray-500">{format(new Date(debt.dueDate), 'dd MMM yyyy')}</p>
                      <button 
                        onClick={() => setFormData(debt)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <PencilIcon className="w-5 h-5 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => deleteDebt(debt.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
