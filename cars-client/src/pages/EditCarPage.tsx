import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

function toNewCar(car: Car): NewCar {
    return {
        brand: car.brand,
        model: car.model,
        doorsNumber: car.doorsNumber,
        luggageCapacity: car.luggageCapacity,
        engineCapacity: car.engineCapacity,
        fuelType: car.fuelType,
        productionDate: car.productionDate.split('T')[0],
        averageFuelConsumption: car.averageFuelConsumption,
        bodyType: car.bodyType,
    };
}

export default function EditCarPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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

    async function handleSubmit(updated: NewCar) {
        if (!id) return;
        await updateCar(id, updated);
        navigate(`/cars/${id}`);
    }

    if (loading) return <p>Loading…</p>;
    if (error) return <p className="error">Error: {error}</p>;
    if (!car) return <p>Car not found.</p>;

    return (
        <section>
            <h1>Edit Car</h1>
            <CarForm
                initialValue={toNewCar(car)}
                submitLabel="Save Changes"
                onSubmit={handleSubmit}
            />
        </section>
    );
}