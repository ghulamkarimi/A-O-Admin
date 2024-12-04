export interface IOffer {
    _id: string;
    title: string;
    description: string;
    oldPrice: number;
    newPrice: number;
    userId:string;
    discountPercentage?: number; 
    imageUrl: string; 
    offerId: string;
    createdAt: string;
    
}
export type TOffer = Partial<IOffer>;


export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    phone: string;
    profile_photo: string;
    token: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    verificationCode: string;
    isAccountVerified: boolean;
    createdAt: string; 
    
}
export interface IUserInfo {
    userId: string;
    firstName: string;
    lastName: string;
    profile_photo: string;
    email: string;
    isAdmin: boolean;
    isAccountVerified?: boolean;
    exp: number;
    iat: number;
}
export type TUser = Partial<IUser>;

export interface IChangePassword {
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export interface  IAppointment {
    _id: string
    service: string;
    date: string;
    time: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    comment: string;
    licensePlate: string;
    hsn: string;
    tsn: string;
    isBookedOrBlocked: boolean;
    appointmentId: string;  
}

export type TAppointment = Partial<IAppointment>;