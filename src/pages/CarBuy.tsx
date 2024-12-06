import { useSelector } from "react-redux";
import { displayCarBuys } from "../feuture/reducers/carBuySlice";
import FormattedDate from "../components/FormatesDate";

const CarBuy = () => {
  const carBuys = useSelector(displayCarBuys);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Fahrzeugeverwaltung</h1>
      <p className="mb-6 text-lg text-gray-600">Hier sind alle Fahrzeuge aufgelistet.</p>
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
                Kategorie
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left hidden lg:table-cell">
                Bild
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                Preis
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                ErstZ
              </th>
              <th className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 text-left">
                KMstand
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
                <td className="py-3 px-2 border-b border-gray-300 text-sm text-gray-700 text-center">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                  {car.carTitle}
                </td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                  {car.carCategory}
                </td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700 hidden lg:table-cell">
                  <img
                    className="w-14 h-14 rounded-lg object-cover"
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
                <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                  <FormattedDate date={car?.carFirstRegistrationDay} />
                </td>
                <td className="py-3 px-4 border-b border-gray-300 text-sm text-gray-700">
                  {car.carKilometers} km
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
