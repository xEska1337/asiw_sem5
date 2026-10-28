import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { NewCar } from '../models/Car';

interface CarFormProps {
    initialValue?: NewCar;
    submitLabel: string;
    onSubmit: (car: NewCar) => Promise<void> | void;
}

const defaultCar: NewCar = {
    brand: '',
    model: '',
    doorsNumber: 4,
    luggageCapacity: 400,
    engineCapacity: 1600,
    fuelType: 0,
    productionDate: new Date().toISOString().slice(0, 10),
    averageFuelConsumption: 6,
    bodyType: 0,
};

const numericFields = new Set<keyof NewCar>([
    'doorsNumber',
    'luggageCapacity',
    'engineCapacity',
    'fuelType',
    'averageFuelConsumption',
    'bodyType',
]);

export default function CarForm({ initialValue, submitLabel, onSubmit }: CarFormProps) {
    const [car, setCar] = useState<NewCar>(initialValue ?? defaultCar);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setCar((prev) => ({
            ...prev,
            [name]: numericFields.has(name as keyof NewCar) ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit(car);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'error');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="car-form">
            <label>
                Brand
                <input name="brand" value={car.brand} onChange={handleChange} required />
            </label>
            <label>
                Model
                <input name="model" value={car.model} onChange={handleChange} required />
            </label>
            <label>
                Doors Number
                <input name="doorsNumber" type="number" min={2} max={5} value={car.doorsNumber} onChange={handleChange} required />
            </label>
            <label>
                Luggage Capacity (l)
                <input name="luggageCapacity" type="number" min={0} value={car.luggageCapacity} onChange={handleChange} required />
            </label>
            <label>
                Engine Capacity (cm³)
                <input name="engineCapacity" type="number" min={1} value={car.engineCapacity} onChange={handleChange} required />
            </label>
            <label>
                Fuel Type
                <select name="fuelType" value={car.fuelType} onChange={handleChange}>
                    <option value={0}>Petrol</option>
                    <option value={1}>Diesel</option>
                    <option value={2}>Hybrid</option>
                    <option value={3}>Electric</option>
                    <option value={4}>LPG</option>
                </select>
            </label>
            <label>
                Production Date
                <input name="productionDate" type="date" value={car.productionDate} onChange={handleChange} required />
            </label>
            <label>
                Average Fuel Consumption (l/100 km)
                <input name="averageFuelConsumption" type="number" step="0.1" min={0.1} value={car.averageFuelConsumption} onChange={handleChange} required />
            </label>
            <label>
                Body Type
                <select name="bodyType" value={car.bodyType} onChange={handleChange}>
                    <option value={0}>Hatchback</option>
                    <option value={1}>Sedan</option>
                    <option value={2}>Kombi</option>
                    <option value={3}>SUV</option>
                    <option value={4}>Roadster</option>
                </select>
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : submitLabel}
            </button>
        </form>
    );
}