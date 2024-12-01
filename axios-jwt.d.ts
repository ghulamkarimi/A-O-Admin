// src/axios-jwt.d.ts
declare module 'axios-jwt' {
    import { AxiosInstance } from 'axios';

    export interface AxiosJWT {
        interceptors: {
            request: {
                use: (onFulfilled: (config: any) => any, onRejected?: (error: any) => any) => void;
            };
        };
    }

    export function createAxiosJwt(axios: AxiosInstance): AxiosJWT;
}
