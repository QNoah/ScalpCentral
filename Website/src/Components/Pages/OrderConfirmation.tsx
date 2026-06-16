import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "../Utils/Button";
import Navbar from "../Utils/Navbar";

export default function OrderConfirmation() {
  return (
    <>
      <Navbar />
      <div className="mx-10 mt-12 text-center">
        <div className="font-inter mb-5">
          <div className="text-6xl">
            <CheckCircleIcon fontSize="inherit" color="success" />
          </div>
          <h1 className="font-semibold mb-4">Order Confirmed!</h1>
          <p className="font-light">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>
        <div className="flex flex-col text-center justify-center items-center gap-3">
          <Button Message="Continue Shopping" ButtonColor="bg-white" LinkTo="/search"/>
          <Button Message="View Order History" ButtonColor="bg-primary" TextColor="text-white" LinkTo="/order-history"/>
        </div>

      </div>
    </>
  );
}
