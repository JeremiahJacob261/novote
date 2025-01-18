const getOrCreateSecretKey = (): string => {
    const length = 24;
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    return Array.from(array)
        .map(byte => byte % 62)  // 62 is the length of our character set
        .map(value => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(value))
        .join('');
};


export { getOrCreateSecretKey };

