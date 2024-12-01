
import { useNavigate } from 'react-router-dom';
import { IoEyeSharp, IoReturnDownBack, IoEyeOffSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../feuture/store/index";
import * as Yup from "yup";
import { useFormik } from "formik";
import { NotificationService } from "../service/NotificationService";
import { setUserInfo, userLoginApi } from "../feuture/reducers/userSlice";

import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const formSchema = Yup.object({
    email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),
    password: Yup.string()
      .required("Passwort ist erforderlich")
      .matches(
        passwordStrengthRegex,
        "Mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahl erforderlich."
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await dispatch(userLoginApi(values)).unwrap();
        NotificationService.success(response.message || "Login erfolgreich!");
        setTimeout(() => {
            navigate("/");
        }, 4000);
        dispatch(setUserInfo(response.userInfo));
      } catch (error: any) {
        NotificationService.error(error.message || "Login fehlgeschlagen.");
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: formSchema,
  });

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen register-background"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Linke Seite: Login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold">Login</h3>
            <p className="text-sm pt-2 font-bold">
              Bitte geben Sie Ihre Anmeldedaten ein, um fortzufahren.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                  onClick={() => setShowPassword(!showPassword)}
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

            <div className="">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Lädt..." : "Login"}
              </button>
            </div>
          </form>
          <div className="flex flex-col">
            <span className="text-xl my-4">Oder</span>
            <button
              onClick={() => navigate("/forgetPassword")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              Passwort vergessen
            </button>
          </div>
        </div>
      </div>

      {/* Rechte Seite: Registrierung */}
      <div className="flex-1 flex items-center justify-center p-6 bg-opacity-50 bg-black">
        <div className="flex flex-col text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Kein Konto?</h3>
          <p className="text-sm text-gray-300 mb-6">
            Registrieren Sie sich jetzt und genießen Sie den vollen Zugriff auf
            alle Funktionen.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            Jetzt Registrieren
          </button>
          <div className="py-4">
            <span className="text-white text-lg">Oder</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            <IoReturnDownBack className="text-xl" />
            <span>Zurück zur Startseite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
