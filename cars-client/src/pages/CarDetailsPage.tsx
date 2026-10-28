import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

const fuelLabels: Record<number, string> = {
    0: 'Petrol', 1: 'Diesel', 2: 'Hybrid', 3: 'Electric', 4: 'LPG'
};

const bodyLabels: Record<number, string> = {
    0: 'Hatchback', 1: 'Sedan', 2: 'Kombi', 3: 'SUV', 4: 'Roadster'
};

export default function CarDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        setLoading(true);
        getCarById(id, controller.signal)
            .then((data) => {
                setCar(data);
                setError(null);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : 'Failed to load data.');
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [id]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!car) return <p>Car not found.</p>;

    return (
        <section>
            <h1>
                {car.brand} {car.model}
            </h1>

            <dl className="details">
                <dt>Brand</dt>
                <dd>{car.brand}</dd>
                <dt>Model</dt>
                <dd>{car.model}</dd>
                <dt>Doors Number</dt>
                <dd>{car.doorsNumber}</dd>
                <dt>Luggage Capacity</dt>
                <dd>{car.luggageCapacity} l</dd>
                <dt>Engine Capacity</dt>
                <dd>{car.engineCapacity} cm³</dd>
                <dt>Fuel Type</dt>
                <dd>{fuelLabels[car.fuelType] ?? car.fuelType}</dd>
                <dt>Production Date</dt>
                <dd>{new Date(car.productionDate).toLocaleDateString('en-GB')}</dd>
                <dt>Average Fuel Consumption</dt>
                <dd>{car.averageFuelConsumption} l/100 km</dd>
                <dt>Body Type</dt>
                <dd>{bodyLabels[car.bodyType] ?? car.bodyType}</dd>
            </dl>

            <div className="actions">
                <Link to="/cars">← Back to list</Link>
                <Link to={`/cars/${car.id}/edit`}>Edit</Link>
            </div>
        </section>
    );
}