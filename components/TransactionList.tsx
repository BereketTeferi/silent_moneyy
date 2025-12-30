import React from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { TrendingUp, TrendingDown, Wallet, Zap } from './Icons';

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
}

const CategoryColors: Record<Category, string> = {
  [Category.FOOD]: 'bg-orange-500/20 text-orange-400',
  [Category.TRANSPORT]: 'bg-blue-500/20 text-blue-400',
  [Category.RENT]: 'bg-purple-500/20 text-purple-400',
  [Category.UTILITIES]: 'bg-yellow-500/20 text-yellow-400',
  [Category.INTERNET]: 'bg-cyan-500/20 text-cyan-400',
  [Category.TRANSFER]: 'bg-zinc-500/20 text-zinc-400',
  [Category.FEES]: 'bg-red-500/20 text-red-400',
  [Category.INCOME]: 'bg-emerald-500/20 text-emerald-400',
  [Category.OTHER]: 'bg-gray-500/20 text-gray-400',
};

const TransactionList: React.FC<Props> = ({ transactions, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Wallet className="w-12 h-12 mb-4 opacity-20" />
        <p>No transactions yet.</p>
        <p className="text-sm">Tap "+" to add a bank SMS.</p>
      </div>
    );
  }

  // Group by date
  const grouped = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date).toLocaleDateString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6 pb-24">
      {Object.keys(grouped).map((date) => {
        const txs = grouped[date];
        return (
          <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">{date}</h3>
            <div className="space-y-3">
              {txs.map(tx => (
                <div 
                  key={tx.id}
                  onClick={() => onEdit(tx)}
                  className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${CategoryColors[tx.category]}`}>
                      {tx.type === TransactionType.CREDIT ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-200 line-clamp-1">{tx.category}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1">{tx.bankName} • {tx.description}</p>
                      {tx.isAiClassified && (
                          <div className="flex items-center gap-1 mt-1">
                              <Zap className="w-3 h-3 text-purple-400" />
                              <span className="text-[10px] text-purple-400">AI Classified</span>
                          </div>
                      )}
                    </div>
                  </div>
                  <div className={`text-right font-mono font-medium ${tx.type === TransactionType.CREDIT ? 'text-emerald-400' : 'text-zinc-200'}`}>
                    {tx.type === TransactionType.CREDIT ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-xs text-zinc-500">{tx.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;