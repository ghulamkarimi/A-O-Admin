import { useSelector, useDispatch } from "react-redux";
import { displayAppointments, blockAppointments, unblockAppointments } from "../../feuture/reducers/appointmentSlice";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import { TAppointment } from "../../interface";
import { NotificationService } from "../../service/NotificationService";

const AdminCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dispatch = useDispatch<any>();
    const appointments = useSelector(displayAppointments);
    const availableTimes = ["07:30", "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];

    // Holen Sie sich alle Termine, die zu dem ausgewählten Datum gehören
    const appointmentsForSelectedDate = appointments.filter(appointment =>
        new Date(appointment.date).toDateString() === selectedDate.toDateString()
    );

    // Blockierte und gebuchte Zeiten für den ausgewählten Tag
    const bookedOrBlockedTimes = appointmentsForSelectedDate.map(appointment => appointment.time);

    const handleDateChange = (value: Date | Date[]) => {
        setSelectedDate(value as Date);
    };

    const handleTimeSlotClick = async (time: string) => {
        const isBookedOrBlocked = bookedOrBlockedTimes.includes(time);

        // Erstelle ein Appointment-Objekt
        const appointment: TAppointment = {
            date: selectedDate.toISOString(),
            time,
        };

        if (isBookedOrBlocked) {
            // Falls der Termin gebucht/blockiert ist, freigeben
            // Finde das Appointment, um die appointmentId zu erhalten
            const appointmentToUnblock = appointmentsForSelectedDate.find(appt => appt.time === time);
            if (appointmentToUnblock && appointmentToUnblock._id) {
                try {
                    await dispatch(unblockAppointments(appointmentToUnblock._id)).unwrap();
                    NotificationService.success(`Der Termin um ${time} wurde erfolgreich freigegeben.`);
                } catch (error) {
                    NotificationService.error(`Fehler beim Freigeben des Termins um ${time}.`);
                }
            } else {
                NotificationService.error(`Termin konnte nicht gefunden werden, um ihn freizugeben.`);
            }
        } else {
            // Falls der Termin verfügbar ist, blockieren
            try {
                await dispatch(blockAppointments(appointment)).unwrap();
                NotificationService.success(`Der Termin um ${time} wurde erfolgreich blockiert.`);
            } catch (error) {
                NotificationService.error(`Fehler beim Blockieren des Termins um ${time}.`);
            }
        }

        // Emitte das `appointmentUpdated`-Ereignis nach jeder Änderung, um andere Clients zu benachrichtigen
      
    };

    // Hilfsfunktion zum Überprüfen, ob eine Zeit in der Vergangenheit liegt
    const isPastTime = (time: string) => {
        if (selectedDate.toDateString() !== new Date().toDateString()) {
            return false; // Prüfe nur für den heutigen Tag
        }

        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);

        return selectedTime < now;
    };

    return (
        <div className="bg-cover bg-center bg-no-repeat min-h-screen rounded-lg p-8 flex flex-col items-center">
            <Calendar
                value={selectedDate}
                onChange={(value) => handleDateChange(value as Date)}
                tileDisabled={({ date }) => {
                    // Vergangene Tage oder Sonntage deaktivieren
                    return date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0;
                }}
                tileClassName={({ date }) => {
                    // Markiere Tage mit gebuchten oder blockierten Terminen rot
                    const isBookedOrBlocked = appointments.some(
                        appointment =>
                            new Date(appointment.date).toDateString() === date.toDateString()
                    );
                    return isBookedOrBlocked ? 'bg-red-200' : 'bg-green-200';
                }}
                className="mb-8 border border-gray-300 rounded-lg shadow-lg"
            />
            <div className="mt-5 flex flex-col items-center w-full">
                <h3 className="text-3xl font-extrabold mb-6 text-gray-800">
                    Verfügbare Zeiten für {selectedDate.toLocaleDateString()}:
                </h3>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-gray-700 border-b text-left">Uhrzeit</th>
                                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-gray-700 border-b text-center">Aktion</th>
                                <th className="py-3 px-6 bg-gray-200 font-bold uppercase text-gray-700 border-b text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableTimes.map(time => {
                                const isBookedOrBlocked = bookedOrBlockedTimes.includes(time);
                                const isDisabled = isPastTime(time);
                                const appointmentDetails = appointmentsForSelectedDate.find(appt => appt.time === time);
                                return (
                                    <tr key={time} className={`border-b ${isBookedOrBlocked ? 'bg-red-100' : 'bg-green-100'} hover:bg-gray-100 transition-colors`}>
                                        <td className="py-4 px-6 text-xl font-medium text-gray-800">{time}</td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleTimeSlotClick(time)}
                                                disabled={isDisabled}
                                                className={`px-4 py-3 rounded font-semibold transition-all shadow-md focus:outline-none
                                                    ${isBookedOrBlocked ? 'bg-blue-700 hover:bg-blue-800 text-white' :
                                                    'bg-blue-500 hover:bg-blue-600 text-white'}
                                                    disabled:bg-gray-500 disabled:cursor-not-allowed`}
                                            >
                                                {isBookedOrBlocked ?
                                                    (appointmentDetails && appointmentDetails.email ? 'Gebucht' : 'Blockiert')
                                                    : 'Blockieren'}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 text-left">
                                            {appointmentDetails ? (
                                                <div className="text-sm">
                                                    {appointmentDetails.email && (
                                                        <>
                                                            <p className="font-semibold text-gray-800">Benutzer: {appointmentDetails.firstName} {appointmentDetails.lastName}</p>
                                                            <p className="text-gray-600 font-semibold">Email: {appointmentDetails.email}</p>
                                                        </>
                                                    )}
                                                    {appointmentDetails.service && (
                                                        <p className="font-semibold text-gray-800">Service: <span className="f text-gray-600">{appointmentDetails.service}</span></p>
                                                    )}
                                                    
                                                    {appointmentDetails.licensePlate && (
                                                        <p className="font-semibold text-gray-800">Kennzeichen: <span className=" text-gray-600">{appointmentDetails.licensePlate}</span></p>
                                                    )}
                                                    {appointmentDetails.hsn && appointmentDetails.tsn && (
                                                        <p className="font-semibold text-gray-800">HSN/TSN: <span className=" text-gray-600">{appointmentDetails.hsn}/{appointmentDetails.tsn}</span></p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Keine Details verfügbar</p>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCalendar;