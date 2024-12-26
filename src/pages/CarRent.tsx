import CarRents from "../components/rent/CarRents";
import CreateCarRent from "../components/rent/CreateCarRent";

const CarRent = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Fahrzeuge</h1>
            <p>Hier sind alle Fahrzeuge für Vermietung aufgelistet.</p>
            <CarRents />
            <div>
                <CreateCarRent />
            </div>
        </div>
    );
}

export default CarRent;