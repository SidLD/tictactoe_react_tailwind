import { z } from 'zod';

// Define the DiscountType
export type DiscountType = {
    code: string;          // Discount code (e.g., 'SUMMER2025', 'FREESHIP')
    amount: number;        // Discount amount (flat or percentage)
    type: 'PERCENT' | 'FLAT'; // Type of discount (percentage or flat)
    available: boolean;    // Whether the discount is available for use
    startDate?: Date;      // Optional: Start date when the discount becomes valid
    endDate?: Date;        // Optional: End date when the discount expires
    minimumPurchase?: number;
    conditions?: ['NEW_USER', 'LAST_STOCK', 'DISCOUNT']
};

export const DiscountTypeSchema = z.object({
    code: z.string().min(1, "Discount code is required"),
    amount: z.number().min(0, "Discount amount must be positive"),
    type: z.enum(['PERCENT', 'FLAT']),
    available: z.boolean(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minimumPurchase: z.number().min(0).optional(),
    conditions: z.string().optional(),
});

export type ValidatedDiscountType = z.infer<typeof DiscountTypeSchema>;
