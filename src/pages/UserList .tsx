import { useSelector } from "react-redux";
import { displayUsers } from "../feuture/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserList = () => {
  const allusers = useSelector(displayUsers);
  const users = allusers.filter((user) => user.isAdmin !== true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // Filterfunktion basierend auf Suchbegriff
  const filteredUsers = users.filter((user) =>
    user.customerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user: { _id: string }) => {
    navigate(`/user/${user._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Benutzerverwaltung</h1>
      <p className="mb-6">Hier sind alle Benutzer aufgelistet.</p>

      {/* Suchfeld */}
      <div className="mb-6">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Suchen nach Kundennummer oder E-Mail"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabelle */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                K-Nummer
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
               
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {user.customerNumber}
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
                
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 px-4 text-center text-gray-500 text-sm"
                >
                  Keine Benutzer gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
