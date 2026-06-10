import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Navbar from "../../Utils/Navbar";
import type { Product } from "../../Types/Product";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id', flex: 0.3},
  { field: 'name', headerName: 'Name', flex: 3 },
  { field: 'type', headerName: 'Type', flex: 1, },
  { field: 'price', headerName: 'Price', flex: 1, type: 'number' },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/products/");
        const data = await response.json();
        setProducts(data.result ?? data);
      } catch (err: any) {
        setError("Error gathering products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-20" style={{maxHeight: 750}}>
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