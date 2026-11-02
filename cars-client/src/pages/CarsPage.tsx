import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import CarCard from '../components/CarCard';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchTerm = useCarUiStore((state) => state.searchTerm);
    const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
    const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
    const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
    const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
    const removeFavorite = useCarUiStore((state) => state.removeFavorite);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        getCars(controller.signal)
            .then((data) => {
                setCars(data);
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
    }, []);

    const visibleCars = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        return cars.filter((car) => {
            const matchesSearch =
                normalizedSearch === '' ||
                car.brand.toLowerCase().includes(normalizedSearch) ||
                car.model.toLowerCase().includes(normalizedSearch);

            const matchesFavorite =
                !showFavoritesOnly || favoriteCarIds.includes(car.id);

            return matchesSearch && matchesFavorite;
        });
    }, [cars, searchTerm, showFavoritesOnly, favoriteCarIds]);

    async function handleDelete(id: string) {
        const confirmed = window.confirm('Are you sure you want to delete this car?');
        if (!confirmed) return;

        try {
            await deleteCar(id);
            removeFavorite(id);
            setCars((currentCars) => currentCars.filter((car) => car.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete the car.');
        }
    }

    if (loading) return <p>Loading…</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <section>
            <h1>Car List</h1>

            <div className="cars-toolbar">
                <input
                    type="search"
                    placeholder="Search by brand or model…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <label className="favorite-filter">
                    <input
                        type="checkbox"
                        checked={showFavoritesOnly}
                        onChange={(event) => setShowFavoritesOnly(event.target.checked)}
                    />
                    Favourites only
                </label>
            </div>

            {cars.length === 0 && <p>No cars in the database.</p>}

            {cars.length > 0 && visibleCars.length === 0 && (
                <p>No results for "{searchTerm}".</p>
            )}

            <ul className="car-list">
                {visibleCars.map((car) => (
                    <CarCard key={car.id} car={car} onDelete={handleDelete} />
                ))}
            </ul>
        </section>
    );
}