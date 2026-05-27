import { useParams } from "react-router-dom";
import Navbar from "../../Utils/Navbar";

export default function ProductEdit(){
    const {id} = useParams<{id: string}>();
    const productId = id ? Number(id) : NaN;
    const invalid = !id || Number.isNaN(productId);

    if(invalid){ 
        return(
        <div>
            <Navbar/>
        (<h1 className="text-center mt-5">Unknown product</h1>)
        </div>
    );
}

    return(
        <div>
            <Navbar/>
        <div className="flex justify-center ">
            <div className="bg-gray-200 w-1/2 text-center">
            <h1>test</h1></div>
        </div>
        </div>
    )
}