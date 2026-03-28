import { nanoid } from 'nanoid';

export const generateCouponCode = () => {
    const prefix = "OFFER"; 
    return `${prefix}-${nanoid(6).toUpperCase()}`;
};