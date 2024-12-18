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
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Neues Angebot erstellen</h2>
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
                            resetForm(); // Formular zurücksetzen nach dem Erstellen
                        } catch (error: any) {
                            NotificationService.error(error.message || "Fehler beim Erstellen des Angebots.");
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
                            {editingOfferId === offer._id ? (
                                <form
                                    encType="multipart/form-data"
                                    onSubmit={() => {
                                        setIsSubmitting(true);
                                        handleEditOffer(offer._id).finally(() => setIsSubmitting(false));
                                        handleEditOffer(offer._id);
                                    }}
                                    className="space-y-4"
                                >
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={editValues.title}
                                        onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full border p-2 rounded"
                                        value={editValues.description}
                                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded"
                                        value={editValues.oldPrice}
                                        onChange={(e) => setEditValues({ ...editValues, oldPrice: Number(e.target.value) })}
                                    />
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded"
                                        value={editValues.newPrice}
                                        onChange={(e) => setEditValues({ ...editValues, newPrice: Number(e.target.value) })}
                                    />
                                    <input
                                        type="file"
                                        className="w-full border p-2 rounded"
                                        onChange={(e) => {
                                            if (e.currentTarget.files) {
                                                setEditValues({
                                                    ...editValues,
                                                    imageUrl: e.currentTarget.files[0],
                                                });
                                            }
                                        }}
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                            onClick={cancelEditing}
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Erstelle..." : "Angebot erstellen"}
                                        </button>

                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h2>
                                        <span className="text-red-500 font-bold">ab{' '}
                                            {new Date(offer.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <img
                                        className="w-full h-60 object-cover rounded-md mb-4"
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                    />
                                    <p className="text-gray-600 mb-2">{offer.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 line-through">{offer.oldPrice} €</p>
                                            <p className="text-red-500 font-semibold">{offer.newPrice} €</p>
                                        </div>
                                        <button
                                            onClick={() => startEditing(offer)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-all mr-2"
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOffer(offer._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-all"
                                        >
                                            Löschen
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        Keine Angebote verfügbar.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfferList;
