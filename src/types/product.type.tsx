
export type ProductType = {
    image: string; 
    id?: string;
    name: string;
    description: string,
    size: "SMALL" | "MEDIUM" | "LARGE";
    amount: number;  
    tags: string[];
    stock: number;   
    discountCode: string,
    category: string
}