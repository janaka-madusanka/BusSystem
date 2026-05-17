import { useEffect, useState } from "react";
import userService from "../../api/services/user.service.js";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "conductor",
});

const handleCreateUser = async () => {
  try {
    await userService.createUser(form);
    setShowModal(false);

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "conductor",
    });

    fetchUsers(); // refresh table
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to create user");
  }
};
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await userService.getAllUsers();
      const data = res?.users || res?.data || res || [];
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const name =
      `${u.firstName || ""} ${u.lastName || ""} ${u.name || ""}`.toLowerCase();

    const matchSearch =
      name.includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "All" ? true : u.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen bg-[#080d16] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-2xl font-bold">Manage Users</h1>
    <p className="text-slate-500 text-sm">
      Admin user management panel
    </p>
  </div>

  <div className="flex gap-2">
    <button
      onClick={fetchUsers}
      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10"
    >
      Refresh
    </button>

    <button
      onClick={() => setShowModal(true)}
      className="px-4 py-2 rounded-xl bg-[#4f8ef7] text-white text-sm hover:bg-[#3a7aef]"
    >
      + Create User
    </button>
  </div>
</div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-64"
        />

        <select
  value={roleFilter}
  onChange={(e) => setRoleFilter(e.target.value)}
  className="bg-[#0f1520] border border-white/10 text-white rounded-xl px-4 py-2 text-sm"
>
  <option value="All">All Roles</option>
  <option value="admin">Admin</option>
  <option value="conductor">Conductor</option>
  <option value="passenger">Passenger</option>
</select>
      </div>

      {/* CONTENT */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1520] overflow-hidden">

        {/* TABLE */}
        <table className="w-full text-sm">
          
          <thead className="bg-white/5 text-slate-400 text-left">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-red-400">
                  {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">
                    {u.firstName || u.lastName
                      ? `${u.firstName || ""} ${u.lastName || ""}`
                      : u.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {u.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-md bg-[#4f8ef7]/15 text-[#4f8ef7]">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* FOOTER COUNT */}
      <p className="text-xs text-slate-600 mt-4 text-center">
        Showing {filteredUsers.length} users
      </p>

      {showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    
    <div className="bg-[#0f1520] border border-white/10 rounded-2xl p-6 w-[420px]">

      <h2 className="text-lg font-semibold mb-4">
        Create User
      </h2>

      <div className="flex flex-col gap-3">

        <input
          placeholder="First Name"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
  className="bg-[#0f1520] border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
>
  <option value="admin" className="bg-[#0f1520] text-white">
    Admin
  </option>
  <option value="conductor" className="bg-[#0f1520] text-white">
    Conductor
  </option>
</select>

      </div>

      <div className="flex justify-end gap-2 mt-5">

        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 text-sm text-slate-400"
        >
          Cancel
        </button>

        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-[#4f8ef7] text-white rounded-xl text-sm"
        >
          Create
        </button>

      </div>
    </div>
  </div>
)}
    </div>
    
  );
}