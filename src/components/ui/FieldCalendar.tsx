"use client"
import React from "react";
import clsx from "clsx";
import {
    FieldErrors,
    FieldName,
    FieldValues,
    UseFormRegisterReturn,
    Controller,
    Control,
    Path,
    UseFormRegister, useForm
} from "react-hook-form";
import {ErrorMessage, FieldValuesFromFieldErrors} from "@hookform/error-message";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns"
import { es } from 'date-fns/locale';

import {ParentData, StudentDataWithoutGrade} from "@/lib/models/studentParent";
import {DateCalendar} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";

interface FormFieldProps<T extends FieldValues> {
    label: string;
    required?: boolean;
    className?: string;
    registerRes: ReturnType<UseFormRegister<T>> & {name: FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>}
    errors: ReturnType<typeof useForm<T>>["formState"]["errors"]
    control: Control<T>
}

export function FieldCalendar<T extends FieldValues>({label, className, control, registerRes, errors}: FormFieldProps<T>) {
    return (
        <div className={clsx("space-y-2 flex flex-col", className)}>
            <Label className="text-gray-300 mb-1">{label}</Label>
            <Controller
                name={registerRes.name}
                control={control}
                render={({ field }) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="dob"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                    "bg-gray-800 border-gray-700 text-gray-100"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP", {locale: es}) : <span>Elija una fecha</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800" align="start">
                            <DateCalendar value={dayjs(field.value)} onChange={(date: Dayjs) => field.onChange(date.toDate())} className="text-white"/>
                        </PopoverContent>
                    </Popover>
                )}
            />
            <ErrorMessage name={registerRes.name} errors={errors} as={<span className={"text-red-400 text-sm"}/>}/>
        </div>
    )

}