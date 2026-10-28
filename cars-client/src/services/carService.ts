import type { Car, NewCar } from '../models/Car';

const carsUrl = 'http://localhost:3000/cars';

async function ensureSuccess(response: Response) {
    if (!response.ok) {
        throw new Error(`Request failed. Status: ${response.status}`);
    }
}

export async function getCars(
    signal?: AbortSignal
): Promise<Car[]> {
    const response = await fetch(carsUrl, { signal });
    await ensureSuccess(response);
    return await response.json();
}

export async function getCarById(
    id: string,
    signal?: AbortSignal
): Promise<Car> {
    const response = await fetch(`${carsUrl}/${id}`, { signal });
    await ensureSuccess(response);
    return await response.json();
}

export async function createCar(
    car: NewCar
): Promise<Car> {
    const response = await fetch(carsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
    });

    await ensureSuccess(response);
    return await response.json();
}

export async function updateCar(
    id: string,
    car: NewCar
): Promise<Car> {
    const response = await fetch(`${carsUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
    });

    await ensureSuccess(response);
    return await response.json();
}

export async function deleteCar(
    id: string
): Promise<void> {
    const response = await fetch(
        `${carsUrl}/${id}`,
        { method: 'DELETE' }
    );

    await ensureSuccess(response);
}