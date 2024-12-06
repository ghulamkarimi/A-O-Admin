import { useSelector, useDispatch } from "react-redux";
import { displayAppointments, blockAppointments, unblockAppointments } from "../../feuture/reducers/appointmentSlice";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useState } from "react";
import { TAppointment } from "../../interface";
import { NotificationService } from "../../service/NotificationService";
import WarningModal from "../WarningModal";

const AdminCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showWarning, setShowWarning] = useState(false);
    const [pendingAction, setPendingAction] = useState<{ time: string, action: 'unblock' | 'block', appointment?: TAppointment } | null>(null);
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

    const handleTimeSlotClick = (time: string) => {
        const isBookedOrBlocked = bookedOrBlockedTimes.includes(time);

        if (isBookedOrBlocked) {
            // Falls der Termin gebucht/blockiert ist, freigeben
            const appointmentToUnblock = appointmentsForSelectedDate.find(appt => appt.time === time);
            if (appointmentToUnblock && appointmentToUnblock._id) {
                setPendingAction({
                    time,
                    action: 'unblock',
                    appointment: appointmentToUnblock,
                });
            }
        } else {
            // Falls der Termin verfügbar ist, blockieren
            const appointment: TAppointment = {
                date: selectedDate.toISOString(),
                time,
            };
            setPendingAction({
                time,
                action: 'block',
                appointment,
            });
        }
        setShowWarning(true);
    };

    const handleConfirmAction = async () => {
        if (pendingAction) {
            try {
                if (pendingAction.action === 'unblock' && pendingAction.appointment) {
                    if (pendingAction.appointment._id) {
                        await dispatch(unblockAppointments(pendingAction.appointment._id)).unwrap();
                    } else {
                        throw new Error("Appointment ID is undefined");
                    }
                    NotificationService.success(`Der Termin um ${pendingAction.time} wurde erfolgreich freigegeben.`);
                } else if (pendingAction.action === 'block' && pendingAction.appointment) {
                    await dispatch(blockAppointments(pendingAction.appointment)).unwrap();
                    NotificationService.success(`Der Termin um ${pendingAction.time} wurde erfolgreich blockiert.`);
                }
            } catch (error) {
                NotificationService.error(`Fehler beim ${pendingAction.action === 'unblock' ? 'Freigeben' : 'Blockieren'} des Termins um ${pendingAction.time}.`);
            }
        }
        setShowWarning(false);
        setPendingAction(null);
    };

    const handleCancelAction = () => {
        setShowWarning(false);
        setPendingAction(null);
    };

    // Hilfsfunktion zum Überprüfen, ob eine Zeit in der Vergangenheit liegt
    const isPastTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(hours, minutes, 0, 0);

        return selectedTime < now;
    };

    return (
        <div className="bg-cover bg-center bg-no-repeat min-h-screen rounded-lg p-8 flex flex-col items-center">
            <Calendar
                value={selectedDate}
                onChange={(value) => handleDateChange(value as Date)}
                tileDisabled={({ date }) => {
                    // Vergangene Tage deaktivieren, außer Sonntag
                    return date.getDay() === 0;
                }}
                tileClassName={({ date }) => {
                    // Markiere Tage mit gebuchten oder blockierten Terminen rot
                    const isBookedOrBlocked = appointments.some(
                        appointment =>
                            new Date(appointment.date).toDateString() === date.toDateString()
                    );
                    return isBookedOrBlocked ? 'bg-red-400' : 'bg-green-400';
                }}
                className="mb-8 border border-gray-500 rounded-lg shadow-lg"
            />
            <div className="mt-5 flex flex-col items-center w-full">
                <h3 className="text-3xl font-extrabold mb-6 text-gray-900">
                    Verfügbare Zeiten für {selectedDate.toLocaleDateString()}:
                </h3>
                <div className="w-full">
                    <table className="min-w-full bg-white border rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 bg-indigo-700 text-white font-bold uppercase text-left">Uhrzeit</th>
                                <th className="py-4 px-6 bg-indigo-700 text-white font-bold uppercase text-center">Aktion</th>
                                <th className="py-4 px-6 bg-indigo-700 text-white font-bold uppercase text-left">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableTimes.map(time => {
                                const isBookedOrBlocked = bookedOrBlockedTimes.includes(time);
                                const isDisabled = isPastTime(time);
                                const appointmentDetails = appointmentsForSelectedDate.find(appt => appt.time === time);
                                return (
                                    <tr key={time} className={`border-b ${isBookedOrBlocked ? 'bg-red-200' : 'bg-green-200'} hover:bg-gray-200 transition-all duration-200`}>
                                        <td className="py-4 px-6 text-xl font-bold text-gray-900">{time}</td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleTimeSlotClick(time)}
                                                disabled={isDisabled}
                                                className={`w-full px-6 py-3 rounded-full font-semibold transition-all shadow-md transform hover:scale-105 focus:outline-none
                                                    ${isBookedOrBlocked ? 'bg-blue-800 hover:bg-blue-900 text-white' :
                                                    'bg-blue-600 hover:bg-blue-700 text-white'}
                                                    disabled:bg-gray-500 disabled:cursor-not-allowed`}
                                            >
                                                {isBookedOrBlocked ? 'Gebucht' : 'Blockieren'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-left">
                                            {appointmentDetails ? (
                                                <div className="text-sm space-y-2">
                                                    {appointmentDetails.email && (
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Benutzer: {appointmentDetails.firstName} {appointmentDetails.lastName}</p>
                                                            <p className="text-gray-800">Email: {appointmentDetails.email}</p>
                                                        </div>
                                                    )}
                                                    {appointmentDetails.service && (
                                                        <p className="font-semibold text-gray-900">Service: <span className="font-normal text-gray-800">{appointmentDetails.service}</span></p>
                                                    )}
                                                    {appointmentDetails.licensePlate && (
                                                        <p className="font-semibold text-gray-900">Kennzeichen: <span className="font-normal text-gray-800">{appointmentDetails.licensePlate}</span></p>
                                                    )}
                                                    {appointmentDetails.phone && (
                                                        <p className="font-semibold text-gray-900">Telefon: <span className="font-normal text-gray-800">{appointmentDetails.phone}</span></p>
                                                    )}
                                                    {appointmentDetails.email ? (
                                                        <>
                                                            {appointmentDetails.hsn ? (
                                                                <p className="font-semibold text-gray-900">HSN: <span className="font-normal text-gray-800">{appointmentDetails.hsn}</span></p>
                                                            ) : (
                                                                <p className="font-semibold text-gray-900">HSN: <span className="font-normal text-gray-800">____</span></p>
                                                            )}
                                                            {appointmentDetails.tsn ? (
                                                                <p className="font-semibold text-gray-900">TSN: <span className="font-normal text-gray-800">{appointmentDetails.tsn}</span></p>
                                                            ) : (
                                                                <p className="font-semibold text-gray-900">TSN: <span className="font-normal text-gray-800">____</span></p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="font-semibold text-gray-900">Details: <span className="font-normal text-gray-800">Vom Admin blockiert</span></p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600">Keine Details verfügbar</p>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {showWarning && pendingAction && (
                <WarningModal
                    message={`Sind Sie sicher, dass Sie den Termin um ${pendingAction.time} ${pendingAction.action === 'unblock' ? 'freigeben' : 'blockieren'} möchten?`}
                    onConfirm={handleConfirmAction}
                    onCancel={handleCancelAction}
                />
            )}
        </div>
    );
};

export default AdminCalendar;
