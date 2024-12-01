export interface IOffer {
    _id: string;
    title: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    userId:string;
    imageUrl: string; 
    offerId: string;
    
}
export type TOffer = Partial<IOffer>;