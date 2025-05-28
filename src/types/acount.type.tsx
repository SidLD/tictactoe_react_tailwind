import { CouponType } from "./coupon.type"
import { DiscountType } from "./discount.type"
import { ProductType } from "./product.type"

export type CartData = {
    products: ProductType[]
    discounts: DiscountType[]
    coupons: CouponType[]
    shipping: Array<{
      id: string
      name: string
      price: number
      estimatedDays: string
      minimumPurchase?: number
    }>
    user: {
        id: string
    }
}