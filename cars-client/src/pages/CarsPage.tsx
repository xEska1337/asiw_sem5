import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        getCars(controller.signal)
            .then((data) => {
                setCars(data);
                setError(null);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : 'Failed to load data.');
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const filteredCars = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return cars;
        return cars.filter(
            (c) => c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q)
        );
    }, [cars, filter]);

    async function handleDelete(id: string) {
        const confirmed = window.confirm('Are you sure you want to delete this car?');
        if (!confirmed) return;

        try {
            await deleteCar(id);
            setCars((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete the car.');
        }
    }

    if (loading) return <p>Loading…</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <section>
            <h1>Car List</h1>

            <input
                type="text"
                className="filter-input"
                placeholder="Filter by brand or model…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            {cars.length === 0 && <p>No cars in the database.</p>}

            {cars.length > 0 && filteredCars.length === 0 && (
                <p>No results for "{filter}".</p>
            )}

            <ul className="car-list">
                {filteredCars.map((car) => (
                    <li key={car.id} className="car-item">
                        <strong>
                            {car.brand} {car.model}
                        </strong>
                        <div className="actions">
                            <Link to={`/cars/${car.id}`}>Details</Link>
                            <Link to={`/cars/${car.id}/edit`}>Edit</Link>
                            <button type="button" onClick={() => handleDelete(car.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}