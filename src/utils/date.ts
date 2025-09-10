
export function formatDate(timestamp: number){
    const date = new Date(timestamp * 1000);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} at ${hours}:${minutes}`;
}

export function getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
}

export function getTimestampInMs() {
    return Date.now();
}