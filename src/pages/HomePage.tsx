import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormattedDate from "../components/FormatesDate";
import { displayUserById, displayUsers } from "../feuture/reducers/userSlice";
import { RootState } from '../feuture/store/index';

const HomePage = () => {
  const offers = useSelector((state: RootState) => state.offer.entities);
  const offerCount = offers ? Object.keys(offers).length : 0;
  const userId = localStorage.getItem("userId");
  const user = useSelector((state: RootState) => userId ? displayUserById(state, userId) : null);
  const latestOffer = offers ? Object.values(offers).slice(-1)[0] : null;
  const users = useSelector(displayUsers);
  const countUsers = users ? Object.keys(users).length : 0;
  const lastUser = users ? Object.values(users).slice(-1)[0] : null;
  const carBuy= useSelector((state: RootState) => state.carBuys.entities);
  const carBuyCount = carBuy ? Object.keys(carBuy).length : 0;
  const lastCarBuy = carBuy ? Object.values(carBuy).slice(-1)[0] : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Willkommen zum Admin Panel</h1>

      {/* Verwaltungsübersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Box für Angebote */}
        <div className="bg-blue-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Angebote verwalten</h2>
          <div className="flex items-center gap-1">
            <span>online gestellte Abgebote:</span>
            <p className="text-2xl font-bold">{offerCount}</p>
            </div>
          <Link
            to="/offers"
            className="bg-blue-600 text-white mt-4 py-2 px-2 rounded hover:bg-blue-700 transition text-center"
          >
            Angebote anzeigen
          </Link>
        </div>

        {/* Box für Benutzerverwaltung */}
        <div className="bg-green-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Benutzer verwalten</h2>
          <div className="flex items-center gap-1">
            <span>registerierte Kunden:</span>
            <p className="text-2xl font-bold">{countUsers}</p>
            </div>
          <Link
            to="/users"
            className="bg-green-600 text-white mt-4 py-2 px-4 rounded hover:bg-green-700 transition text-center"
          >
            Benutzer anzeigen
          </Link>
        </div>

        {/* Box für vermieten */}
        <div className="bg-orange-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Auto vermieten</h2>
          <p className="text-3xl font-bold">20</p>
          <Link
            to="/carRent"
            className="bg-orange-600 text-white mt-4 py-2 px-4 rounded hover:bg-orange-700 transition text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>

        {/* Box für Fahrzeugverwaltung */}
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Fahrzeug verkaufen</h2>
          <div className="flex items-center gap-1">
            <span>online gestellte Autos :</span>
            <p className="text-2xl font-bold">{carBuyCount}</p>
            </div>
          <Link
            to="/carBuy"
            className="bg-orange-600 text-white mt-4 py-2 px-4 rounded hover:bg-orange-700 transition text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>
      </div>

      {/* Aktivitäten-Log */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Aktuelle Aktivitäten</h2>
        <ul className="space-y-4">
          {latestOffer ? (
            <li className="border-b pb-2">
              <p>
                <strong>Letztes Angebot: </strong>
                <strong className="text-red-500">{latestOffer.title}{" "}</strong>
                wurde von
                <strong className="text-red-500">{" "}{user?.firstName}{" "}{user?.lastName}{" "}</strong>
                hinzugefügt.
              </p>
              <strong className="text-green-600"><FormattedDate date={latestOffer.createdAt} /></strong>
            </li>
          ) : (
            <li className="border-b pb-2">
              <p>Keine neuen Angebote verfügbar.</p>
            </li>
          )}
          <li className="border-b pb-2">
            <p>
              <strong>Letzte Benutzerregistrierung:</strong> Ein Benutzer{" "}
              <strong className="text-red-500">{lastUser?.firstName}</strong>
              {" "}
              <strong className="text-red-500">{lastUser?.lastName}</strong>
              {" "}
              hat sich angemeldet.
            </p>
            {lastUser && <strong className="text-green-600"><FormattedDate date={lastUser.createdAt} /></strong>}
          </li>


          <li className="border-b pb-2">
            <p>
              <strong>Letzte Auto zum verkaufen:</strong> Ein Auto{" "}
              <strong className="text-red-500">{lastCarBuy?.carTitle}</strong>
              {" "}
              <strong className="text-red-500">{lastCarBuy?.fuelType}</strong>
              {" "}
              wurde hinzugefügt.
            </p>
            {lastCarBuy && <strong className="text-green-600"><FormattedDate date={lastCarBuy.createdAt} /></strong>}
          </li>


          <li className="border-b pb-2">
            <p>
              <strong>Fahrzeug vermietet:</strong> Audi A6 wurde an "Anna Schmidt" vermietet.
            </p>
            <span className="text-sm text-gray-600">Vor 3 Tagen</span>
          </li>
        </ul>
      </div>

      {/* Benachrichtigungen */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Benachrichtigungen</h2>
        <p className="text-gray-700">Keine neuen Benachrichtigungen.</p>
      </div>
    </div>
  );
};

export default HomePage;
