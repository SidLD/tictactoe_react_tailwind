

export type ShippingType = {
    code: string,
    name: string,
    price: number,
    discount?: {
        minimumAmount: number,
        maximumAmount: number,
        startDay: Date,
        endDay: Date,
        type: 'FLAT' | 'PERCENTAGE'
        value: number
    }
}