import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../feuture/store";
import { useEffect } from "react";
import { socket } from "../service";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  displayOffers,
  offerCreated,
  offerDeleted,
  offerUpdated,
  createOffer,
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

  // Formik Validierungsschema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Titel ist erforderlich"),
    description: Yup.string().required("Beschreibung ist erforderlich"),
    imageUrl: Yup.mixed()
      .required("Bild ist erforderlich")
      .test(
        "fileSize",
        "Die Datei ist zu groß",
        (value) => !value || (value && (value as File).size <= 5 * 1024 * 1024) // 2MB Limit
      )
      .test(
        "fileType",
        "Nur Bilddateien erlaubt",
        (value) =>
          !value ||
          (value && ["image/jpeg", "image/png", "image/jpg"].includes((value as File).type))
      ),
    oldPrice: Yup.number().required("Alter Preis ist erforderlich"),
    newPrice: Yup.number().required("Neuer Preis ist erforderlich"),
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Angebote verwalten</h1>
      <p className="text-gray-600 mb-4">
        Hier sind alle Angebote aufgelistet. Sie können neue Angebote erstellen oder vorhandene löschen.
      </p>

      {/* Create Offer Form UI mit Formik */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Neues Angebot erstellen</h2>
        <Formik
          initialValues={{
            title: "",
            description: "",
            imageUrl: null,
            oldPrice: "",
            newPrice: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.imageUrl) {
              formData.append("offerImage", values.imageUrl);
            }
            formData.append("oldPrice", values.oldPrice.toString());
            formData.append("newPrice", values.newPrice.toString());

            dispatch(createOffer(formData));
            resetForm(); // Formular zurücksetzen nach dem Erstellen
          }}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="text"
                  placeholder="Titel"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm">{errors.title}</div>
                )}
              </div>
              <div>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="text"
                  placeholder="Beschreibung"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm">{errors.description}</div>
                )}
              </div>
              <div>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="file"
                  name="imageUrl"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      setFieldValue("imageUrl", event.currentTarget.files[0]);
                    }
                  }}
                  onBlur={handleBlur}
                />
                {errors.imageUrl && touched.imageUrl && (
                  <div className="text-red-500 text-sm">{errors.imageUrl}</div>
                )}
              </div>
              <div>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="number"
                  placeholder="Alter Preis (€)"
                  name="oldPrice"
                  value={values.oldPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.oldPrice && touched.oldPrice && (
                  <div className="text-red-500 text-sm">{errors.oldPrice}</div>
                )}
              </div>
              <div>
                <input
                  className="border border-gray-300 p-2 rounded w-full"
                  type="number"
                  placeholder="Neuer Preis (€)"
                  name="newPrice"
                  value={values.newPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.newPrice && touched.newPrice && (
                  <div className="text-red-500 text-sm">{errors.newPrice}</div>
                )}
              </div>
              <div className="col-span-3">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Erstelle..." : "Angebot erstellen"}
                </button>
              </div>
            </form>
          )}
        </Formik>
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
