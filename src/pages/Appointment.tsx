import AppointmentComponent from "../components/appointment/appointmentComponent";

const Appointment = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">Termine verwalten</h1>
                <p className="text-lg text-gray-700 mb-6">Hier finden Sie alle Ihre geplanten Termine in einer Übersicht. Nutzen Sie die unten stehenden Buttons, um die Verfügbarkeit der Termine zu verwalten:</p>
                 
                <AppointmentComponent />
            </div>
        </div>
    );
}

export default Appointment;
