const toDate = (timestamp) =>
    timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);

export const formatTime = (timestamp) => {
    const date = toDate(timestamp);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDate = (timestamp) => {
    const date = toDate(timestamp);
    return date.toLocaleDateString();
};

export const formatDateTime = (timestamp) => {
    const date = toDate(timestamp);
    return date.toLocaleString();
};

export const isToday = (timestamp) => {
    const date = toDate(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const getRelativeTime = (timestamp) => {
    const date = toDate(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};
