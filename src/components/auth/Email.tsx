"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationService } from "../../service/NotificationService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../feuture/store/index";
import { requestPasswordResetApi } from "../../feuture/reducers/userSlice";

interface EmailFormProps {
  onNextStep: () => void;
  setEmail: (email: string) => void;
  className?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ onNextStep, setEmail,className }) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Ungültige E-Mail-Adresse")
        .required("E-Mail ist erforderlich"),
    }),
    onSubmit: async (values) => {
      try {
        // API-Aufruf, um den OTP zu senden
        await dispatch(requestPasswordResetApi(values.email)).unwrap();
        NotificationService.success("OTP wurde an Ihre E-Mail gesendet!");
        setEmail(values.email); // E-Mail speichern
        onNextStep(); // Zum nächsten Schritt wechseln
      } catch (error: any) {
        NotificationService.error(error.message || "Fehler beim Senden des OTP.");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-center">Passwort vergessen</h3>
      <p className="">
        Geben Sie Ihre registrierte E-Mail-Adresse ein, um einen Bestätigungscode zu erhalten.
      </p>
      <input
        type="email"
        name="email"
        placeholder="E-Mail-Adresse"
        className={`w-full px-4 py-3 border rounded-lg ${
          formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
        }`}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email && (
        <p className="text-red-500 text-sm">{formik.errors.email}</p>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
        OTP senden
      </button>
    </form>
  );
};

export default EmailForm;
