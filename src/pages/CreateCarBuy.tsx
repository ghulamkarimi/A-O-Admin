import { useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createCarBuyApi } from "../feuture/reducers/carBuySlice";
import { NotificationService } from "../service/NotificationService";
import { useNavigate } from "react-router-dom";
import { ICarBuy } from "../interface";
import { AppDispatch } from "../feuture/store";
import { useRef, useState } from "react";

const CreateCarBuy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const initialValues: Partial<ICarBuy> = {
    carTitle: "",
    carCategory: "",
    carPrice: "",
    owner: "",
    carIdentificationNumber: "",
    carDescription: "",
    carKilometers: "",
    carColor: "",
    fuelType: "",
    carGearbox: "",
    carMotor: "",
    carHorsePower: "",
    carEuroNorm: "",
    carFirstRegistrationDay: new Date().toISOString().split("T")[0],
    carTechnicalInspection: new Date().toISOString().split("T")[0],
    carImages: [] as File[],
    carAirConditioning: false,
    carNavigation: false,
    carParkAssist: false,
    carAccidentFree: true,
    carSeat: "",
    damagedCar: false,
    isSold: false,
    userId: userId || "",
  };

  const validationSchema = Yup.object({
    carTitle: Yup.string().required("Titel ist erforderlich"),
    carCategory: Yup.string().required("Kategorie ist erforderlich"),
    carPrice: Yup.string()
      .typeError("Der Preis muss eine Zahl sein")
      .required("Preis ist erforderlich"),
    owner: Yup.string().required("Besitzer ist erforderlich"),
    carSeat: Yup.string().required("Sitzer ist erforderlich"),
    carDescription: Yup.string().required("Beschreibung ist erforderlich"),
    carKilometers: Yup.string()
      .typeError("Kilometerstand muss eine Zahl sein")
      .required("Kilometerstand ist erforderlich"),
    carColor: Yup.string().required("Farbe ist erforderlich"),
    fuelType: Yup.string().required("Kraftstofftyp ist erforderlich"),
    carGearbox: Yup.string().required("Getriebe ist erforderlich"),
    carMotor: Yup.string().required("Motor ist erforderlich"),
    carHorsePower: Yup.string()
      .typeError("Leistung (PS) muss eine Zahl sein")
      .required("Leistung ist erforderlich"),
    carEuroNorm: Yup.string().required("EURO Norm ist erforderlich"),
    carFirstRegistrationDay: Yup.date()
      .typeError("Bitte geben Sie ein gültiges Datum ein")
      .required("Erstzulassung ist erforderlich"),
    carTechnicalInspection: Yup.date()
      .typeError("Bitte geben Sie ein gültiges Datum ein")
      .required("Technische Inspektion ist erforderlich"),
  });

  const handleSubmit = async (values: Partial<ICarBuy>) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "carImages" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("carImages", file);
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const response: any = await dispatch(createCarBuyApi(formData)).unwrap();
      NotificationService.success(response.message || "Fahrzeug erfolgreich erstellt!");
      navigate("/car-buy");
    } catch (error: any) {
      NotificationService.error(error.message || "Fehler beim Erstellen des Fahrzeugs.");
    }
  };

  const handleImageChange = (files: FileList | null, setFieldValue: any) => {
    if (files) {
      const selectedFiles = Array.from(files);
      setFieldValue("carImages", selectedFiles);
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagesPreview(previews);
    }
  }

  const handleRemoveImage = (index: number, setFieldValue: any) => {
    // Entfernt das Bild aus der Vorschau
    const updatedPreviews = imagesPreview.filter((_, i) => i !== index);

    // Entfernt das Bild auch aus Formik-Daten
    setFieldValue("carImages", (prevImages: File[]) =>
      prevImages.filter((_, i) => i !== index)
    );

    // Aktualisiert die Vorschau
    setImagesPreview(updatedPreviews);


  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Neues Fahrzeug erstellen</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
            {/* Alle Formularfelder */}
            <Field
              type="text"
              name="carTitle"
              placeholder="Titel"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carTitle" component="div" className="text-red-500 text-sm" />

            <Field as="select" name="carCategory" className="p-2 border rounded-md">
              <option value="">Kategorie auswählen</option>
              <option value="PKW">PKW</option>
              <option value="Transporter">Transporter</option>
              <option value="Wohnwagen">Wohnwagen</option>
            </Field>
            <ErrorMessage name="carCategory" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carPrice"
              placeholder="Preis (€)"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carPrice" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="owner"
              placeholder="Besitzer"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="owner" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carSeat"
              placeholder="Sitzer"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carSeat" component="div" className="text-red-500 text-sm" />

            <Field
              as="textarea"
              name="carDescription"
              placeholder="Beschreibung"
              className="p-2 border rounded-md col-span-2"
            />
            <ErrorMessage name="carDescription" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carKilometers"
              placeholder="Kilometerstand"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carKilometers" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carColor"
              placeholder="Farbe"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carColor" component="div" className="text-red-500 text-sm" />

            <Field as="select" name="fuelType" className="p-2 border rounded-md">
              <option value="">Kraftstofftyp auswählen</option>
              <option value="Diesel">Diesel</option>
              <option value="Benzin">Benzin</option>
              <option value="Elektro">Elektro</option>
            </Field>
            <ErrorMessage name="fuelType" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carGearbox"
              placeholder="Getriebe"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carGearbox" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carMotor"
              placeholder="Motor"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carMotor" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carHorsePower"
              placeholder="Leistung (PS)"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carHorsePower" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="carEuroNorm"
              placeholder="EURO Norm"
              className="p-2 border rounded-md"
            />
            <ErrorMessage name="carEuroNorm" component="div" className="text-red-500 text-sm" />

            <div className="flex flex-col">
              <label htmlFor="carFirstRegistrationDay" className="mb-1 text-gray-700 font-semibold">
                Erstzulassung
              </label>
              <Field
                type="date"
                id="carFirstRegistrationDay"
                name="carFirstRegistrationDay"
                className="p-2 border rounded-md"
              />
              <ErrorMessage
                name="carFirstRegistrationDay"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="carTechnicalInspection" className="mb-1 text-gray-700 font-semibold">
                TÜV
              </label>
              <Field
                type="date"
                id="carTechnicalInspection"
                name="carTechnicalInspection"
                className="p-2 border rounded-md"
              />
              <ErrorMessage
                name="carTechnicalInspection"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="carImages" className="block text-gray-700 font-semibold mb-2">
                Bilder hochladen
              </label>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Dateien auswählen
              </button>
              <input
                type="file"
                id="carImages"
                ref={inputRef}
                multiple
                onChange={(e) => handleImageChange(e.target.files, setFieldValue)}
                className="hidden"
              />
              <p className="text-gray-600 mt-2">
                {imagesPreview.length > 0
                  ? `${imagesPreview.length} Datei(en) ausgewählt`
                  : "Keine Datei ausgewählt"}
              </p>

              {/* Bildvorschau */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagesPreview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, setFieldValue)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="carAirConditioning" />
              <label>Klimaanlage</label>
            </div>
            <div className="flex items-center gap-2">
              <Field type="checkbox" name="damagedCar" />
              <label>Beschädigt</label>
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="carNavigation" />
              <label>Navigation</label>
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="carParkAssist" />
              <label>Parksensoren</label>
            </div>

            <div className="flex items-center gap-2">
              <Field type="checkbox" name="carAccidentFree" />
              <label>Unfallfrei</label>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md w-full"
              >
                Fahrzeug speichern
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCarBuy;
