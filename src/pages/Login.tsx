import { useNavigate } from 'react-router-dom';
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
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
          navigate("/home");
        }, 2000);
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
      className="flex flex-col md:flex-row min-h-screen background text-white"
      style={{ backgroundImage: "url('/homeBackground.jpg')"  }}
    >
      {/* Linke Seite: Login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-black/70 rounded-lg shadow-2xl p-12 max-w-md w-full">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-extrabold  mb-2">Willkommen zurück!</h3>
            <p className="text-lg">
              Melden Sie sich mit Ihren Zugangsdaten an, um fortzufahren.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-lg font-semibold">
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
                className={`mt-2 block w-full px-4 py-3 border-2 rounded-lg shadow-sm text-gray-900 focus:ring-blue-600 focus:border-blue-600 transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="h-5">
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-lg font-semibold">
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
                  className={`block w-full px-4 py-3 border-2 rounded-lg shadow-sm text-gray-900 focus:ring-blue-600 focus:border-blue-600 transition-all ${
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
                    <IoEyeOffSharp className="text-gray-500 hover:text-blue-600" />
                  ) : (
                    <IoEyeSharp className="text-gray-500 hover:text-blue-600" />
                  )}
                </span>
              </div>
              <div className="h-5">
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Lädt..." : "Anmelden"}
              </button>
            </div>
          </form>

          {/* Passwort vergessen */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/forgetPassword")}
              className="font-semibold transition-all"
            >
              Passwort vergessen?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
