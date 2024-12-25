import CarRents from "../components/rent/CarRents";

const CarRent = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Fahrzeuge</h1>
            <p>Hier sind alle Fahrzeuge für Vermietung aufgelistet.</p>
            <CarRents />
        </div>
    );
}

export default CarRent;