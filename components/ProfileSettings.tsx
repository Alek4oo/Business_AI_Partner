import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Save, User, MapPin, Users, DollarSign, Lightbulb, Briefcase } from 'lucide-react';

interface ProfileSettingsProps {
    userProfile: UserProfile;
    onClose: () => void;
    onUpdate: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>(userProfile);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'capital' || name === 'teamSize') ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { api } = await import('../services/api');
            await api.updateProfile(formData);
            onUpdate(formData); // Update local state in parent
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden animate-fadeIn scale-100 shadow-2xl border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/40">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-amber-400" />
                        Edit Profile
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Read Only Identity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="opacity-70">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                                <div className="glass-card px-4 py-3 rounded-xl text-slate-300 border-white/5 bg-slate-800/50">
                                    {formData.name}
                                </div>
                            </div>
                            <div className="opacity-70">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                <div className="glass-card px-4 py-3 rounded-xl text-slate-300 border-white/5 bg-slate-800/50">
                                    {formData.email}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 my-4"></div>

                        {/* Editable Business Data */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Lightbulb size={14} className="text-amber-400" />
                                Business Idea
                            </label>
                            <textarea
                                name="businessIdea"
                                value={formData.businessIdea}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-slate-600 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <DollarSign size={14} className="text-emerald-400" />
                                    Capital (BGN)
                                </label>
                                <input
                                    type="number"
                                    name="capital"
                                    value={formData.capital}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Users size={14} className="text-blue-400" />
                                    Team
                                </label>
                                <input
                                    type="number"
                                    name="teamSize"
                                    value={formData.teamSize}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-slate-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <MapPin size={14} className="text-rose-400" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Briefcase size={14} className="text-purple-400" />
                                    Experience
                                </label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-900/40 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-2.5 rounded-xl font-bold bg-amber-400 hover:bg-amber-500 text-black shadow-lg shadow-amber-400/20 transition-all text-sm flex items-center gap-2"
                    >
                        {isLoading ? <span className="animate-spin">⌛</span> : <Save size={18} />}
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
