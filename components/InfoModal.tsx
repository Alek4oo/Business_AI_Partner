import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden animate-fadeIn shadow-2xl border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/40">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh] text-slate-300 leading-relaxed">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-slate-900/40 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
