import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchAllSlots,
    blockSlotById,
    unblockSlotById,
    confirmSlotById,
} from "../../feuture/reducers/slotSlice";
import { NotificationService } from "../../service/NotificationService";
import { socket } from "../../service";
import { AppDispatch, RootState } from "../../feuture/store";


const AdminSlotManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { slots, loading, error } = useSelector((state: RootState) => state.slots);

    useEffect(() => {
        // Initiale Daten laden
        dispatch(fetchAllSlots());

        // WebSocket verbinden
        socket.connect();

        // Event-Listener für Echtzeit-Updates
        socket.on("slotUpdated", (updatedSlot) => {
            dispatch(fetchAllSlots()); // Alternativ: State direkt aktualisieren, um Ressourcen zu sparen
            NotificationService.success(`Slot-Update: Status wurde auf ${updatedSlot.status} geändert.`);
        });

        // Aufräumen
        return () => {
            socket.off("slotUpdated");
            socket.disconnect();
        };
    }, [dispatch]);

    const handleBlockSlot = async (slotId: string) => {
        try {
            await dispatch(blockSlotById(slotId)).unwrap();
            NotificationService.success("Slot erfolgreich blockiert!");
        } catch (error) {
            NotificationService.error("Fehler beim Blockieren des Slots.");
        }
    };

    const handleUnblockSlot = async (slotId: string) => {
        try {
            await dispatch(unblockSlotById(slotId)).unwrap();
            NotificationService.success("Slot erfolgreich freigegeben!");
        } catch (error) {
            NotificationService.error("Fehler beim Freigeben des Slots.");
        }
    };

    const handleConfirmSlot = async (slotId: string) => {
        try {
            await dispatch(confirmSlotById(slotId)).unwrap();
            NotificationService.success("Slot erfolgreich bestätigt!");
        } catch (error) {
            NotificationService.error("Fehler beim Bestätigen des Slots.");
        }
    };

    if (loading) {
        return <p>Daten werden geladen...</p>;
    }

    if (error) {
        return <p>Fehler: {error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Slot-Verwaltung</h1>
            <p>Hier sind alle verfügbaren und gebuchten Slots aufgelistet:</p>
            <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Datum</th>
                        <th className="border border-gray-400 px-4 py-2">Status</th>
                        <th className="border border-gray-400 px-4 py-2">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot: any) => (
                        <tr key={slot._id} className="hover:bg-gray-100">
                            <td className="border border-gray-400 px-4 py-2">
                                {new Date(slot.date).toLocaleString()}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">{slot.status}</td>
                            <td className="border border-gray-400 px-4 py-2 flex gap-2">
                                {slot.status === "available" && (
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                                        onClick={() => handleBlockSlot(slot._id)}
                                    >
                                        Blockieren
                                    </button>
                                )}
                                {slot.status === "blocked" && (
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                        onClick={() => handleUnblockSlot(slot._id)}
                                    >
                                        Freigeben
                                    </button>
                                )}
                                {slot.status === "booked" && (
                                    <>
                                        <button
                                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-4 rounded"
                                            onClick={() => handleConfirmSlot(slot._id)}
                                        >
                                            Bestätigen
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                            onClick={() => handleBlockSlot(slot._id)}
                                        >
                                            Blockieren
                                        </button>
                                    </>
                                )}
                                {slot.status === "confirmed" && (
                                    <span className="text-green-600 font-bold">Bestätigt</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSlotManagement;
