import AppointmentComponent from "../components/appointment/appointmentComponent";

const Appointment = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Termine</h1>
            <p>Hier sind alle Termine aufgelistet.</p>
            <AppointmentComponent />
        </div>
    );
}

export default Appointment;