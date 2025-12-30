import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import TransactionList from './components/TransactionList';
import Insights from './components/Insights';
import SmsInputModal from './components/SmsInputModal';
import Toast from './components/Toast';
import { Home, PieChart, Plus, Settings } from './components/Icons';
import { AppSettings, Transaction, INITIAL_SETTINGS, Category } from './types';
import * as storage from './services/storageService';
import { updateTransaction } from './services/storageService';
import { initSmsListener } from './services/smsListener';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'insights' | 'settings'>('home');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load data on mount and start listener
  useEffect(() => {
    const loadedSettings = storage.getSettings();
    const loadedTransactions = storage.getTransactions();
    setSettings(loadedSettings);
    setTransactions(loadedTransactions);
    setLoading(false);

    // Initialize Native SMS Listener
    if (loadedSettings.isOnboarded) {
      initSmsListener((newTx) => {
        setTransactions(prev => [newTx, ...prev]);
        setToastMessage(`New transaction detected: ${newTx.amount} ETB`);
        setToastVisible(true);
      });
    }
  }, [settings.isOnboarded]);

  const handleOnboardingComplete = (newSettings: AppSettings) => {
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleNewTransaction = (tx: Transaction) => {
    const updated = storage.addTransaction(tx);
    setTransactions(updated);
  };

  const handleEditTransaction = (tx: Transaction) => {
      // In a full app, this would open an edit modal. 
      // For this demo, let's just cycle the category or toggle AI status for debugging visual
      const categories = Object.values(Category);
      const nextCatIndex = (categories.indexOf(tx.category) + 1) % categories.length;
      const updatedTx = { ...tx, category: categories[nextCatIndex] };
      const updatedList = updateTransaction(updatedTx);
      setTransactions(updatedList);
  };

  if (loading) return null;

  if (!settings.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative overflow-hidden shadow-2xl">
      
      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">
                {activeTab === 'home' && 'Transactions'}
                {activeTab === 'insights' && 'Insights'}
                {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex items-center gap-2">
                {/* Balance Pill */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs font-mono text-zinc-400">
                   Bal: ETB {transactions.reduce((acc, t) => acc + (t.type === 'CREDIT' ? t.amount : -t.amount), 0).toLocaleString()}
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
        {activeTab === 'home' && (
            <TransactionList transactions={transactions} onEdit={handleEditTransaction} />
        )}
        {activeTab === 'insights' && (
            <Insights transactions={transactions} />
        )}
        {activeTab === 'settings' && (
            <div className="space-y-4">
                 <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <h3 className="font-semibold mb-2">My Banks</h3>
                    <div className="flex flex-wrap gap-2">
                        {settings.selectedBanks.map(b => (
                            <span key={b} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 capitalize">
                                {b}
                            </span>
                        ))}
                    </div>
                 </div>
                 <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <h3 className="font-semibold mb-2">Data Privacy</h3>
                    <p className="text-sm text-zinc-400">
                        All transaction data is stored locally on your device via standard web storage. 
                        No data is uploaded to any server except for anonymous categorization via Gemini AI.
                    </p>
                 </div>
                 <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="w-full py-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                 >
                    Reset App Data
                 </button>
            </div>
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab === 'home' && (
          <button 
            onClick={() => setShowSmsModal(true)}
            className="absolute bottom-24 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-lg shadow-emerald-900/50 flex items-center justify-center transition-transform active:scale-90 z-20"
          >
            <Plus className="w-8 h-8" />
          </button>
      )}

      {/* Navigation */}
      <nav className="bg-zinc-950 border-t border-zinc-800 px-6 py-4 flex items-center justify-between z-30 pb-safe">
        <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-emerald-400' : 'text-zinc-500'}`}
        >
            <Home className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'insights' ? 'text-emerald-400' : 'text-zinc-500'}`}
        >
            <PieChart className="w-6 h-6" strokeWidth={activeTab === 'insights' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Insights</span>
        </button>
        <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-emerald-400' : 'text-zinc-500'}`}
        >
            <Settings className="w-6 h-6" strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>

      {/* SMS Modal */}
      <SmsInputModal 
        isOpen={showSmsModal} 
        onClose={() => setShowSmsModal(false)} 
        onSave={handleNewTransaction}
      />
    </div>
  );
};

export default App;