import axios from 'axios';
import { TOffer, TUser } from '../interface/index';
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

export const getOffers = async () => {
    const url = `${API_URL}/offer/getOffers`;
    return axios.get(url, { withCredentials: true });
}

export const createOffer = async (formData: FormData) => {
    const url = `${API_URL}/offer/createOffer`;
    return axios.post(url, formData, { withCredentials: true });
  }

export const deleteOffer = async (offer: TOffer) => {
    const url = `${API_URL}/offer/deleteOffer/`;
    return axios.delete(url, { data: offer });
}

export const editOffer = async (offer: TOffer) => {
    const url = `${API_URL}/offer/editOffer/${offer.offerId}`; // Verwende die URL für das Bearbeiten
    const formData = new FormData();
    return axios.put(url, formData, { withCredentials: true });
};