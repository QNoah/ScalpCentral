import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 20 },
  { field: 'firstName', headerName: 'First name', flex: 1},
  { field: 'lastName', headerName: 'Last name',  flex: 1},
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    flex: 1
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 1,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };


export default function ProductList(){
    return(
        <div>
            <Navbar/>
            <div className="flex justify-center mt-20">
               <Paper sx={{ height: 400, width: '80%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        // initialState={{ pagination: { paginationModel } }}
        // pageSizeOptions={[5, 10]}
        checkboxSelection
        // sx={{ border: 0 }}
      />
    </Paper>
        </div>
        </div>
    )
}