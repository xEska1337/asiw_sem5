import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useAuthStore } from '../store/useAuthStore';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
    car: Car;
    onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const user = useAuthStore((state) => state.user);

    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];
    const isFavorite = favoriteCarIds.includes(car.id);
    const isAdmin = user?.roles.includes('Admin') ?? false;

    return (
        <li className="car-item">
            <strong>
                {car.brand} {car.model}
            </strong>
            <div className="actions">
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
                <Link to={`/cars/${car.id}`}>Details</Link>
                <Link to={`/cars/${car.id}/edit`}>Edit</Link>
                {isAdmin && (
                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => onDelete(car.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </li>
    );
}