import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  displayCarBuys,
} from "../feuture/reducers/carBuySlice";
import { AppDispatch } from "../feuture/store/index";
import { ICarBuy, TBuy } from "../interface";

const CarDetails: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const cars = useSelector(displayCarBuys);
  const carDetails: ICarBuy | undefined = cars.find((c) => c._id === carId);

  const [formData, setFormData] = useState<TBuy>({
    carTitle: "",
    carCategory: "",
    carPrice: "",
    owner: "",
    isSold: false,
    carFirstRegistrationDay: "",
    carImages: [],
    carDescription: "",
    carKilometers: "",
    carColor: "",
    carAirConditioning: false,
    carSeat: "",
    damagedCar: false,
    carNavigation: false,
    carParkAssist: false,
    carAccidentFree: false,
    carGearbox: "",
    carMotor: "",
    carHorsePower: "",
    carEuroNorm: "",
    fuelType: "",
    carTechnicalInspection: new Date(),
    userId: "",
    createdAt: "",
    carIdentificationNumber: "",
  });

  // Daten aus dem ausgewählten Fahrzeug laden
  useEffect(() => {
    if (carDetails) {
      setFormData({
        carTitle: carDetails.carTitle,
        carCategory: carDetails.carCategory,
        carPrice: carDetails.carPrice,
        owner: carDetails.owner,
        isSold: carDetails.isSold,
        carFirstRegistrationDay: carDetails.carFirstRegistrationDay,
        carImages: carDetails.carImages,
        carDescription: carDetails.carDescription,
        carKilometers: carDetails.carKilometers,
        carColor: carDetails.carColor,
        carAirConditioning: carDetails.carAirConditioning,
        carSeat: carDetails.carSeat,
        damagedCar: carDetails.damagedCar,
        carNavigation: carDetails.carNavigation,
        carParkAssist: carDetails.carParkAssist,
        carAccidentFree: carDetails.carAccidentFree,
        carGearbox: carDetails.carGearbox,
        carMotor: carDetails.carMotor,
        carHorsePower: carDetails.carHorsePower,
        carEuroNorm: carDetails.carEuroNorm,
        fuelType: carDetails.fuelType,
        carTechnicalInspection: carDetails.carTechnicalInspection,
        userId: carDetails.userId,
        createdAt: carDetails.createdAt,
        carIdentificationNumber: carDetails.carIdentificationNumber,
      });
    }
  }, [carDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : undefined;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleCreate = () => {
    alert("Fahrzeug erfolgreich erstellt!");
  };

  const handleUpdate = () => {

      alert("Fahrzeug erfolgreich aktualisiert!");
    }
  

  const handleDelete = () => {

      alert("Fahrzeug erfolgreich gelöscht!");
    }
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Fahrzeugverwaltung</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fahrzeugdetails */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-bold mb-2">Fahrzeugdaten</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="carTitle"
         
              placeholder="Titel des Fahrzeugs"
              className="p-2 border rounded-md"
            />
            <select
              name="carCategory"
         
              className="p-2 border rounded-md"
            >
              <option value="">Kategorie wählen</option>
              <option value="PKW">PKW</option>
              <option value="Transporter">Transporter</option>
              <option value="Wohnwagen">Wohnwagen</option>
            </select>
            <input
              type="text"
              name="carPrice"
           
              placeholder="Preis"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="owner"
          
              placeholder="Besitzer"
              className="p-2 border rounded-md"
            />
            <textarea
              name="carDescription"
           
              placeholder="Beschreibung"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="carKilometers"
   
              placeholder="Kilometerstand"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="carColor"
            
              placeholder="Farbe"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="fuelType"
              placeholder="Kraftstofftyp"
              className="p-2 border rounded-md"
            />
          </form>
        </div>

        {/* Aktionen */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-bold mb-2">Aktionen</h2>
          <div className="flex flex-col gap-4">
            <button
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              onClick={handleCreate}
            >
              Fahrzeug erstellen
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              onClick={handleUpdate}
            >
              Fahrzeug aktualisieren
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
              onClick={handleDelete}
            >
              Fahrzeug löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
