import { useDispatch } from "react-redux";
import { AppDispatch } from "../feuture/store/index";
import { userLogoutApi } from "../feuture/reducers/userSlice";
import { NotificationService } from "../service/NotificationService";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LogoutComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(userLogoutApi()).unwrap();
      NotificationService.success("Erfolgreich abgemeldet!");
      navigate("/login");
    } catch (error) {
      NotificationService.error("Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // Zurück zur vorherigen Seite
  };

  return (
    <div className="flex items-center justify-center py-10 background text-white"
    style={{ backgroundImage: "url('/homeBackground.jpg')"  }}
    >
      <div className="bg-black/70 rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <MdLogout className="text-6xl text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Möchten Sie sich abmelden?</h2>
        <p className=" mb-4">
          Nach der Abmeldung können Sie Ihre Buchungen oder Verwaltung nicht mehr anzeigen oder bearbeiten.
        </p>
        <p className=" mb-6">
          Sie müssen sich erneut anmelden, um Zugang zu diesen Funktionen zu erhalten.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Abmelden
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
