import React from 'react';
import { MessageCircle, Trash2, Plus, X, Clock } from 'lucide-react';
import { ChatSession } from '../types';
import { getChatSessions, deleteChatSession, formatDate } from '../utils/chatStorage';

interface ChatHistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectSession: (session: ChatSession) => void;
    onNewChat: () => void;
    currentSessionId?: string;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
    isOpen,
    onClose,
    onSelectSession,
    onNewChat,
    currentSessionId
}) => {
    const [sessions, setSessions] = React.useState<ChatSession[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            setSessions(getChatSessions());
        }
    }, [isOpen]);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteChatSession(id);
        setSessions(getChatSessions());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-80 h-full bg-slate-900 border-r border-white/10 shadow-2xl animate-fadeIn flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageCircle size={20} className="text-amber-400" />
                        Chat History
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-3 border-b border-white/5">
                    <button
                        onClick={() => { onNewChat(); onClose(); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-all"
                    >
                        <Plus size={18} />
                        New Conversation
                    </button>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => { onSelectSession(session); onClose(); }}
                                className={`group p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id
                                        ? 'bg-amber-400/10 border border-amber-400/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${currentSessionId === session.id ? 'text-amber-400' : 'text-white'
                                            }`}>
                                            {session.title}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Clock size={12} />
                                            {formatDate(session.updatedAt)}
                                            <span className="mx-1">•</span>
                                            {session.messages.length} messages
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, session.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/10 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-500">
                        {sessions.length}/20 conversations saved
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryPanel;
