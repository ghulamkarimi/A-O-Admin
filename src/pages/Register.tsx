
import { useState } from "react";
import { IoEyeSharp, IoReturnDownBack, IoEyeOffSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../feuture/store/index";
import * as Yup from "yup";
import { useFormik } from "formik";
import { NotificationService } from "../service/NotificationService";
import { userRegisterApi } from "..//feuture/reducers/userSlice";
import { useNavigate } from "react-router-dom";


const Register = () => {
const navigation = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const formSchema = Yup.object({
    firstName: Yup.string()
      .required("Vorname ist erforderlich")
      .matches(/^[A-Za-z\s]+$/, "Nur Buchstaben und Leerzeichen sind erlaubt"),
    lastName: Yup.string()
      .required("Nachname ist erforderlich")
      .matches(/^[A-Za-z]+$/, "Nur Buchstaben sind erlaubt"),
    email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),
    password: Yup.string()
      .required("Passwort ist erforderlich")
      .matches(
        passwordStrengthRegex,
        "Mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahl erforderlich."
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwörter stimmen nicht überein")
      .required("Passwort-Bestätigung ist erforderlich"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(userRegisterApi(values)).unwrap();
        NotificationService.success(
          response.message || "Registrierung erfolgreich!"
        );
        setTimeout(() => {
          navigation("/login");
        }, 4000);
      } catch (error: any) {
        NotificationService.error(error.message || "Registrierung fehlgeschlagen.");
      }
    },
  });

  return (
    <div
      className="flex flex-col md:flex-row py-4 register-background text-white"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Linke Seite: Registrierungsformular */}
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold">Registrieren</h3>
            <p className="text-sm">
              Bitte füllen Sie die folgenden Felder aus, um ein Konto zu erstellen.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                Vorname
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Vorname"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="h-5">
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Nachname
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nachname"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="h-5">
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="E-Mail-Adresse"
                className={`mt-2 block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="h-5">
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">
                Passwort
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Passwort"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOffSharp className="text-gray-500" />
                  ) : (
                    <IoEyeSharp className="text-gray-500" />
                  )}
                </span>
              </div>
              <div className="h-5">
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>
            </div>

            {/* Passwort bestätigen */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Passwort bestätigen
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Passwort bestätigen"
                  className={`block w-full px-4 py-3 border rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOffSharp className="text-gray-500" />
                  ) : (
                    <IoEyeSharp className="text-gray-500" />
                  )}
                </span>
              </div>
              <div className="h-5">
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Registrieren
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Rechte Seite: Links */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Schon registriert?</h3>
          <p className="text-sm text-white mb-6">
            Melden Sie sich an, um fortzufahren oder nutzen Sie die Passwort-Wiederherstellung.
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigation("/login")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Jetzt Einloggen
            </button>
            <button
              onClick={() => navigation("/")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Zurück zur Startseite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
