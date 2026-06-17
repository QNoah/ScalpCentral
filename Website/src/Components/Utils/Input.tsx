import {type IInput } from "../Types/IInput";

export default function Input(prop: IInput){
    return(
<div>
    {prop.label && <span className="font-semibold">{prop.label}</span>}
    {prop.label && prop.required && <span>*</span>}
    <input
        type={prop.type}
        value={prop.value}
        required={prop.required}
        className={`bg-gray-200 ${prop.styles} rounded-md p-1 pl-2`}
        min={prop.minNumber}
        max={prop.maxNumber}
        minLength={prop.minLength}
        maxLength={prop.maxLength}
        step={prop.step}
        pattern={prop.pattern}
        placeholder={prop.placeholder}
        title={prop.title}
        onChange={e => prop.onChange?.(e.target.value)}
        onBlur={prop.onBlur}
    />
</div>
)
}
