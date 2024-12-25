import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../feuture/store";
import { Formik } from "formik";
import * as Yup from "yup";
import {
    displayOffers,
    offerCreated,
    offerDeleted,
    offerUpdated,
    createOffer,
    deleteOfferApi,
    editOfferApi,
    socket,
} from "../feuture/reducers/offerSlice";
import { NotificationService } from "../service/NotificationService";
import { IOffer } from "../interface";

const OfferList = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const offers = useSelector(displayOffers);
    const userId = localStorage.getItem("userId") || "";
    useEffect(() => {
        console.log("Offers:", offers); // Debugging
    }, [offers]);


    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{
        title: string;
        description: string;
        oldPrice: number;
        userId: string;
        offerId: string;
        newPrice: number;
        imageUrl: File | null;
    }>({
        title: "",
        description: "",
        oldPrice: 0,
        newPrice: 0,
        userId: "",
        offerId: "",
        imageUrl: null,
    });

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

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Titel ist erforderlich"),
        description: Yup.string().required("Beschreibung ist erforderlich"),
        imageUrl: Yup.mixed()
            .test(
                "fileSize",
                "Die Datei ist zu groß",
                (value) => !value || (value && (value as File).size <= 10 * 1024 * 1024) // 5MB Limit
            )
            .test(
                "fileType",
                "Nur Bilddateien erlaubt",
                (value) =>
                    !value ||
                    (value && ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes((value as File).type))
            ),
        oldPrice: Yup.number().required("Alter Preis ist erforderlich"),
        newPrice: Yup.number().required("Neuer Preis ist erforderlich"),
    });

    const handleDeleteOffer = async (offerId: string) => {
        try {
            const response = await dispatch(deleteOfferApi({ userId, offerId })).unwrap();
            NotificationService.success(response.message || "Angebot gelöscht!");
        } catch (error: any) {
            NotificationService.error(error.message || "Fehler beim Löschen des Angebots.");
        }
    };

    const startEditing = (offer: IOffer) => {
        console.log("Start Editing Offer:", offer); // Debugging
        setEditingOfferId(offer._id);
        setEditValues({
            title: offer.title,
            offerId: offer._id, // Angebot-ID korrekt setzen
            userId: offer.userId, // Benutzer-ID korrekt setzen
            description: offer.description,
            oldPrice: offer.oldPrice,
            newPrice: offer.newPrice,
            imageUrl: null,
        });
        console.log("Edit Values after Start Editing:", {
            title: offer.title,
            offerId: offer._id,
            userId: offer.userId,
            description: offer.description,
            oldPrice: offer.oldPrice,
            newPrice: offer.newPrice,
        });
    };

    const handleEditOffer = async (offerId: string) => {
        console.log("Editing offer with ID:", offerId);
        console.log("Edit Values Before API Call:", editValues);

        try {
            if (!userId) {
                throw new Error("Benutzer-ID fehlt.");
            }

            if (!offerId) {
                throw new Error("Angebots-ID fehlt.");
            }

            const formData = new FormData();
            formData.append("title", editValues.title);
            formData.append("description", editValues.description);
            formData.append("oldPrice", editValues.oldPrice.toString());
            formData.append("newPrice", editValues.newPrice.toString());
            formData.append("userId", editValues.userId); // Sicherstellen, dass userId gesetzt ist
            formData.append("offerId", editValues.offerId); // Sicherstellen, dass offerId gesetzt ist

            if (editValues.imageUrl) {
                formData.append("offerImage", editValues.imageUrl); // Feldname muss "offerImage" sein
            }
            console.log("Image File:", editValues.imageUrl);


            const response = await dispatch(editOfferApi({
                offer: {
                    _id: offerId,
                    userId: editValues.userId,
                    offerId: editValues.offerId,
                    title: editValues.title,
                    description: editValues.description,
                    oldPrice: editValues.oldPrice, // Konvertiere zu number
                    newPrice: editValues.newPrice, // Konvertiere zu number
                },
                imageFile: editValues.imageUrl || undefined
            })).unwrap();

            NotificationService.success(response.message || "Angebot erfolgreich bearbeitet!");
            console.log("rsponse nach der anfrage zur backend :", response)
            setEditingOfferId(null); // Bearbeitungsmodus verlassen
        } catch (error: any) {
            NotificationService.error(error.message || "Fehler beim Bearbeiten des Angebots.");
            console.log("error beim bearbeiten des angebots", error)
        }
    };

    const cancelEditing = () => {
        setEditingOfferId(null);
        setEditValues({
            title: "",
            description: "",
            oldPrice: 0,
            newPrice: 0,
            userId: "",
            offerId: "",
            imageUrl: null,
        });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Angebote verwalten</h1>
            <p className="text-gray-600 mb-4">
                Hier sind alle Angebote aufgelistet. Sie können neue Angebote erstellen oder vorhandene löschen.
            </p>

            {/* Create Offer Form UI mit Formik */}
            <div className="bg-white p-10 rounded-2xl shadow-lg mb-12 max-w-5xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
                    Neues Angebot erstellen 📦
                </h2>
                <Formik
                    initialValues={{
                        title: "",
                        description: "",
                        imageUrl: null,
                        oldPrice: "",
                        newPrice: "",
                        userId: userId || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        try {
                            const formData = new FormData();
                            formData.append("title", values.title);
                            formData.append("description", values.description);
                            if (values.imageUrl) {
                                formData.append("offerImage", values.imageUrl);
                            }
                            formData.append("oldPrice", values.oldPrice.toString());
                            formData.append("newPrice", values.newPrice.toString());
                            formData.append("userId", values.userId);

                            const response = await dispatch(createOffer(formData)).unwrap();
                            NotificationService.success(response.message || "Angebot erstellt!");
                            resetForm();
                        } catch (error: any) {
                            NotificationService.error(
                                error.message || "Fehler beim Erstellen des Angebots."
                            );
                        }
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
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="col-span-2">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Titel
                                </label>
                                <input
                                    className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-400 transition-all"
                                    type="text"
                                    placeholder="Angebotstitel eingeben"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.title && touched.title && (
                                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                )}
                            </div>

                            <div className="col-span-3">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Beschreibung
                                </label>
                                <textarea
                                    className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-400 transition-all"
                                    placeholder="Beschreibe das Angebot"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={4}
                                />
                                {errors.description && touched.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            <div className="col-span-1">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Bild hochladen
                                </label>
                                <input
                                    className="border border-gray-300 p-4 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    type="file"
                                    name="imageUrl"
                                    onChange={(event) => {
                                        if (event.currentTarget.files) {
                                            setFieldValue("imageUrl", event.currentTarget.files[0]);
                                        }
                                    }}
                                    onBlur={handleBlur}
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Alter Preis (€)
                                </label>
                                <input
                                    className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-400 transition-all"
                                    type="number"
                                    placeholder="Alter Preis"
                                    name="oldPrice"
                                    value={values.oldPrice}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.oldPrice && touched.oldPrice && (
                                    <div className="text-red-500 text-sm mt-1">{errors.oldPrice}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Neuer Preis (€)
                                </label>
                                <input
                                    className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-400 transition-all"
                                    type="number"
                                    placeholder="Neuer Preis"
                                    name="newPrice"
                                    value={values.newPrice}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.newPrice && touched.newPrice && (
                                    <div className="text-red-500 text-sm mt-1">{errors.newPrice}</div>
                                )}
                            </div>

                            <div className="col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <div
                            key={offer._id}
                            className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                        >
                            {editingOfferId === offer._id ? (
                                <form
                                    encType="multipart/form-data"
                                    onSubmit={() => {
                                        setIsSubmitting(true);
                                        handleEditOffer(offer._id).finally(() =>
                                            setIsSubmitting(false)
                                        );
                                    }}
                                    className="space-y-6"
                                >
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={editValues.title}
                                            onChange={(e) =>
                                                setEditValues({ ...editValues, title: e.target.value })
                                            }
                                            placeholder="Titel"
                                        />
                                        <textarea
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={editValues.description}
                                            onChange={(e) =>
                                                setEditValues({
                                                    ...editValues,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Beschreibung"
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="number"
                                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                value={editValues.oldPrice}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        oldPrice: Number(e.target.value),
                                                    })
                                                }
                                                placeholder="Alter Preis (€)"
                                            />
                                            <input
                                                type="number"
                                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                value={editValues.newPrice}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        newPrice: Number(e.target.value),
                                                    })
                                                }
                                                placeholder="Neuer Preis (€)"
                                            />
                                        </div>

                                        <input
                                            type="file"
                                            className="border border-gray-300 p-3 rounded-lg file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => {
                                                if (e.currentTarget.files) {
                                                    setEditValues({
                                                        ...editValues,
                                                        imageUrl: e.currentTarget.files[0],
                                                    });
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all"
                                            onClick={cancelEditing}
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Speichere..." : "Speichern"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800 truncate">
                                            {offer.title}
                                        </h2>
                                        <span className="text-sm font-semibold text-red-500">
                                            ab {new Date(offer.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <img
                                        className="w-full h-60 object-cover rounded-lg mb-6"
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                    />
                                    <p className="text-gray-700 mb-4">{offer.description}</p>

                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-gray-500 line-through text-lg">
                                                {offer.oldPrice} €
                                            </p>
                                            <p className="text-red-500 font-extrabold text-2xl">
                                                {offer.newPrice} €
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => startEditing(offer)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm transition-all"
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition-all"
                                            >
                                                Löschen
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-12">
                        <p className="text-gray-500 text-xl">Keine Angebote verfügbar.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default OfferList;
