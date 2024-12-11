import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { displayUsers } from "../feuture/reducers/userSlice";
import { displayAppointments } from "../feuture/reducers/appointmentSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UserDetails = () => {
  const { userId } = useParams(); // Extrahiere Benutzer-ID aus der URL
  const users = useSelector(displayUsers);
  const appointments = useSelector(displayAppointments);
  const [isEditing, setIsEditing] = useState(false);

  const user = users.find((u) => u._id === userId); // Finde den Benutzer anhand der ID
  if (!user) {
    return <div>Benutzer nicht gefunden</div>;
  }
  console.log(user);

  // Filtere Werkstattbuchungen
  const workshopAppointments = appointments.filter(
    (appointment) => appointment.userId?.toString() === userId?.toString()
  );
  console.log(workshopAppointments);

  // Filtere Mietwagenbuchungen (Platzhalter, wenn es später hinzugefügt wird)
   

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Vorname ist erforderlich"),
    lastName: Yup.string().required("Nachname ist erforderlich"),
    email: Yup.string()
      .email("Ungültige E-Mail-Adresse")
      .required("E-Mail ist erforderlich"),
  });

  const handleDelete = () => {
    if (window.confirm("Möchten Sie diesen Benutzer wirklich löschen?")) {
      alert("Benutzer erfolgreich gelöscht.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Benutzerdetails</h1>

      {isEditing ? (
        <Formik
          initialValues={{
            customerNumber: user.customerNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }}
          validationSchema={validationSchema}
          onSubmit={() => {
            setIsEditing(false);
            alert("Benutzerinformationen erfolgreich aktualisiert.");
          }}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white p-6 shadow-md rounded-md">
              <div className="mb-4">
                <label className="block text-gray-700">Kundennummer</label>
                <Field
                  type="text"
                  name="customerNumber"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="customerNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Vorname</label>
                <Field
                  type="text"
                  name="firstName"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nachname</label>
                <Field
                  type="text"
                  name="lastName"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">E-Mail</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsEditing(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Speichern..." : "Speichern"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-md">
          <p className="mb-4">
            <strong>Kundennummer:</strong> {user.customerNumber}
          </p>
          <p className="mb-4">
            <strong>Vorname:</strong> {user.firstName}
          </p>
          <p className="mb-4">
            <strong>Nachname:</strong> {user.lastName}
          </p>
          <p className="mb-4">
            <strong>E-Mail:</strong> {user.email}
          </p>
          <img
            src={user.profile_photo || "https://via.placeholder.com/150"}
            alt="Profilbild"
            className="mt-4 w-32 h-32 rounded-full object-cover"
          />
          <div className="flex justify-between mt-6">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleDelete}
            >
              Löschen
            </button>
          </div>
        </div>
      )}

      {/* Werkstattbuchungen */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Werkstattbuchungen</h2>
        {workshopAppointments.length > 0 ? (
          <ul className="bg-white p-6 rounded-md shadow-md">
            {workshopAppointments.map((appointment) => (
              <li key={appointment._id} className="mb-4 border-b pb-4">
                <p>
                  <strong>Datum:</strong>{" "}
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Zeit:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Service:</strong> {appointment.service || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Keine Werkstattbuchungen vorhanden.</p>
        )}
      </div>

      {/* Mietwagenbuchungen */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Mietwagenbuchungen</h2>
          <p className="text-gray-500">Keine Mietwagenbuchungen vorhanden.</p>
      </div>
    </div>
  );
};

export default UserDetails;
