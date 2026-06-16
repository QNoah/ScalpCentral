import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";
import { useState, useEffect, type FormEvent } from 'react';
import type { IUser } from "../../Types/UserDto";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', flex: 0.3},
  { field: 'firstName', headerName: 'F_Name', flex: 1 },
  { field: 'lastName', headerName: 'L_Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 3 },
  { field: 'role', headerName: 'Role', flex: 1 },
];

export default function UserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState({
    fName: "",
    lName: "",
    email: "",
    password: ""
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5231/api/users/users", {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Users failed with status ${response.status}.`);
      }

      const data = await response.json();
      setUsers(data.result ?? data);
    } catch {
      setError("Users konden niet worden geladen.");
    } finally {
      setLoading(false);
    }
  };

  async function handleCreateAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingAdmin(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5231/api/users/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          fName: adminForm.fName,
          lName: adminForm.lName,
          email: adminForm.email,
          password: adminForm.password
        })
      });

      if (!response.ok) {
        throw new Error(`Admin create failed with status ${response.status}.`);
      }

      setAdminForm({ fName: "", lName: "", email: "", password: "" });
      await fetchUsers();
    } catch {
      setError("Admin account kon niet worden aangemaakt.");
    } finally {
      setCreatingAdmin(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-4/5 mx-auto mt-10 border shadow rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Create admin account</h1>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-3" onSubmit={handleCreateAdmin}>
          <input className="border rounded p-2" placeholder="First name" value={adminForm.fName} onChange={event => setAdminForm(prev => ({ ...prev, fName: event.target.value }))} required />
          <input className="border rounded p-2" placeholder="Last name" value={adminForm.lName} onChange={event => setAdminForm(prev => ({ ...prev, lName: event.target.value }))} required />
          <input className="border rounded p-2" placeholder="Email" type="email" value={adminForm.email} onChange={event => setAdminForm(prev => ({ ...prev, email: event.target.value }))} required />
          <input className="border rounded p-2" placeholder="Password" type="password" value={adminForm.password} onChange={event => setAdminForm(prev => ({ ...prev, password: event.target.value }))} required />
          <button className="bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-60" disabled={creatingAdmin}>
            {creatingAdmin ? "Creating..." : "Create admin"}
          </button>
        </form>
      </div>
      <div className="flex justify-center mt-8" style={{maxHeight: 750}}>
        <Paper sx={{ width: '80%'}}>
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{sorting: {sortModel: [{field: 'id', sort: 'asc'}]}}}
            checkboxSelection
          />
          {error && <div style={{ color: "red", padding: 16 }}>{error}</div>}
        </Paper>
      </div>
    </div>
  );
}
