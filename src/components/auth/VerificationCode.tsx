"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationService } from "../../service/NotificationService"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../feuture/store/index"
import { confirmEmailVerificationCodeApi } from "../../feuture/reducers/userSlice"

interface VerificationCodeFormProps {
  onNextStep: () => void;
  email: string;
}

const VerificationCode: React.FC<VerificationCodeFormProps> = ({ onNextStep, email }) => {
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: Yup.object({
      code: Yup.string().required("Verifizierungscode ist erforderlich"),
    }),
    onSubmit: async (values) => {
      try {
        // API-Aufruf, um den Code zu verifizieren
        await dispatch(confirmEmailVerificationCodeApi({ email, verificationCode: values.code })).unwrap();
        NotificationService.success("Verifizierung erfolgreich!");
        onNextStep(); // Zum nächsten Schritt wechseln
      } catch (error: any) {
        NotificationService.error(error.message || "Ungültiger Verifizierungscode.");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-center">Code eingeben</h3>
      <p className="">
        Geben Sie den Code ein, den Sie per E-Mail erhalten haben.
      </p>
      <input
        type="text"
        name="code"
        placeholder="Verifizierungscode"
        className={`w-full px-4 py-3 border rounded-lg text-black ${
          formik.touched.code && formik.errors.code ? "border-red-500" : "border-gray-300"
        }`}
        value={formik.values.code}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.code && formik.errors.code && (
        <p className="text-red-500 text-sm">{formik.errors.code}</p>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
        Weiter
      </button>
    </form>
  );
};

export default VerificationCode;
