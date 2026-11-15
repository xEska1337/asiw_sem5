export interface User {
    id: string;
    userName: string;
    email: string;
    token: string;
    roles: string[];
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    userName: string;
    email: string;
    password: string;
}