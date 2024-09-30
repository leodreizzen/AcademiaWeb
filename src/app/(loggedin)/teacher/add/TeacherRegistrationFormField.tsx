import {FieldErrors, FieldName, FieldValues, UseFormRegisterReturn} from "react-hook-form";
import {HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute} from "react";
import {ErrorMessage, FieldValuesFromFieldErrors} from "@hookform/error-message";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {clsx} from "clsx";

interface TeacherRegistrationFormFieldProps<T extends FieldValues> {
    label: string;
    type: HTMLInputTypeAttribute;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    required?: boolean;
    value?: string;
    className?: string;
    registerRes:  UseFormRegisterReturn<FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>>
    errors: FieldErrors<T>
    autoFocus?: boolean,
}

export function TeacherRegistrationFormField<T extends FieldValues>({label, type, autoComplete, required, value, className, registerRes, errors, autoFocus}: TeacherRegistrationFormFieldProps<T>) {
    const inputId = `input-${registerRes.name}`
    return (
        <div className={clsx("space-y-2", className)}>
            <Label htmlFor={label} className="text-gray-300">{label}</Label>
            <Input type={type}
                   className="bg-gray-700 text-gray-100 border-gray-600"
                   autoComplete={autoComplete}
                   required={required} value={value} {...registerRes} id={inputId} autoFocus={autoFocus}/>
            <ErrorMessage name={registerRes.name} errors={errors} as={<span className={"text-red-400 text-sm"}/>}/>
        </div>
    )
}