import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../feuture/store";
import { displayRentById, updateCarRentApi } from "../feuture/reducers/rentSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationService } from "../service/NotificationService";
import { useState } from "react";

const CarRentManagement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userId = localStorage.getItem("userId") || "";
    const car = useSelector((state: RootState) => id ? displayRentById(state, id) : null);
    
    const [imagePreview, setImagePreview] = useState<string | null>(car?.carImage || null);

    const validationSchema = Yup.object().shape({
        carName: Yup.string().required("Autoname ist erforderlich"),
        carPrice: Yup.number().required("Preis ist erforderlich").min(1, "Der Preis muss positiv sein"),
        carPeople: Yup.number().required("Personenanzahl ist erforderlich").min(1, "Mindestens 1 Person"),
        carDoors: Yup.number().required("Türenanzahl ist erforderlich").min(1, "Mindestens 1 Tür"),
        carGear: Yup.string().required("Getriebe ist erforderlich"),
        carAC: Yup.boolean().required("Klimaanlage ist erforderlich"),
        carImage: Yup.mixed().nullable(),
    });

    const formik = useFormik({
        initialValues: {
            carName: car?.carName || "",
            carPrice: car?.carPrice || "",
            carPeople: car?.carPeople || "",
            carDoors: car?.carDoors || "",
            carGear: car?.carGear || "",
            carAC: car?.carAC || false,
            carImage: null,
            userId: userId,
            carId: car?._id || "",
        },
        enableReinitialize: true,  // Damit werden die Felder neu geladen, wenn sich das `car`-Objekt ändert
        validationSchema,
        onSubmit: async (values) => {
            if (!userId) {
                NotificationService.error("Benutzer nicht angemeldet.");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("carId", car?._id || "");  // Auto ID
                formData.append("userId", userId);  // Admin-Check
                formData.append("carName", values.carName);
                formData.append("carPrice", values.carPrice.toString());
                formData.append("carPeople", values.carPeople.toString());
                formData.append("carDoors", values.carDoors.toString());
                formData.append("carGear", values.carGear);
                formData.append("carAC", values.carAC.toString());

                if (values.carImage) {
                    formData.append("carImage", values.carImage);

                    formData.forEach((value, key) => {
                        console.log(`${key}: ${value}`);
                    });

                }

                const response = await dispatch(updateCarRentApi({ rent: { ...car, ...values, carImage: values.carImage || car?.carImage }, imageFile: values.carImage || undefined })).unwrap();
                console.log(response);
                NotificationService.success(response.message || "Auto erfolgreich aktualisiert!");
                navigate("/rent");  // Zurück zur Übersicht
            } catch (error: any) {
                NotificationService.error(error || "Fehler beim Aktualisieren des Autos.");
            }
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            formik.setFieldValue("carImage", file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {car ? "🚗 Auto bearbeiten" : "🚗 Auto nicht gefunden"}
            </h1>
            {car ? (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium">Autoname</label>
                        <input
                            type="text"
                            name="carName"
                            value={formik.values.carName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        />
                        {formik.touched.carName && formik.errors.carName && (
                            <p className="text-red-500">{formik.errors.carName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Preis pro Tag</label>
                        <input
                            type="number"
                            name="carPrice"
                            value={formik.values.carPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        />
                        {formik.touched.carPrice && formik.errors.carPrice && (
                            <p className="text-red-500">{formik.errors.carPrice}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Personenanzahl</label>
                        <input
                            type="number"
                            name="carPeople"
                            value={formik.values.carPeople}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        />
                        {formik.touched.carPeople && formik.errors.carPeople && (
                            <p className="text-red-500">{formik.errors.carPeople}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Türenanzahl</label>
                        <input
                            type="number"
                            name="carDoors"
                            value={formik.values.carDoors}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        />
                        {formik.touched.carDoors && formik.errors.carDoors && (
                            <p className="text-red-500">{formik.errors.carDoors}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Getriebe</label>
                        <input
                            type="text"
                            name="carGear"
                            value={formik.values.carGear}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        />
                        {formik.touched.carGear && formik.errors.carGear && (
                            <p className="text-red-500">{formik.errors.carGear}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Klimaanlage</label>
                        <select
                            name="carAC"
                            value={formik.values.carAC.toString()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="true">Ja</option>
                            <option value="false">Nein</option>
                        </select>
                        {formik.touched.carAC && formik.errors.carAC && (
                            <p className="text-red-500">{formik.errors.carAC}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-lg font-medium">Autobild</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border rounded-lg"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Vorschau"
                                className="mt-4 rounded-lg shadow-md"
                                width={200}
                            />
                        )}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                        >
                            Aktualisieren
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-center text-red-500">Das Fahrzeug wurde nicht gefunden.</p>
            )}
        </div>
    );
};

export default CarRentManagement;
