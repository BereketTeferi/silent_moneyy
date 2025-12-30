import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType, Category } from '../types';

interface Props {
  transactions: Transaction[];
}

const Insights: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === TransactionType.DEBIT);
  const income = transactions.filter(t => t.type === TransactionType.CREDIT);

  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);

  const categoryData = Object.values(Category)
    .filter(c => c !== Category.INCOME)
    .map(cat => {
      const amount = expenses
        .filter(t => t.category === cat)
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: cat, value: amount };
    })
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#F97316', '#3B82F6', '#A855F7', '#EAB308', '#06B6D4', '#71717A', '#EF4444', '#64748B'];

  if (transactions.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <p>Not enough data for insights.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Income</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
                <span className="text-sm align-top mr-0.5">ETB</span>
                {totalIncome.toLocaleString()}
            </p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">Expenses</p>
            <p className="text-xl font-bold text-red-400 mt-1">
                <span className="text-sm align-top mr-0.5">ETB</span>
                {totalExpense.toLocaleString()}
            </p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-5 rounded-xl">
        <h3 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
            <span className="text-lg">✨</span> Smart Insight
        </h3>
        <p className="text-zinc-300 text-sm leading-relaxed">
            {categoryData.length > 0 ? (
                `You spent ${Math.round((categoryData[0].value / totalExpense) * 100)}% of your expenses on ${categoryData[0].name} this period.`
            ) : (
                "Track more expenses to see smart insights."
            )}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
        <h3 className="font-semibold mb-4">Spending by Category</h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                        itemStyle={{ color: '#e4e4e7' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-zinc-400 flex-1">{cat.name}</span>
                    <span className="font-mono text-zinc-200">{Math.round((cat.value / totalExpense) * 100)}%</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Insights;