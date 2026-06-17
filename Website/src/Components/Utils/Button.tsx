import type { IButton } from "../Types/IButton";

export default function Button(ButtonProps: IButton) {
  return <a href={ButtonProps.LinkTo} className={`${ButtonProps.ButtonColor} ${ButtonProps.TextColor ?? ""} rounded-lg py-2 w-80 font-inter font-md block cursor-pointer`}>{ButtonProps.Message}</a>;
}
