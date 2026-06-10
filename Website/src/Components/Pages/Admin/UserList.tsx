import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";
import { useState, useEffect } from 'react';
import type { IUser } from "../../Types/UserDto";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', flex: 0.3},
  { field: 'firstName', headerName: 'Name', flex: 3 },
];

export default function UserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5231/api/users/users");
        const data = await response.json();
        setUsers(data.result ?? data);
      } catch (err: any) {
        setError("Error gathering users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-20" style={{maxHeight: 750}}>
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