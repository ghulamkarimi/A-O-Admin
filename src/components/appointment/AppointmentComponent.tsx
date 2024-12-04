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
            try {
                const result = await dispatch(unblockAppointments(appointment)).unwrap();
                NotificationService.success(`Der Termin um ${time} wurde erfolgreich freigegeben.`);
            } catch (error) {
                NotificationService.error(`Fehler beim Freigeben des Termins um ${time}.`);
            }
        } else {
            // Falls der Termin verfügbar ist, blockieren
            try {
                const result = await dispatch(blockAppointments(appointment)).unwrap();
                NotificationService.success(`Der Termin um ${time} wurde erfolgreich blockiert.`);
            } catch (error) {
                NotificationService.error(`Fehler beim Blockieren des Termins um ${time}.`);
            }
        }
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
        <div className="bg-cover bg-center bg-no-repeat min-h-screen rounded-lg p-4">
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
            />
            <div className="mt-5">
                <h3 className="text-lg font-semibold mb-4">
                    Verfügbare Zeiten für {selectedDate.toLocaleDateString()}:
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    {availableTimes.map(time => {
                        const isBookedOrBlocked = bookedOrBlockedTimes.includes(time);
                        const isDisabled = isPastTime(time);
                        return (
                            <button
                                key={time}
                                onClick={() => handleTimeSlotClick(time)}
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-md font-bold cursor-pointer border
                                    ${isBookedOrBlocked ? 'bg-red-500 text-white border-red-700' :
                                    isDisabled ? 'bg-gray-400 text-gray-100 border-gray-500 cursor-not-allowed' :
                                    'bg-green-600 text-white border-green-700'}`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminCalendar;
