import { useSelector } from "react-redux";
import { displayUsers } from "../feuture/reducers/userSlice";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const users = useSelector(displayUsers);
  const navigate = useNavigate();

  const handleUserClick = (user: { _id: string }) => {
    navigate(`/user/${user._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Benutzerverwaltung</h1>
      <p className="mb-6">Hier sind alle Benutzer aufgelistet.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Benutzer-ID
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Profilbild
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Vorname
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Nachname
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                E-Mail
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleUserClick(user)}>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {user._id}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <img
                    src={user.profile_photo || "https://via.placeholder.com/50"}
                    alt="Profilbild"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {user.firstName}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {user.lastName}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Bearbeiten</button>
                  <button className="text-red-500 hover:text-red-700">Löschen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
