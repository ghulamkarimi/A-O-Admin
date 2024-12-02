"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../feuture/store/index";
import { NotificationService } from "../../service/NotificationService";
import { changePasswordApi } from "../../feuture/reducers/userSlice"

import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

interface ChangePasswordFormProps {
  email: string;
}

const ChangePassword: React.FC<ChangePasswordFormProps> = ({ email }) => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Das Passwort muss mindestens 6 Zeichen lang sein")
        .matches(
          passwordStrengthRegex,
          "Mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahl erforderlich"
        )
        .required("Neues Passwort ist erforderlich"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Die Passwörter stimmen nicht überein")
        .required("Passwort-Bestätigung ist erforderlich"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(
          changePasswordApi({
            email,
            password: values.newPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          })
        ).unwrap();
        NotificationService.success("Passwort erfolgreich geändert!");
        navigate("/login");
      } catch (error: any) {
        NotificationService.error(
          error.message || "Fehler beim Zurücksetzen des Passworts."
        );
      }
    },
  });

  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-center">Neues Passwort</h3>
      <div className="relative">
        <input
          type={showPassword.newPassword ? "text" : "password"}
          name="newPassword"
          placeholder="Neues Passwort"
          className={`w-full px-4 py-3 border rounded-lg text-black ${
            formik.touched.newPassword && formik.errors.newPassword
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span
          onClick={() => togglePasswordVisibility("newPassword")}
          className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
        >
          {showPassword.newPassword ? (
            <IoEyeOffSharp className="text-gray-500" />
          ) : (
            <IoEyeSharp className="text-gray-500" />
          )}
        </span>
      </div>
      {formik.touched.newPassword && formik.errors.newPassword && (
        <p className="text-red-500 text-sm">{formik.errors.newPassword}</p>
      )}
      <div className="relative">
        <input
          type={showPassword.confirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Passwort bestätigen"
          className={`w-full px-4 py-3 border rounded-lg text-black ${
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span
          onClick={() => togglePasswordVisibility("confirmPassword")}
          className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
        >
          {showPassword.confirmPassword ? (
            <IoEyeOffSharp className="text-gray-500" />
          ) : (
            <IoEyeSharp className="text-gray-500" />
          )}
        </span>
      </div>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
      )}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
        Passwort ändern
      </button>
    </form>
  );
};

export default ChangePassword;
