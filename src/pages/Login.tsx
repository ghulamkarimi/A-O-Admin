import { Link, useNavigate } from 'react-router-dom';
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
        localStorage.setItem("userId", response.userInfo.userId);
        localStorage.setItem("exp", response.userInfo.exp.toString());
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
      className={`flex w-full items-center border-2 justify-center min-h-screen  rounded-lg bg-[url('/ölwechsel.jpeg')] bg-cover bg-center`}

    >
      <div className="bg-gray-900 text-white rounded-xl shadow-xl p-10 max-w-md w-full border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Willkommen zurück!</h1>
          <p className="text-sm text-gray-400">
            Bitte melden Sie sich mit Ihren Zugangsdaten an.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-700"
                }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-2">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Passwort
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="********"
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-700"
                  }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <IoEyeOffSharp className="text-gray-500 hover:text-gray-300" />
                ) : (
                  <IoEyeSharp className="text-gray-500 hover:text-gray-300" />
                )}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-2">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 text-lg font-bold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Lädt..." : "Anmelden"}
            </button>
          </div>
        </form>

        {/* Passwort vergessen */}
        <div className="text-center mt-6">
          <Link to="/forgetPassword" className="block px-4 py-2 hover:bg-gray-700 rounded">
            <button className="text-sm text-blue-400 hover:underline">
              Passwort vergessen?
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Login;
