export interface IInput{
    label?: string;
    type: string;
    value?: string | number;
    required?: boolean;
    styles?: string;
    maxNumber?: number;
    onChange?: (value: string) => void;
    onBlur?: () => void;
}