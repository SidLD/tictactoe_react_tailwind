
export type CouponType = {
    code: string;          
    amount: number;       
    type: 'PERCENT' | 'FLAT'; 
    available: boolean;   
    startDate?: Date;      
    endDate?: Date;        
    minimumPurchase?: number; 
    shippingConditions?: { 
        freeShippingThreshold: number;
    };
};
