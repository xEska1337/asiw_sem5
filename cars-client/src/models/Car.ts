export interface Car {
    id: string;
    brand: string;
    model: string;
    doorsNumber: number;
    luggageCapacity: number;
    engineCapacity: number;
    fuelType: number;
    productionDate: string;
    averageFuelConsumption: number;
    bodyType: number;
}

export type NewCar = Omit<Car, 'id'>;