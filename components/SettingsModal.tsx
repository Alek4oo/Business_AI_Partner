import React, { useState } from 'react';
import { X, Moon, Bell, Globe, Shield, Smartphone } from 'lucide-react';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    // Local state for visual toggles
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: true,
        twoFactor: false
    });
    const [loading, setLoading] = useState(true);

    // Fetch settings on mount
    React.useEffect(() => {
        const loadSettings = async () => {
            try {
                const { api } = await import('../services/api');
                const data = await api.getSettings();
                if (data) {
                    setSettings({
                        notifications: data.notifications,
                        darkMode: data.darkMode,
                        twoFactor: data.twoFactor
                    });
                    // Sync theme with loaded setting
                    if (data.darkMode) {
                        document.body.classList.remove('light-mode');
                    } else {
                        document.body.classList.add('light-mode');
                    }
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const toggle = async (key: keyof typeof settings) => {
        const newValue = !settings[key];
        const newSettings = { ...settings, [key]: newValue };
        setSettings(newSettings);

        // Real Effects
        if (key === 'darkMode') {
            if (newValue) {
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
            }
        }

        if (key === 'notifications' && newValue === true) {
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification("ApexBusiness Notifications", { body: "Notifications enabled successfully!" });
                    }
                });
            }
        }

        if (key === 'twoFactor' && newValue === true) {
            // Simulate 2FA setup flow
            alert("To complete 2FA setup, please check your email for a confirmation code.");
        }

        // Persist to Backend
        try {
            const { api } = await import('../services/api');
            await api.updateSettings(newSettings);
        } catch (err) {
            console.error('Failed to save settings', err);
            // Revert on failure
            setSettings(prev => ({ ...prev, [key]: !newValue }));
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden animate-fadeIn scale-100 shadow-2xl border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/40">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Appearance */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Appearance</h3>

                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div className="flex items-center gap-3 text-slate-200">
                                <div className="p-2 bg-slate-800 rounded-lg text-amber-400">
                                    <Moon size={18} />
                                </div>
                                <span className="font-medium">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => toggle('darkMode')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-amber-500' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Notifications</h3>

                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div className="flex items-center gap-3 text-slate-200">
                                <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                                    <Bell size={18} />
                                </div>
                                <span className="font-medium">Push Notifications</span>
                            </div>
                            <button
                                onClick={() => toggle('notifications')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.notifications ? 'bg-amber-500' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Security */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Security</h3>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3 text-slate-200">
                                <div className="p-2 bg-slate-800 rounded-lg text-rose-400">
                                    <Shield size={18} />
                                </div>
                                <span className="font-medium">Two-Factor Auth</span>
                            </div>
                            <button
                                onClick={() => toggle('twoFactor')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.twoFactor ? 'bg-amber-500' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings.twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                </div>

                <div className="p-6 bg-slate-900/40 text-center">
                    <p className="text-xs text-slate-500">Version 1.0.1 &bull; ApexBusiness Ultimate</p>
                </div>

            </div>
        </div>
    );
};

export default SettingsModal;
