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
    customerNumber : string;
    
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
    userId?: string;
}

export type TAppointment = Partial<IAppointment>;

export interface ICarBuy {
    _id: string;
    carTitle: string;
    carId: string;
    carPrice: string;
    owner: string;
    isSold: boolean;
    carFirstRegistrationDay: string;
    carImages: string[] | File[];
    carDescription: string;
    carKilometers: string;
    carColor: string;
    carAirConditioning: boolean;
    carSeat: string;
    damagedCar: boolean;
    carNavigation: boolean;
    carParkAssist: boolean;
    carAccidentFree: boolean;
    carGearbox: string;
    carMotor: string;
    carHorsePower: string;
    carEuroNorm: string;
    fuelType: string;
    carTechnicalInspection: string;
    carCategory: string;
    userId: string;
    createdAt: string;
    carIdentificationNumber: string;
   
}

export type TBuy = Partial<ICarBuy>;