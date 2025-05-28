import { z } from 'zod';
import { ProductType } from './product.type';
import { DiscountType } from './discount.type';
import { CouponType } from './coupon.type';
import { ShippingType } from './shipping.type';

export type CartItem = {
    product: ProductType,
    discount?: DiscountType,
    count: number,
    total: number
    discountedTotal: number,
    isChecked: boolean,
    addedDateTime: Date
}

export type CartType = {
    id?: string;                       
    userId: string;                   
    items: CartItem[],       
    coupon?: CouponType;   
    shipping: ShippingType | null      
    subTotal: number,   
    totalPrice: number,           
    termsAndAgreement?: boolean;
};


export const CartTypeSchema = z.object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    products: z.array(z.string()),   
    discountCode: z.string().optional(), 
    shippingChoice: z.string().optional(), 
    totalPrice: z.number().min(0, "Total price cannot be negative"),
    discount: z
        .object({
            code: z.string().min(1, "Discount code is required"),
            amount: z.number().min(0, "Discount amount must be positive"),
            type: z.enum(['PERCENT', 'FLAT']),
            available: z.boolean(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            minimumPurchase: z.number().min(0).optional(),
            conditions: z.string().optional(),
        })
        .optional(),
    isPaid: z.boolean().optional(), // Optional payment status
});

// Type validation of the CartType
export type ValidatedCartType = z.infer<typeof CartTypeSchema>;

