import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccountApi, displayUsers } from "../feuture/reducers/userSlice";
import { displayAppointments } from "../feuture/reducers/appointmentSlice";
import { AllReservation, getReservationApi, updateStatusReservationApi, rejectReservationApi } from "../feuture/reducers/resevationSlice";
import FormattedDate from "../components/FormatesDate";
import { NotificationService } from "../service/NotificationService";
import { AppDispatch } from "../feuture/store";
import { useEffect, useState } from "react";
import { TReservation } from "../interface";

const UserDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams(); // Extrahiere Benutzer-ID aus der URL
  const users = useSelector(displayUsers);
  const appointments = useSelector(displayAppointments);
  const userReservations = useSelector(AllReservation);
  const [loading, setLoading] = useState(true);
  const [filteredReservations, setFilteredReservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getReservationApi());
      const rentalAppointment = userReservations?.filter(
        (reservation) => reservation?.user?._id?.toString() === userId?.toString()
      );
      setFilteredReservations(rentalAppointment);
      setLoading(false);
    };

    if (userId) {
      fetchData();
    }
  }, [dispatch, userReservations, userId]);

  const user = users.find((u) => u?._id === userId); // Finde den Benutzer anhand der ID
  if (!user) {
    return <div>Benutzer nicht gefunden</div>;
  }


  const workshopAppointments = appointments.filter(
    (appointment) => appointment.userId?.toString() === userId?.toString()
  );

  const handleDelete = async (userId: string) => {
    if (window.confirm("Möchten Sie diesen Benutzer wirklich löschen?")) {
      try {
        const response = await dispatch(deleteAccountApi(userId)).unwrap();
        NotificationService.success(response.message);
      } catch (error: any) {
        NotificationService.error(error.message);
      }
    }
  };


  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, reservationId: string) => {
    const newStatus = e.target.value;

    const isConfirmed = window.confirm("Sind Sie sicher, dass Sie den Zahlungsstatus ändern möchten?");
    if (!isConfirmed) return;

    try {
      const response = await dispatch(
        updateStatusReservationApi({ _id: reservationId, paymentStatus: newStatus })
      ).unwrap();

      if (response) {
        NotificationService.success("Zahlungsstatus erfolgreich aktualisiert.");
      }
    } catch (error) {
      NotificationService.error("Fehler beim Aktualisieren des Zahlungsstatus.");
    }
  };

  const handleReject = async (reservation: TReservation) => {
    const isConfirmed = window.confirm(
      "Sind Sie sicher, dass Sie die Reservierung ablehnen möchten?"
    );
    if (!isConfirmed) return;

    const userId = localStorage.getItem("userId") || "";
    const reservationId = reservation?._id || "Keine ID";
    const email = reservation?.email || "Keine Email";

    console.log("Reservation ID:", reservationId);
    console.log("Reservation Email:", email);
    console.log("Admin User ID:", userId || "Keine Admin-ID gefunden");

    if (!reservationId || !email) {
      NotificationService.error("Reservierung ist unvollständig.");
      return;
    }

    if (!userId) {
      NotificationService.error("Admin-User-ID nicht gefunden.");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(
        rejectReservationApi({
          _id: reservationId,
          email: email,
          userId: userId,
        })
      ).unwrap();
      NotificationService.success(response.message);
    } catch (error) {
      NotificationService.error("Fehler beim Ablehnen der Reservierung.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Benutzerdetails</h1>

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
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              if (userId) {
                handleDelete(userId);
              } else {
                NotificationService.error("Benutzer-ID ist nicht vorhanden.");
              }
            }}
          >
            Löschen
          </button>
        </div>
      </div>

      {/* Werkstattbuchungen */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Werkstattbuchungen</h2>
        {workshopAppointments.length > 0 ? (
          <ul className="bg-white p-6 rounded-md shadow-md">
            {workshopAppointments.map((appointment) => (
              <li key={appointment?._id} className="mb-4 border-b pb-4">
                <p>
                  <strong>Datum:</strong> {new Date(appointment?.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Zeit:</strong> {appointment?.time}
                </p>
                <p>
                  <strong>Service:</strong> {appointment?.service || "N/A"}
                </p>
                <p>
                  <strong>Kennzeichen:</strong> {appointment?.licensePlate || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Keine Werkstattbuchungen vorhanden.</p>
        )}
      </div>

      {/* Mietwagenbuchungen */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-8 text-orange-600 text-center">
          Mietwagenbuchungen
        </h2>

        {
          loading ? (
            <p className="text-center text-gray-500 text-xl">Lade Mietwagenbuchungen...</p>
          ) :
            filteredReservations.length > 0 ? (
              <div className="max-w-2xl mx-auto space-y-10">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation?._id}
                    className="border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white"
                  >
                    <img
                      className="w-full h-72 object-cover"
                      src={reservation?.carRent.carImage}
                      alt={reservation?.carRent.carName}
                    />
                    <div className="p-6 space-y-6">
                      <h3 className="text-3xl font-semibold text-gray-900">
                        {reservation?.carRent?.carName}
                      </h3>
                      <div className="text-lg space-y-4">
                        <p>
                          <strong>Abholzeit:</strong>{" "}
                          <span className="text-gray-700">{reservation.pickupTime}</span>
                        </p>
                        <p>
                          <strong>Abholdatum:</strong>{" "}
                          <span className="text-gray-700">
                            <FormattedDate date={reservation?.pickupDate || ""} />
                          </span>
                        </p>
                        <p>
                          <strong>Rückgabedatum:</strong>{" "}
                          <span className="text-gray-700">
                            <FormattedDate date={reservation?.returnDate || ""} />
                          </span>
                        </p>
                        <p>
                          <strong>Rückgabezeit:</strong>{" "}
                          <span className="text-gray-700">{reservation?.returnTime}</span>
                        </p>
                        <div>
                          <strong>Zahlungsstatus:</strong>{" "}
                          <select
                            className="ml-4 px-2 py-1 rounded-md border"
                            value={reservation.paymentStatus}
                            onChange={(e) => handleStatusChange(e, reservation?._id)}
                          >
                            <option value="pending">Ausstehend</option>
                            <option value="completed">Abgeschlossen</option>
                          </select>
                        </div>
                        <p>
                          <strong>Fahrer:</strong>{" "}
                          <span className="text-gray-700">
                            {reservation.vorname} {reservation.nachname}
                          </span>
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          <span className="text-gray-700">
                            {reservation.email}
                          </span>
                        </p>
                        <p>
                          <strong>Telefon:</strong>{" "}
                          <span className="text-gray-700">
                            {reservation.telefonnummer}
                          </span>
                        </p>
                        <p>
                          <strong>Geburtsdatum:</strong>{" "}
                          <span className="text-gray-700">
                            <FormattedDate date={reservation.geburtsdatum || ""} />
                          </span>
                        </p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                          onClick={() => handleReject({
                            _id: reservation._id,
                            email: reservation.email,
                            
                          })}
                        >
                          Reservierung ablehnen
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xl">
                Keine Mietwagenbuchungen vorhanden.
              </p>
            )
        }
      </div>
    </div>
  );
};

export default UserDetails;
