import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { backendUrl } from "../../App";

const roles = ["admin", "user", "staff", "manager"];
const statusOptions = ["active", "inactive", "suspended"];

export default function UserList({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/get-users`, {}, config);
      setUsers(res.data.users);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleSave = async (userId) => {
    try {
      const response = await axios.put(`${backendUrl}/api/user/update-role/${userId}/role`, { role: newRole }, config);
     if(response?.data?.success){
       toast.success(response?.data?.message || "Role updated");
     }
     else{
       toast.error(response?.data?.message || "Failed Updating Role");
     }
      setEditingRoleId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleStatusSave = async (userId) => {
    try {
      const response =await axios.put(`${backendUrl}/api/user/update-status/${userId}/status`, { status: newStatus }, config);
      if(response?.data?.success){
       toast.success(response?.data?.message || "Status updated");
     }
     else{
       toast.error(response?.data?.message || "Failed Updating Status");
     }
      setEditingStatusId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
     const response = await axios.delete(`${backendUrl}/api/user/delete-user/${userId}`, config);

      if(response?.data?.success){
       toast.success(response?.data?.message || "User Deleted");
       setUsers((prev) => prev.filter((user) => user._id !== userId));
     }
     
     else{
       toast.error(response?.data?.message || "Failed To Remove User");
     }
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading users...</p>;
  if (users.length === 0) return <p className="text-center mt-10 text-gray-500">No users found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">User Management</h1>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Verified</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{user.first_name} {user.last_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  {user.verified_email ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </td>

                {/* Role Cell */}
                <td className="px-4 py-3">
                  {editingRoleId === user._id ? (
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={user.role}
                        className="border rounded px-2 py-1"
                        onChange={(e) => setNewRole(e.target.value)}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() => handleRoleSave(user._id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 text-sm font-medium"
                        onClick={() => setEditingRoleId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{user.role}</span>
                      <button
                        className="text-blue-500 hover:underline text-sm"
                        onClick={() => {
                          setEditingRoleId(user._id);
                          setNewRole(user.role);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>

                {/* Status Cell */}
                <td className="px-4 py-3">
                  {editingStatusId === user._id ? (
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={user.status}
                        className="border rounded px-2 py-1"
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() => handleStatusSave(user._id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 text-sm font-medium"
                        onClick={() => setEditingStatusId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{user.status}</span>
                      <button
                        className="text-blue-500 hover:underline text-sm"
                        onClick={() => {
                          setEditingStatusId(user._id);
                          setNewStatus(user.status);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>

                {/* Delete Button */}
                <td className="px-4 py-3">
                  <button
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrashAlt className="inline-block" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
