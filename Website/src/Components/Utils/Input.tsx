import {type IInput } from "../Types/IInput";

export default function Input(prop: IInput){
    return(
<div className="mx-20">
    {prop.label && <p className="font-semibold">{prop.label}</p>}
    <input type={prop.type} value={prop.value} required={prop.required} className={`bg-gray-200 ${prop.styles} rounded-md p-1 pl-2`}/>
</div>
)
}