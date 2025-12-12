import React, { useState } from 'react';
import { Download, Share2, Printer, Check, Copy, X } from 'lucide-react';
import { exportToPDF, generateShareLink, copyToClipboard, printSection } from '../utils/exportUtils';

interface ActionBarProps {
    sectionId: string;
    sectionName: string;
    businessId?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ sectionId, sectionName, businessId = 'demo' }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        const success = await exportToPDF(sectionId, `ApexBusiness-${sectionName}`);
        setIsExporting(false);
        if (success) {
            showToast('PDF downloaded successfully!');
        } else {
            showToast('Failed to export PDF', 'error');
        }
    };

    const handlePrint = () => {
        printSection(sectionId);
        showToast('Print dialog opened');
    };

    const handleCopyLink = async () => {
        const link = generateShareLink(businessId, sectionName);
        const success = await copyToClipboard(link);
        if (success) {
            setCopied(true);
            showToast('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    title="Download as PDF"
                >
                    <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
                    <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'PDF'}</span>
                </button>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                    title="Print"
                >
                    <Printer size={16} />
                    <span className="hidden md:inline">Print</span>
                </button>

                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg text-sm text-amber-400 hover:text-amber-300 transition-all"
                    title="Share"
                >
                    <Share2 size={16} />
                    <span className="hidden md:inline">Share</span>
                </button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-[15vh] overflow-y-auto"
                    onClick={(e) => e.target === e.currentTarget && setShowShareModal(false)}
                >
                    <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn shadow-2xl border border-white/10 bg-slate-900">
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Share2 size={18} className="text-amber-400" />
                                Share Report
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4 bg-slate-900/60">
                            <p className="text-sm text-slate-400">
                                Share this report with your team or investors:
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={generateShareLink(businessId, sectionName)}
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${copied
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-400 hover:bg-amber-500 text-black'
                                        }`}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border animate-fadeIn flex items-center gap-2 ${toast.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}
        </>
    );
};

export default ActionBar;
