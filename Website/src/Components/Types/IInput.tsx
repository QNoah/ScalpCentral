export interface IInput{
    label?: string;
    type: string;
    value?: string | number;
    required?: boolean;
    styles?: string;
    maxNumber?: number;
    minNumber?: number;
    minLength?: number;
    maxLength?: number;
    step?: number | string;
    pattern?: string;
    placeholder?: string;
    title?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
}
