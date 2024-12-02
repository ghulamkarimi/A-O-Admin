import axios from 'axios';
import { IChangePassword, TOffer, TUser } from '../interface/index';
import { Socket, io } from 'socket.io-client';
import axiosJWT from './axiosJwt';

const API_URL = "http://localhost:7001";

export const socket: Socket = io(API_URL, {
    autoConnect: false, // Automatisches Verbinden vermeiden, bis es explizit verlangt wird
});

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
    return axios.get(url, { withCredentials: true }); // Mit Credentials senden
};
export const requestPasswordReset =(email: string) => {
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

export const getOffers = async () => {
    const url = `${API_URL}/offer/getOffers`;
    return axios.get(url, { withCredentials: true });
}

export const createOffer = async (formData: FormData) => {
    const url = `${API_URL}/offer/createOffer`;
    return axios.post(url, formData, { withCredentials: true });
  }
// serviceAPI.ts
export const deleteOffer = async (userId: string, offerId: string) => {
    const url = `${API_URL}/offer/deleteOffer/`;
    return axios.delete(url, {
        data: { userId, offerId },  // userId und offerId im Request-Body
    });
};


export const editOffer = async (formData: FormData) => {
    const url = `${API_URL}/offer/editOffer`;
    try {
        const response = await axios.put(url, formData, { withCredentials: true });
        return response.data; // Rückgabe des aktualisierten Angebots
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Fehler beim Bearbeiten des Angebots');
        } else {
            throw new Error('Fehler beim Bearbeiten des Angebots');
        }
    }
};
