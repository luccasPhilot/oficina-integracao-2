import crypto from 'crypto';

export const generateRandomId = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    const length = 8;
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charactersLength);
        randomId += characters[randomIndex];
    }

    return randomId;
}