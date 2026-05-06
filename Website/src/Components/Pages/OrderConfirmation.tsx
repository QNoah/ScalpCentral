import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from "../PageParts/Button";
import Navbar from '../PageParts/Navbar';

export default function OrderConfirmation() {
  return (
    <>
    <Navbar/>
    <div className="flex justify-center flex-col text-center font-inter mx-10">
      <div className='text-6xl'>
      <CheckCircleIcon fontSize='inherit' color='success'/>
      </div>
      <h1 className="font-semibold mb-4">Order Confirmed!</h1>
      <p className="font-light">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
    </div>
    </>
  );
}
