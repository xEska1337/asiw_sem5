import { useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
    const navigate = useNavigate();

    async function handleSubmit(car: NewCar) {
        const created = await createCar(car);
        navigate(`/cars/${created.id}`);
    }

    return (
        <section>
            <h1>Add a Car</h1>
            <CarForm submitLabel="Add Car" onSubmit={handleSubmit} />
        </section>
    );
}