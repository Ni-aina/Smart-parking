const formatCacheSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

export default formatCacheSize;