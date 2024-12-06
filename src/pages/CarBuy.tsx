import { useSelector } from "react-redux";
import { displayCarBuys } from "../feuture/reducers/carBuySlice";
import FormattedDate from "../components/FormatesDate";
import { useState } from "react";

const CarBuy = () => {
  const carBuys = useSelector(displayCarBuys);
  const [searchTerm, setSearchTerm] = useState("");

  // Filterfunktion
  const filteredCars = carBuys.filter((car) => {
    const formattedPrice = car.carPrice.toString();
    const formattedDate = new Date(car.carFirstRegistrationDay)
      .toLocaleDateString("de-DE")
      .toLowerCase();

    return (
      car.carTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formattedPrice.includes(searchTerm) ||
      formattedDate.includes(searchTerm) || 
      car.carIdentificationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Fahrzeugeverwaltung</h1>
      <p className="mb-6 text-lg text-gray-600">Hier sind alle Fahrzeuge aufgelistet.</p>

      {/* Suchfeld */}
      <div className="mb-6">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Suchen nach KFZ-ID Titel, Preis oder Erstzulassung"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Fahrzeugtabelle */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-2 border-b border-gray-300 text-sm text-gray-700 text-center w-12">
                #
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                Titel
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                KFZ-ID 
              </th>
            
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left hidden lg:table-cell ">
                Bild
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                Preis
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left hidden lg:table-cell">
                ErstZ
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                KMstand
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.length > 0 ? (
              filteredCars.map((car, index) => (
                <tr
                  key={car._id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-2 border-b border-gray-300 text-sm text-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                    {car.carTitle}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                    {car?.carIdentificationNumber}
                  </td>
               
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 hidden lg:table-cell ">
                    <img
                      className="w-14 h-14 rounded-sm object-cover"
                      src={car.carImages[0]}
                      alt={car.carTitle}
                    />
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Number(car.carPrice))}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 hidden lg:table-cell">
                    <FormattedDate date={car?.carFirstRegistrationDay} />
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                    {car.carKilometers} km
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-4 text-center text-gray-500 text-sm"
                >
                  Keine Fahrzeuge gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarBuy;
