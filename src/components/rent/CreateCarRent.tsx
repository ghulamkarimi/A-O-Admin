import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { createCarRentApi } from "../../feuture/reducers/rentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../feuture/store";
import { NotificationService } from "../../service/NotificationService";

const CreateCarRent = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const userId = localStorage.getItem("userId") || "";
    const validationSchema = Yup.object().shape({
        carName: Yup.string().required("Bitte wählen Sie ein Auto aus"),
        carPrice: Yup.number().required("Bitte geben Sie den Preis ein"),
        carPeople: Yup.number().required("Bitte geben Sie die Anzahl der Personen ein"),
        carDoors: Yup.number().required("Bitte geben Sie die Anzahl der Türen ein"),
        carGear: Yup.string().required("Bitte geben Sie das Getriebe ein"),
        carAC: Yup.boolean().required("Bitte geben Sie an, ob das Auto eine Klimaanlage hat"),
        carImage: Yup.mixed()
    .required("Bitte geben Sie ein Bild ein")
    .test("fileType", "Nur JPEG, PNG oder JPG Bilder sind erlaubt", (value) => {
        return value instanceof File && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    })
    .test("fileSize", "Die Bilddatei ist zu groß. Maximale Größe: 5 MB.", (value) => {
        return value instanceof File && value.size <= 5 * 1024 * 1024;
    }),

    });

    const formik = useFormik({
        initialValues: {
            carName: "",
            carPrice: "",
            carPeople: "",
            carDoors: "",
            carGear: "",
            carAC: false,
            carImage: null,
            userId: userId,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("carName", values.carName);
                formData.append("carPrice", values.carPrice);
                formData.append("carPeople", values.carPeople);
                formData.append("carDoors", values.carDoors);
                formData.append("carGear", values.carGear);
                formData.append("carAC", values.carAC.toString());
                if (values.carImage) {
                    formData.append("carImage", values.carImage);
                }
                if (values.userId) {
                    formData.append("userId", values.userId);
                }
                const response = await dispatch(createCarRentApi(formData)).unwrap();
                console.log("response:",response);
                NotificationService.success(response.message || "Auto erfolgreich hinzugefügt");
                formik.resetForm();
                setImagePreview(null);
            } catch (error: any) {
                NotificationService.error(error.message);

            }
        },
    });
 
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 5 * 1024 * 1024; // 5 MB
    
        if (file) {
            // Überprüfung auf Dateityp
            if (!allowedTypes.includes(file.type)) {
                NotificationService.error("Nur JPEG, PNG oder JPG Bilder sind erlaubt.");
                return;
            }
    
            // Überprüfung auf Dateigröße
            if (file.size > maxSize) {
                NotificationService.error("Die Bilddatei ist zu groß. Maximale Größe: 5 MB.");
                return;
            }
    
            // Datei akzeptiert: Setze das Bild in Formik
            formik.setFieldValue("carImage", file);
            formik.setTouched({ carImage: true });  // Manuelles Triggern der Validierung
    
            // Bildvorschau anzeigen
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    console.log(formik.values);

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🚗 Auto zur Vermietung hinzufügen</h1>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Auto Name */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Autoname
                    </label>
                    <input
                        type="text"
                        name="carName"
                        value={formik.values.carName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.carName && formik.errors.carName && (
                        <p className="text-red-500">{formik.errors.carName}</p>
                    )}
                </div>

                {/* Preis */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Preis pro Tag (€)
                    </label>
                    <input
                        type="number"
                        name="carPrice"
                        value={formik.values.carPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.carPrice && formik.errors.carPrice && (
                        <p className="text-red-500">{formik.errors.carPrice}</p>
                    )}
                </div>

                {/* Anzahl Personen */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Anzahl der Personen
                    </label>
                    <input
                        type="number"
                        name="carPeople"
                        value={formik.values.carPeople}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.carPeople && formik.errors.carPeople && (
                        <p className="text-red-500">{formik.errors.carPeople}</p>
                    )}
                </div>

                {/* Türen */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Anzahl der Türen
                    </label>
                    <input
                        type="number"
                        name="carDoors"
                        value={formik.values.carDoors}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formik.touched.carDoors && formik.errors.carDoors && (
                        <p className="text-red-500">{formik.errors.carDoors}</p>
                    )}
                </div>

                {/* Getriebe */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Getriebe
                    </label>
                    <select
                        name="carGear"
                        value={formik.values.carGear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Bitte auswählen</option>
                        <option value="automatic">Automatik</option>
                        <option value="manual">Manuell</option>
                    </select>
                    {formik.touched.carGear && formik.errors.carGear && (
                        <p className="text-red-500">{formik.errors.carGear}</p>
                    )}
                </div>

                {/* Klimaanlage */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="carAC"
                        checked={formik.values.carAC}
                        onChange={formik.handleChange}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-3 block text-lg text-gray-700">
                        Klimaanlage vorhanden
                    </label>
                </div>

                {/* Bild Upload */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">
                        Autodbild hochladen
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border rounded-lg"
                    />
                    {formik.touched.carImage && formik.errors.carImage && (
                        <p className="text-red-500">{formik.errors.carImage}</p>
                    )}

                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-4 rounded-lg shadow-md"
                            width={200}
                        />
                    )}
                </div>

                {/* Absenden Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Auto hinzufügen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCarRent;
