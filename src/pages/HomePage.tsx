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
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-10 text-gray-900 text-center">
        Willkommen im Admin-Panel 🚀
      </h1>

      {/* Verwaltungsübersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Box für Angebote */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-xl shadow-2xl flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold mb-4">Angebote verwalten</h2>
          <p className="text-xl">Online gestellte Angebote:</p>
          <p className="text-6xl font-extrabold mb-6">{offerCount}</p>
          <Link
            to="/offers"
            className="bg-white text-blue-700 py-3 px-6 rounded-md hover:bg-blue-100 transition font-semibold text-center"
          >
            Angebote anzeigen
          </Link>
        </div>

        {/* Box für Benutzerverwaltung */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-xl shadow-2xl flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold mb-4">Benutzer verwalten</h2>
          <p className="text-xl">Registrierte Kunden:</p>
          <p className="text-6xl font-extrabold mb-6">{countUsers}</p>
          <Link
            to="/users"
            className="bg-white text-green-700 py-3 px-6 rounded-md hover:bg-green-100 transition font-semibold text-center"
          >
            Benutzer anzeigen
          </Link>
        </div>

        {/* Box für Vermietung */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white p-8 rounded-xl shadow-2xl flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold mb-4">Auto vermieten</h2>
          <p className="text-xl">Fahrzeuge verfügbar:</p>
          <p className="text-6xl font-extrabold mb-6">20</p>
          <Link
            to="/carRent"
            className="bg-white text-orange-700 py-3 px-6 rounded-md hover:bg-orange-100 transition font-semibold text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>

        {/* Box für Fahrzeugverkauf */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-800 p-8 rounded-xl shadow-2xl flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold mb-4">Fahrzeug verkaufen</h2>
          <p className="text-xl">Online gestellte Autos:</p>
          <p className="text-6xl font-extrabold mb-6">{carBuyCount}</p>
          <Link
            to="/carBuy"
            className="bg-white text-yellow-700 py-3 px-6 rounded-md hover:bg-yellow-100 transition font-semibold text-center"
          >
            Fahrzeuge anzeigen
          </Link>
        </div>
      </div>

      {/* Aktivitäten-Log */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Aktuelle Aktivitäten 🕒
        </h2>
        <ul className="space-y-6">
          {latestOffer ? (
            <li className="border-l-4 border-blue-500 pl-6">
              <p>
                <strong>Letztes Angebot: </strong>
                <strong className="text-blue-600">{latestOffer.title} </strong>
                wurde von
                <strong className="text-green-600">
                  {" "}
                  Admin
                </strong>{" "}
                hinzugefügt.
              </p>
              <span className="text-gray-500 text-sm">
                <FormattedDate date={latestOffer.createdAt} />
              </span>
            </li>
          ) : (
            <li>
              <p>Keine neuen Angebote verfügbar.</p>
            </li>
          )}
          <li className="border-l-4 border-green-500 pl-6">
            <p>
              <strong>Letzte Benutzerregistrierung: </strong>
              <strong className="text-green-600">
                {lastUser?.firstName} {lastUser?.lastName}
              </strong>{" "}
              hat sich angemeldet.
            </p>
            {lastUser && (
              <span className="text-gray-500 text-sm">
                <FormattedDate date={lastUser.createdAt} />
              </span>
            )}
          </li>

          <li className="border-l-4 border-yellow-500 pl-6">
            <p>
              <strong>Letztes Auto zum Verkauf: </strong>
              <strong className="text-yellow-600">
                {lastCarBuy?.carTitle}
              </strong>{" "}
              mit Kraftstoffart{" "}
              <strong className="text-yellow-600">{lastCarBuy?.fuelType}</strong>{" "}
              wurde hinzugefügt.
            </p>
            {lastCarBuy && (
              <span className="text-gray-500 text-sm">
                <FormattedDate date={lastCarBuy.createdAt} />
              </span>
            )}
          </li>
        </ul>
      </div>

      {/* Benachrichtigungen */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Benachrichtigungen 🔔</h2>
        <p className="text-gray-700">Keine neuen Benachrichtigungen.</p>
      </div>
    </div>

  );
};

export default HomePage;