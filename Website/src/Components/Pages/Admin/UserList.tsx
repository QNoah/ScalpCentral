import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";
import { useState, useEffect } from 'react';
import type { IUser } from "../../Types/UserDto";
import { useAuth } from "../../Functionalities/AuthContext";

export default function UserList() {
  const { user } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

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

  async function updateUserRole(id: number, role: "Admin" | "User") {
    setUpdatingUserId(id);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5231/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error(`Role update failed with status ${response.status}.`);
      }

      await fetchUsers();
    } catch {
      setError("Rol kon niet worden aangepast.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function deleteUser(id: number) {
    if (!window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) {
      return;
    }

    setUpdatingUserId(id);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5231/api/users/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}.`);
      }

      await fetchUsers();
    } catch {
      setError("Gebruiker kon niet worden verwijderd.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', flex: 0.3},
    { field: 'firstName', headerName: 'F_Name', flex: 1 },
    { field: 'lastName', headerName: 'L_Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 3 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.8,
      sortable: false,
      renderCell: params => {
        const row = params.row as IUser;
        const isCurrentUser = row.id === user?.id;
        const isAdmin = row.role === "Admin";
        const disabled = updatingUserId === row.id || isCurrentUser;

        return (
          <div className="flex gap-2">
            <button
              className="bg-blue-700 text-white px-2 py-1 rounded disabled:opacity-50"
              disabled={disabled}
              onClick={event => {
                event.stopPropagation();
                updateUserRole(row.id, isAdmin ? "User" : "Admin");
              }}
            >
              {isAdmin ? "Make user" : "Make admin"}
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
              disabled={disabled}
              onClick={event => {
                event.stopPropagation();
                deleteUser(row.id);
              }}
            >
              Delete
            </button>
          </div>
        );
      }
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-4/5 mx-auto mt-10 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60" onClick={fetchUsers} disabled={loading}>
          {loading ? "Loading..." : "Reload users"}
        </button>
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
