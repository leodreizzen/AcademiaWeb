import React, {HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute} from "react";
import clsx from "clsx";
import {FieldErrors, FieldName, FieldValues, UseFormRegisterReturn} from "react-hook-form";
import {ErrorMessage, FieldValuesFromFieldErrors} from "@hookform/error-message";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
interface FormFieldProps<T extends FieldValues> {
    label: string;
    type: HTMLInputTypeAttribute;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    required?: boolean;
    value?: string;
    className?: string;
    registerRes:  UseFormRegisterReturn<FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>>
    errors: FieldErrors<T>
    autoFocus?: boolean,
    disabled?: boolean;
}

export function FieldForm<T extends FieldValues>({label, type, autoComplete, className, required, value, registerRes, errors, autoFocus, disabled}: FormFieldProps<T>) {
    const inputId = `input-${registerRes.name}`
    return (
        <div className={clsx("space-y-2 flex flex-col", className)}>
            <Label htmlFor={inputId} className="text-gray-300 mb-1">{label}</Label>
            <Input type={type} className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500" autoComplete={autoComplete}
                   required={required} value={value} {...registerRes} id={inputId} autoFocus={autoFocus} disabled={disabled} />
            <ErrorMessage name={registerRes.name} errors={errors} as={<span className={"text-red-400 text-sm"}/>}/>
        </div>
    )

}