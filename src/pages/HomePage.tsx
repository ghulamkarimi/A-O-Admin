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
  const carBuy = useSelector((state: RootState) => state.carBuys.entities);
  const carBuyCount = carBuy ? Object.keys(carBuy).length : 0;
  const lastCarBuy = carBuy ? Object.values(carBuy).slice(-1)[0] : null;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Willkommen im Admin-Panel</h1>

      {/* Verwaltungsübersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Box für Angebote */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4">Angebote verwalten</h2>
          <p className="text-lg">Online gestellte Angebote:</p>
          <p className="text-4xl font-bold mb-4">{offerCount}</p>
          <Link
            to="/offers"
            className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 transition text-center"
          >
            Angebote anzeigen
          </Link>
        </div>

        {/* Box für Benutzerverwaltung */}
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4">Benutzer verwalten</h2>
          <p className="text-lg">Registrierte Kunden:</p>
          <p className="text-4xl font-bold mb-4">{countUsers}</p>
          <Link
            to="/users"
            className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-900 transition text-center"
          >
            Benutzer anzeigen
          </Link>
        </div>

        {/* Box für vermieten */}
        <div className="bg-orange-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4">Auto vermieten</h2>
          <p className="text-lg">Fahrzeuge verfügbar:</p>
          <p className="text-4xl font-bold mb-4">20</p>
          <Link
            to="/carRent"
            className="bg-orange-800 text-white py-2 px-4 rounded hover:bg-orange-900 transition text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>

        {/* Box für Fahrzeugverwaltung */}
        <div className="bg-yellow-500 text-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4">Fahrzeug verkaufen</h2>
          <p className="text-lg">Online gestellte Autos:</p>
          <p className="text-4xl font-bold mb-4">{carBuyCount}</p>
          <Link
            to="/carBuy"
            className="bg-yellow-600 text-gray-800 py-2 px-4 rounded hover:bg-yellow-700 transition text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>
      </div>

      {/* Aktivitäten-Log */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Aktuelle Aktivitäten</h2>
        <ul className="space-y-4">
          {latestOffer ? (
            <li className="border-b pb-4">
              <p>
                <strong>Letztes Angebot: </strong>
                <strong className="text-blue-600">{latestOffer.title}{" "}</strong>
                wurde von
                <strong className="text-green-600"> {user?.firstName} {user?.lastName}</strong>
                hinzugefügt.
              </p>
              <span className="text-gray-500 text-sm">
                <FormattedDate date={latestOffer.createdAt} />
              </span>
            </li>
          ) : (
            <li className="border-b pb-4">
              <p>Keine neuen Angebote verfügbar.</p>
            </li>
          )}
          <li className="border-b pb-4">
            <p>
              <strong>Letzte Benutzerregistrierung: </strong>
              <strong className="text-green-600">{lastUser?.firstName} {lastUser?.lastName}</strong>
              {" "} hat sich angemeldet.
            </p>
            {lastUser && (
              <span className="text-gray-500 text-sm">
                <FormattedDate date={lastUser.createdAt} />
              </span>
            )}
          </li>

          <li className="border-b pb-4">
            <p>
              <strong>Letztes Auto zum Verkauf: </strong>
              <strong className="text-yellow-600">{lastCarBuy?.carTitle}</strong>
              {" "} mit Kraftstoffart{" "} <strong className="text-yellow-600">{lastCarBuy?.fuelType}</strong> wurde hinzugefügt.
            </p>
            {lastCarBuy && (
              <span className="text-gray-500 text-sm">
                <FormattedDate date={lastCarBuy.createdAt} />
              </span>
            )}
          </li>

          <li className="border-b pb-4">
            <p>
              <strong>Fahrzeug vermietet:</strong> Audi A6 wurde an "Anna Schmidt" vermietet.
            </p>
            <span className="text-sm text-gray-500">Vor 3 Tagen</span>
          </li>
        </ul>
      </div>

      {/* Benachrichtigungen */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Benachrichtigungen</h2>
        <p className="text-gray-700">Keine neuen Benachrichtigungen.</p>
      </div>
    </div>
  );
};

export default HomePage;