import { useDispatch, useSelector } from "react-redux";
import { displayRents, deleteCarRentApi } from "../../feuture/reducers/rentSlice";
import { AppDispatch } from "../../feuture/store";
import { NotificationService } from "../../service/NotificationService";
import { useNavigate } from "react-router-dom";

const CarRents = () => {
    const cars = useSelector(displayRents);
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch<AppDispatch>();
    const navigate=useNavigate()

    const handleDelete = async (carId: string) => {
        if (!userId) {
            NotificationService.error("Benutzer nicht angemeldet.");
            return;
        }
        try {
            await dispatch(deleteCarRentApi({ userId, carId })).unwrap();
            NotificationService.success("Auto erfolgreich gelöscht!");
        } catch (error) {
            NotificationService.error((error as Error).message || "Fehler beim Löschen des Autos.");
        }
    };


    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                Alle Fahrzeuge für Vermietung
            </h1>

            <div className="space-y-8">
                {cars.length > 0 ? (
                    cars.map((car) => (
                        <div
                            key={car._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all transform hover:scale-[1.01] w-full"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="lg:col-span-1">
                                    <img
                                        src={car.carImage}
                                        alt={car.carName}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>

                                <div className="p-6 lg:col-span-2 space-y-4 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {car.carName}
                                        </h2>
                                        <p className="text-lg text-gray-700 mt-2">
                                            🚗 <strong>Anzahl Türen:</strong> {car.carDoors}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            ⚙️ <strong>Getriebe:</strong> {car.carGear}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            👥 <strong>Plätze:</strong> {car.carPeople}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            ❄️ <strong>Klimaanlage:</strong>{" "}
                                            {car.carAC ? "Ja" : "Nein"}
                                        </p>
                                        <p className="text-2xl font-bold text-red-500 mt-4">
                                            {car.carPrice} € / Tag
                                        </p>
                                    </div>

                                    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                            📅 Gebuchte Zeiten
                                        </h3>

                                        {car.bookedSlots && car.bookedSlots.length > 0 ? (
                                            <div className="space-y-4">
                                                {car.bookedSlots.map((slot, index) => {
                                                    const start = new Date(slot.start);
                                                    const end = new Date(slot.end);
                                                    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                                    const formattedStart = start.toISOString().slice(0, 16).replace('T', ', ');
                                                    const formattedEnd = end.toISOString().slice(0, 16).replace('T', ', ');

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <div className="hidden md:w-10 h-10 md:flex items-center justify-center bg-blue-500 text-white font-semibold rounded-full">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-medium">
                                                                        <span className="text-gray-600">Start:</span> {formattedStart}
                                                                    </p>
                                                                    <p className="text-lg font-medium">
                                                                        <span className="text-gray-600">Ende:</span> {formattedEnd}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 md:mt-0 text-center">
                                                                <p className="text-xl font-semibold text-blue-600">{duration} Tage</p>
                                                                <p className="text-sm text-gray-500">Dauer</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-green-600 text-lg mt-4">
                                                ✅ Keine Buchungen vorhanden.
                                            </p>
                                        )}

                                    </div>
                                    <div className="flex justify-between items-center mt-6">

                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg transition-all"
                                        >
                                            Buchen
                                        </button>
                                        <button
                                           onClick={() => navigate(`/editCarRent/${car._id}`)} 
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg transition-all"
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car._id ?? '')}
                                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg transition-all"
                                        >
                                            Löschen
                                        </button>



                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">Keine Mietwagen verfügbar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarRents;
