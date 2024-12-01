import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../feuture/store";
import { useEffect } from "react";
import { socket } from "../service";
import {
  displayOffers,
  offerCreated,
  offerDeleted,
  offerUpdated
} from "../feuture/reducers/offerSlice";

const OfferList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector(displayOffers);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ WebSocket verbunden mit ID:", socket.id);
    });
    socket.on("offerCreated", (newOffer) => {
      console.log("📩 Neues Angebot erstellt:", newOffer);
      dispatch(offerCreated(newOffer));
    });

    socket.on("offerUpdated", (updatedOffer) => {
      console.log("✏️ Angebot aktualisiert:", updatedOffer);
      dispatch(offerUpdated({ id: updatedOffer._id, changes: updatedOffer }));
    });

    socket.on("offerDeleted", (deletedOfferId) => {
      console.log("🗑️ Angebot gelöscht mit ID:", deletedOfferId);
      dispatch(offerDeleted(deletedOfferId));
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket-Verbindung getrennt.");
    });
    return () => {
      socket.off("offerCreated");
      socket.off("offerUpdated");
      socket.off("offerDeleted");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Angebote verwalten</h1>
      <p className="text-gray-600 mb-4">Hier sind alle Angebote aufgelistet. Sie können neue Angebote erstellen oder vorhandene löschen.</p>
      
      {/* Create Offer Form UI */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Neues Angebot erstellen</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            className="border border-gray-300 p-2 rounded"
            type="text"
            placeholder="Titel"
            name="title"
          />
          <input
            className="border border-gray-300 p-2 rounded"
            type="text"
            placeholder="Beschreibung"
            name="description"
          />
          <input
            className="border border-gray-300 p-2 rounded"
            type="text"
            placeholder="Bild URL"
            name="imageUrl"
          />
          <input
            className="border border-gray-300 p-2 rounded"
            type="number"
            placeholder="Alter Preis (€)"
            name="oldPrice"
          />
          <input
            className="border border-gray-300 p-2 rounded"
            type="number"
            placeholder="Neuer Preis (€)"
            name="newPrice"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Angebot erstellen
          </button>
        </form>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h2>
              <img
                className="w-full h-40 object-cover rounded-md mb-4"
                src={offer.imageUrl}
                alt={offer.title}
              />
              <p className="text-gray-600 mb-2">{offer.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 line-through">{offer.oldPrice} €</p>
                  <p className="text-red-500 font-semibold">{offer.newPrice} €</p>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-all mr-2">
                  Bearbeiten
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-all">
                  Löschen
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-3 text-center">Keine Angebote verfügbar.</p>
        )}
      </div>
    </div>
  );
};

export default OfferList;
