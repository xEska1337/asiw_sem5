import axios from 'axios';

import type { Car, NewCar } from '../models/Car';
import { apiClient } from '../api/apiClient';

function extractValidationMessage(data: unknown): string | null {
    if (
        data &&
        typeof data === 'object' &&
        'errors' in data &&
        data.errors &&
        typeof data.errors === 'object'
    ) {
        const errorsRecord = data.errors as Record<string, unknown>;
        const messages: string[] = [];

        for (const value of Object.values(errorsRecord)) {
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (typeof item === 'string') messages.push(item);
                }
            } else if (typeof value === 'string') {
                messages.push(value);
            }
        }

        if (messages.length > 0) {
            return messages.join(' ');
        }
    }
    return null;
}

function createServiceError(error: unknown, message: string): Error {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const validationMessage = extractValidationMessage(error.response.data);
            if (validationMessage) {
                return new Error(validationMessage, { cause: error });
            }
            return new Error(
                `${message} HTTP status: ${error.response.status}.`,
                { cause: error },
            );
        }

        if (error.request) {
            return new Error(`${message} No response from the server.`, { cause: error });
        }

        return new Error(`${message} ${error.message}`, { cause: error });
    }

    return new Error(message, { cause: error });
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
    try {
        const response = await apiClient.get<Car[]>('/cars', { signal });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, 'Failed to fetch cars.');
    }
}

export async function getCarById(id: string, signal?: AbortSignal): Promise<Car> {
    try {
        const response = await apiClient.get<Car>(`/cars/${id}`, { signal });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, 'Failed to fetch car.');
    }
}

export async function createCar(car: NewCar): Promise<Car> {
    try {
        const response = await apiClient.post<Car>('/cars', car);
        return response.data;
    } catch (error) {
        throw createServiceError(error, 'Failed to create car.');
    }
}

export async function updateCar(id: string, car: NewCar): Promise<void> {
    try {
        await apiClient.put(`/cars/${id}`, car);
    } catch (error) {
        throw createServiceError(error, 'Failed to update car.');
    }
}

export async function deleteCar(id: string): Promise<void> {
    try {
        await apiClient.delete(`/cars/${id}`);
    } catch (error) {
        throw createServiceError(error, 'Failed to delete car.');
    }
}