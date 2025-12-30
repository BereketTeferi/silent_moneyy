import React, { useState } from 'react';
import { parseSMS } from '../services/smsParser';
import { categorizeTransaction } from '../services/geminiService';
import { Transaction } from '../types';
import { Check, X, Zap } from './Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const DEMO_SMS = [
    "Dear Customer, Acct 1000****123 Debited with ETB 350.00. Reason: Burger King.",
    "Dear Customer, Acct 1000****123 Debited with ETB 2,500.00. Reason: Rent Payment.",
    "Acct 1234 Debited ETB 400.00. Desc: Uber Trip. Bal: 5000",
    "Acct 1234 Credited ETB 15,000.00. Desc: Salary October. Bal: 20000",
    "Awash Bank: Your account has been debited ETB 800.00 for Internet Bill.",
    "Zemen Bank: You have paid ETB 450.00 at Kaldi's Coffee."
];

const SmsInputModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!text) return;
    setIsProcessing(true);
    setError('');

    try {
        const tx = parseSMS(text);
        if (!tx) {
            setError("Could not parse this SMS. Try another format.");
            setIsProcessing(false);
            return;
        }

        // Apply AI
        const category = await categorizeTransaction(tx);
        tx.category = category;
        tx.isAiClassified = true;

        onSave(tx);
        setText('');
        onClose();
    } catch (e) {
        setError("Error processing SMS.");
    } finally {
        setIsProcessing(false);
    }
  };

  const useDemo = (sms: string) => {
      setText(sms);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">New Transaction</h3>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <p className="text-sm text-zinc-400">
            Paste a bank SMS below. In the native app, this happens automatically in the background.
        </p>

        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste bank SMS here..."
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {DEMO_SMS.map((sms, i) => (
                <button 
                    key={i} 
                    onClick={() => useDemo(sms)}
                    className="whitespace-nowrap px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-lg text-zinc-300 transition-colors"
                >
                    Demo {i + 1}
                </button>
            ))}
        </div>

        <button
            onClick={handleProcess}
            disabled={!text || isProcessing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
            {isProcessing ? (
                <>
                    <Zap className="w-4 h-4 animate-pulse" /> Processing with AI...
                </>
            ) : (
                <>
                    <Check className="w-4 h-4" /> Add Transaction
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default SmsInputModal;