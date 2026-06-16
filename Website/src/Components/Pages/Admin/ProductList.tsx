import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";
import type { Product } from "../../Types/Product";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', flex: 0.3},
  { field: 'name', headerName: 'Name', flex: 3 },
  { field: 'type', headerName: 'Type', flex: 1, },
  { field: 'price', headerName: 'Price', flex: 1, type: 'number' },
];

export default function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5231/api/products/", {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Products failed with status ${response.status}.`);
      }

      const data = await response.json();
      setProducts(data.result ?? data);
    } catch {
      setError("Products konden niet worden geladen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.key]);

  return (
    <div>
      <Navbar />
      <div className="flex justify-end w-4/5 mx-auto mt-10">
        <button className="bg-blue-700 text-white px-4 py-2 rounded" onClick={fetchProducts} disabled={loading}>
          {loading ? "Loading..." : "Reload products"}
        </button>
      </div>
      <div className="flex justify-center mt-6" style={{maxHeight: 750}}>
        <Paper sx={{ width: '80%'}}>
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            initialState={{sorting: {sortModel: [{field: 'id', sort: 'asc'}]}}}
            onRowClick={(params) => navigate(`/product/edit/${params.row.id}`, {state: {product: params.row}})}
            checkboxSelection
          />
          {error && <div style={{ color: "red", padding: 16 }}>{error}</div>}
        </Paper>
      </div>
    </div>
  );
}
