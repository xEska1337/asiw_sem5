import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
    car: Car;
    onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
    const isFavorite = useCarUiStore((state) => state.favoriteCarIds.includes(car.id));
    const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

    return (
        <li className="car-item">
            <strong>
                {car.brand} {car.model}
            </strong>
            <div className="actions">
                <button
                    type="button"
                    className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
                    onClick={() => toggleFavorite(car.id)}
                >
                    {isFavorite ? '★ Favourite' : '♡ Favourite'}
                </button>
                <Link to={`/cars/${car.id}`}>Details</Link>
                <Link to={`/cars/${car.id}/edit`}>Edit</Link>
                <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDelete(car.id)}
                >
                    Delete
                </button>
            </div>
        </li>
    );
}