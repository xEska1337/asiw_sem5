import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCarById } from '../services/carService';
import { useAuthStore } from '../store/useAuthStore';
import { useCarUiStore } from '../store/useCarUiStore';

const fuelLabels: Record<number, string> = {
    0: 'Petrol', 1: 'Diesel', 2: 'Hybrid', 3: 'Electric', 4: 'LPG'
};

const bodyLabels: Record<number, string> = {
    0: 'Hatchback', 1: 'Sedan', 2: 'Kombi', 3: 'SUV', 4: 'Roadster'
};

export default function CarDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const user = useAuthStore((state) => state.user);

    const favoriteCarIds = useCarUiStore((state) =>
        user ? state.favoriteCarIdsByUser[user.id] ?? [] : [],
    );
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
    const removeFavorite = useCarUiStore((state) => state.removeFavorite);

    const isFavorite = car ? favoriteCarIds.includes(car.id) : false;
    const isAdmin = user?.roles.includes('Admin') ?? false;

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        setLoading(true);
        getCarById(id, controller.signal)
            .then((data) => {
                setCar(data);
                setError(null);
            })
            .catch((caughtError: unknown) => {
                if (axios.isCancel(caughtError)) return;
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : 'An unknown error occurred.',
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });
        return () => controller.abort();
    }, [id]);

    async function handleDelete() {
        if (!car || !user) return;
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            setDeleting(true);
            await deleteCar(car.id);
            removeFavorite(user.id, car.id);
            navigate('/cars');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete the car.');
            setDeleting(false);
        }
    }

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
                <button
                    type="button"
                    className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
                    onClick={() => {
                        if (user) {
                            toggleFavorite(user.id, car.id);
                        }
                    }}
                >
                    {isFavorite ? '★ Favourite' : '♡ Favourite'}
                </button>
                <Link to={`/cars/${car.id}/edit`}>Edit</Link>
                {isAdmin && (
                    <button
                        type="button"
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                )}
            </div>
        </section>
    );
}