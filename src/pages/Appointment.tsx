import AdminSlotManagement from "../components/appointment/AdminSlotManagement";

const Appointment = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Termine</h1>
            <p>Hier sind alle Termine aufgelistet.</p>
            <AdminSlotManagement />
        </div>
    );
}

export default Appointment;