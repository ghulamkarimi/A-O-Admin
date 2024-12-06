
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { displayUsers } from "../../feuture/reducers/userSlice";

const UserDetails = () => {
  const { userId } = useParams();
  const users = useSelector(displayUsers);
  const user = users.find((u) => u.email === userId);

  if (!user) {
    return <p>Benutzerdetails werden geladen...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Benutzerdetails</h1>
      <div className="mb-6">
        <img
          src={user.profile_photo || "https://via.placeholder.com/150"}
          alt="Profilbild"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-2xl font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-lg">E-Mail: {user.email}</p>
      </div>
    </div>
  );
};

export default UserDetails;
