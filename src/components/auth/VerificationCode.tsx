"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NotificationService } from "../../service/NotificationService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../feuture/store/index";
import { confirmEmailVerificationCodeApi } from "../../feuture/reducers/userSlice";

interface VerificationCodeFormProps {
  onNextStep: () => void;
  email: string;
  className?: string;
}

const VerificationCode: React.FC<VerificationCodeFormProps> = ({
  onNextStep,
  email,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: Yup.object({
      code: Yup.string().required("Verifizierungscode ist erforderlich"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await dispatch(
          confirmEmailVerificationCodeApi({
            email,
            verificationCode: values.code,
          })
        ).unwrap();
        NotificationService.success("Verifizierung erfolgreich!");
        onNextStep(); // Zum nächsten Schritt wechseln
      } catch (error: any) {
        NotificationService.error(
          error.message || "Ungültiger Verifizierungscode."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`space-y-6 ${className || ""}`}
    >
      <h3 className="text-2xl font-extrabold text-center text-gray-800">
        Verifizierungscode
      </h3>
      <p className="text-center text-gray-600 mb-4">
        Bitte geben Sie den Code ein, den wir an{" "}
        <span className="font-semibold">{email}</span> gesendet haben.
      </p>

      <div className="relative">
        <input
          type="text"
          name="code"
          placeholder="Verifizierungscode"
          className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none transition-all duration-300 ${
            formik.touched.code && formik.errors.code
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.code && formik.errors.code && (
          <p className="text-red-500 text-sm absolute left-0 top-full mt-1">
            {formik.errors.code}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
              ></path>
            </svg>
            Wird überprüft...
          </span>
        ) : (
          "Weiter"
        )}
      </button>
    </form>
  );
};

export default VerificationCode;
