import type { IButton } from "../Types/IButton";

export default function Button(ButtonProps: IButton) {
  return <a className={`${ButtonProps.ButtonColor} ${ButtonProps.TextColor} rounded-lg py-2 w-80 font-inter font-md block`}>{ButtonProps.Message}</a>;
}
