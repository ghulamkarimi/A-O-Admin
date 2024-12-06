import { useSelector } from "react-redux";
import { displayCarBuys } from "../feuture/reducers/carBuySlice";

const CarBuy = () => {
  const carBuys = useSelector(displayCarBuys);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Fahrzeugeverwaltung</h1>
      <p className="mb-6 text-lg text-gray-600">Hier sind alle Fahrzeuge aufgelistet.</p>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Nummer
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Titel
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Kategorie
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Bild
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Preis
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 uppercase">
                Kilometerstand
              </th>
            </tr>
          </thead>
          <tbody>
            {carBuys.map((car, index) => (
              <tr
                key={car._id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {car.carTitle}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {car.carCategory}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <img
                    className="w-12 h-12 rounded-lg object-cover"
                    src={car.carImages[0]}
                    alt={car.carTitle}
                  />
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(Number(car.carPrice))}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {car.carMotor} km
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarBuy;
