import React, { useEffect } from 'react';
import { Check, Zap } from './Icons';

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300 w-[90%] max-w-sm">
      <div className="bg-zinc-800/90 backdrop-blur-md border border-emerald-500/30 text-zinc-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
        <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400">
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex-1 text-sm font-medium">{message}</div>
      </div>
    </div>
  );
};

export default Toast;