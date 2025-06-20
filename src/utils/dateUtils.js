export const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([],{
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (timestamp) => {
    return timestamp.toLocaleDateString();
};

export const formatDateTime = (timestamp) => {
    return timestamp.toLocaleString;
};

export const isToday = (timestamp) => {
    const today = new Date();
    return timestamp.toDateString() === today.toDateString();
};

export const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;  

    const minutes = Math.floor(diff/60000);
    if(minutes < 1) return 'Just Now';
    if(minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes/60);
    if(hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours/24);
    return `${days}d ago`;
};