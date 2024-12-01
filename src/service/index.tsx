import axios from 'axios';
import { TOffer } from '../interface/index';
import { Socket, io } from 'socket.io-client';

const API_URL = "http://localhost:7001";

export const socket: Socket = io(API_URL, {
    autoConnect: false, // Automatisches Verbinden vermeiden, bis es explizit verlangt wird
});

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
    const url = `${API_URL}/offer/editOffer/`;
    return axios.put(url, offer);
}