import React, { useState } from 'react';
    import { SUPPORTED_BANKS } from '../services/smsParser';
    import { AppSettings } from '../types';
    import { Shield, Smartphone, Zap, Check } from './Icons';
    
    interface Props {
      onComplete: (settings: AppSettings) => void;
    }
    
    const Onboarding: React.FC<Props> = ({ onComplete }) => {
      const [step, setStep] = useState(1);
      const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
      const [searchQuery, setSearchQuery] = useState('');
    
      const toggleBank = (id: string) => {
        if (selectedBanks.includes(id)) {
          setSelectedBanks(selectedBanks.filter(b => b !== id));
        } else {
          setSelectedBanks([...selectedBanks, id]);
        }
      };
    
      const handleFinish = () => {
        onComplete({
          isOnboarded: true,
          selectedBanks,
          currencySymbol: 'ETB'
        });
      };

      const filteredBanks = SUPPORTED_BANKS.filter(bank => 
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
          <div className="w-full max-w-md h-full max-h-[90vh] flex flex-col">
            
            {/* Step 1: Intro */}
            {step === 1 && (
              <div className="flex flex-col justify-center h-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Silent Money</h1>
                <p className="text-zinc-400 text-lg">
                  Track your finances automatically without linking your bank account.
                </p>
                <div className="grid gap-4 text-left mt-8">
                    <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <Shield className="w-5 h-5 text-emerald-400 mt-1" />
                        <div>
                            <h3 className="font-semibold">100% Private</h3>
                            <p className="text-sm text-zinc-400">Your data stays on this device. We don't see your transactions.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <Zap className="w-5 h-5 text-amber-400 mt-1" />
                        <div>
                            <h3 className="font-semibold">Offline First</h3>
                            <p className="text-sm text-zinc-400">Works perfectly without internet. Powered by local storage.</p>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold mt-8 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
    
            {/* Step 2: Bank Selection */}
            {step === 2 && (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center shrink-0 mb-4">
                    <h2 className="text-2xl font-bold">Select your Banks</h2>
                    <p className="text-zinc-400 mt-2 text-sm">We'll look for SMS messages from these providers.</p>
                </div>

                <div className="mb-4 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Search banks..." 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-0">
                  {filteredBanks.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => toggleBank(bank.id)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                        selectedBanks.includes(bank.id)
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span className="font-medium text-left">{bank.name}</span>
                      {selectedBanks.includes(bank.id) && <Check className="w-5 h-5 shrink-0 ml-2" />}
                    </button>
                  ))}
                  {filteredBanks.length === 0 && (
                    <div className="text-center text-zinc-500 py-8">
                      No banks found.
                    </div>
                  )}
                </div>
    
                <div className="pt-4 shrink-0">
                     <p className="text-xs text-zinc-500 text-center mb-4">
                        Note: In the native app, SMS detection happens automatically.
                    </p>
                    <button 
                    onClick={handleFinish}
                    disabled={selectedBanks.length === 0}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                    >
                    Confirm & Start ({selectedBanks.length})
                    </button>
                </div>
              </div>
            )}
    
          </div>
        </div>
      );
    };
    
    export default Onboarding;