import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  lastLogin?: string;
  createdAt?: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<Message | null>(null);

  const token = localStorage.getItem("ADMIN_TOKEN");

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (type: Message["type"], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000); // hide after 4s
  };

  // Delete user
  const deleteUser = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        showMessage("success", "User deleted successfully!");
      } else {
        showMessage("error", "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Registered Users</h2>

      {/* Message bar */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white font-medium transition-all ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full sm:w-1/2 p-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-sm text-gray-500">{filteredUsers.length} users found</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-green-50 text-left text-gray-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`transition-all duration-200 hover:bg-green-50 cursor-pointer ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-4 font-medium text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.phone || "-"}</td>
                  <td className="p-4 text-gray-600 capitalize">{u.role || "user"}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        u.lastLogin ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                      }`}
                    >
                      {u.lastLogin ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
