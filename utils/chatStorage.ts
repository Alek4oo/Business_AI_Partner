import { ChatSession, ChatMessage } from '../types';

const STORAGE_KEY = 'apexbusiness_chat_history';
const MAX_SESSIONS = 20;

export const getChatSessions = (): ChatSession[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

export const saveChatSession = (session: ChatSession): void => {
    const sessions = getChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.unshift(session);
    }

    // Keep only last MAX_SESSIONS
    const trimmed = sessions.slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
};

export const getChatSession = (id: string): ChatSession | null => {
    const sessions = getChatSessions();
    return sessions.find(s => s.id === id) || null;
};

export const deleteChatSession = (id: string): void => {
    const sessions = getChatSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const createNewSession = (firstMessage?: string): ChatSession => {
    const now = new Date().toISOString();
    return {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: firstMessage ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? '...' : '') : 'New Conversation',
        createdAt: now,
        updatedAt: now,
        messages: []
    };
};

export const updateSessionTitle = (session: ChatSession): ChatSession => {
    // Update title based on first user message
    const firstUserMessage = session.messages.find(m => m.role === 'user');
    if (firstUserMessage) {
        session.title = firstUserMessage.text.slice(0, 40) + (firstUserMessage.text.length > 40 ? '...' : '');
    }
    session.updatedAt = new Date().toISOString();
    return session;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};
