import axios from 'axios';
import { IChangePassword, TAppointment, TReservation, TUser } from '../interface/index';

import axiosJWT from './axiosJwt';


export const API_URL = "https://car-db.aundoautoservice.de ";



// user
export const userRegister = (user: TUser) => {
    const url = `${API_URL}/user/register`;
    return axios.post(url, user);
}

export const getAllUsers = () => {
    const url = `${API_URL}/user/allUsers`;
    return axios.get(url);
}

export const userLogin = (user: TUser) => {
    const url = `${API_URL}/user/login`;
    return axiosJWT.post(url, user);
}

export const refreshToken = () => {
    const url = `${API_URL}/user/refreshToken`;
    return axios.get(url, { withCredentials: true });
};

export const checkAccessToken = () => {
    const url = `${API_URL}/user/check-token`;
    return axios.get(url);
  };
  

export const deleteAccount = (targetUserId:string) => {
    const url = `${API_URL}/user/deleteAccount/${targetUserId}`;
    return axiosJWT.delete(url);
}

export const requestPasswordReset = (email: string) => {
    const url = `${API_URL}/user/requestPasswordReset`;
    return axios.post(url, { email });
}

export const confirmEmailVerificationCode = (email: string, verificationCode: string) => {
    const url = `${API_URL}/user/confirmVerificationCode`;
    return axios.post(url, { email, verificationCode });
};

export const changePasswordWithEmail = (passwordData: IChangePassword) => {
    const url = `${API_URL}/user/changePasswordWithEmail`;
    return axios.put(url, passwordData);
};

export const userLogout = () => {
    const url = `${API_URL}/user/logout`;
    return axiosJWT.delete(url);
}


//offer
export const getOffers = async () => {
    const url = `${API_URL}/offer/getOffers`;
    return axios.get(url, { withCredentials: true });
}

export const createOffer = async (formData: FormData) => {
    const url = `${API_URL}/offer/createOffer`;
    return axios.post(url, formData, { withCredentials: true });
}

export const deleteOffer = async (userId: string, offerId: string) => {
    const url = `${API_URL}/offer/deleteOffer/`;
    return axios.delete(url, {
        data: { userId, offerId },
    });
};

export const editOffer = async (formData: FormData) => {
    const url = `${API_URL}/offer/editOffer`;
    try {
        console.log("Sending FormData to:", url);
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        const response = await axios.put(url, formData, { withCredentials: true });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.data);
            throw new Error(error.response?.data?.message || 'Fehler beim Bearbeiten des Angebots');
        } else {
            console.error("General Error:", error);
            throw new Error('Fehler beim Bearbeiten des Angebots');
        }
    }
};


// appointment
export const getAllsAppointment = () => {
    const url = `${API_URL}/appointment/all`;
    return axios.get(url);
};

export const blockAppointment = (appointment: TAppointment) => {
    const url = `${API_URL}/appointment/block`;
    return axios.post(url, appointment);
}

export const unblockAppointment = (appointmentId: string) => {
    const url = `${API_URL}/appointment/unblock`;
    return axios.delete(url, { data: { appointmentId } });
}


// carBuy

export const getCarBuys = () => {
    const url = `${API_URL}/buy/allBuys`;
    return axios.get(url);
}

export const createBuyCar = async (FormData: FormData) => {
    const url = `${API_URL}/buy/create`;
    return axios.post(url, FormData, { withCredentials: true });
}

export const updateCarBuy = async (FormData: FormData) => {
    const url = `${API_URL}/buy/update`;
    return axios.put(url, FormData, { withCredentials: true });
}

export const deleteCarBuy = async (userId: string, carId: string) => {
    const url = `${API_URL}/buy/delete`;
    return axios.delete(url, {
        data: { userId, carId },
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// reservation

export const getReservation = () => {
    const url = `${API_URL}/reservation/get-reservation`
    return axios.get(url)
}

export const updateStatusReservation = (reservation: TReservation) => {
    const url = `${API_URL}/reservation/update-status/${reservation._id}`;  
    return axios.put(url, {
      paymentStatus: reservation.paymentStatus,
      isBooked: reservation.isBooked,
    });
  };

  export const rejectReservation = (reservation: TReservation) => {
    const url = `${API_URL}/reservation/reject`;
    return axios.post(url, {
      reservationId: reservation._id,
      email: reservation.email,
      userId: reservation.userId,
    });
  };

  // carRent

  export const getCarRents = () => {
    const url = `${API_URL}/rent/getRents`;
    return axios.get(url);
  }

  export const createCarRent = async (FormData: FormData) => {
    const url = `${API_URL}/rent/create`;
    return axios.post(url, FormData, { withCredentials: true });
  }

  export const deleteCarRent = async (userId: string, carId: string) => {
    const url = `${API_URL}/rent/deleteRentCar`
    return axios.delete(url, { data: { userId, carId } })
  }

  export const updateCarRent = async (FormData: FormData) => {
    const url = `${API_URL}/rent/updateRentCar`;
    try {
        console.log("Sending FormData to:", url);
        FormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        const response = await axios.put(url, FormData, { withCredentials: true });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.data);
            throw new Error(error.response?.data?.message || 'Fehler beim Bearbeiten des Angebots');
        } else {
            console.error("General Error:", error);
            throw new Error('Fehler beim Bearbeiten des Angebots');
        }
    }
  }
  