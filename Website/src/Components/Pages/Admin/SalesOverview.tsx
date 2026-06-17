import { Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Navbar from "../../Utils/Navbar";

type SalesProduct = {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
};

type SalesOverviewData = {
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  averageOrderValue: number;
  products: SalesProduct[];
};

const columns: GridColDef[] = [
  { field: "productId", headerName: "Id", flex: 0.4 },
  { field: "productName", headerName: "Product", flex: 2 },
  { field: "quantitySold", headerName: "Sold", flex: 0.8, type: "number" },
  {
    field: "revenue",
    headerName: "Revenue",
    flex: 1,
    type: "number",
    valueFormatter: value => `€${Number(value).toFixed(2)}`
  }
];

function formatEuro(value: number) {
  return `€${value.toFixed(2)}`;
}

export default function SalesOverview() {
  const [overview, setOverview] = useState<SalesOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/order/sales-overview", {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Sales overview failed with status ${response.status}.`);
      }

      setOverview(await response.json());
    } catch {
      setError("Sales overview kon niet worden geladen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-4/5 mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Sales overview</h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60" onClick={fetchOverview} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">{formatEuro(overview?.totalRevenue ?? 0)}</p>
          </div>
          <div className="border shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Orders</p>
            <p className="text-2xl font-bold">{overview?.totalOrders ?? 0}</p>
          </div>
          <div className="border shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Items sold</p>
            <p className="text-2xl font-bold">{overview?.totalItemsSold ?? 0}</p>
          </div>
          <div className="border shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Average order</p>
            <p className="text-2xl font-bold">{formatEuro(overview?.averageOrderValue ?? 0)}</p>
          </div>
        </div>

        <Paper sx={{ width: "100%" }}>
          <DataGrid
            rows={overview?.products ?? []}
            columns={columns}
            loading={loading}
            getRowId={row => row.productId}
            initialState={{ sorting: { sortModel: [{ field: "quantitySold", sort: "desc" }] } }}
          />
        </Paper>
      </div>
    </div>
  );
}
