import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'active' : undefined;

    const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

    return (
        <div className="app-shell">
            <header>
                <h1>Cars Client</h1>
                <nav>
                    <NavLink to="/" end className={linkClass}>Home</NavLink>
                    <NavLink to="/cars" end className={linkClass}>Cars</NavLink>
                    <NavLink to="/cars/new" className={linkClass}>Add Car</NavLink>
                    <span className="favorite-counter">Favourites: {favoriteCount}</span>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}