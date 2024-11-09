'use client'
import "@/hideArrows.css"
import React, {useEffect, useState} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {AlertTriangle, KeyRound, Mail, Signature} from "lucide-react"
import TimeoutButton from "@/components/ui/signatures/TimeoutButton"
import {ErrorMessage} from "@hookform/error-message"
import {useForm} from "react-hook-form"
import {SignatureTokenData, SignatureTokenModel} from "@/lib/models/signature"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    sendExamMarkToken,
    sendReprimandToken,
    SendTokenResult,
    signExamMark,
    signReprimand
} from "@/lib/actions/signatures";
import {CircularProgress} from "@mui/material";

export type SignButtonWithDialogProps = {
    type: "examMark",
    examMarkId: number
} | {
    type: "reprimand",
    reprimandId: number
}

function SignDialogContent({onClose, sendTokenResult, onResendClick, ...props}: SignButtonWithDialogProps & {
    onClose?: () => void,
    sendTokenResult: SendTokenResult | null
    onResendClick: Parameters<typeof TimeoutButton>[0]["onClick"],
}) {
    async function submit(data: SignatureTokenData) {
        let result;
        if (props.type === "examMark") {
            result = await signExamMark(data.token, props.examMarkId)
        } else if (props.type === "reprimand") {
            result = await signReprimand(data.token, props.reprimandId)
        } else
            throw new Error("Unknown signature type")
        if (result.success) {
            alert("Firmado correctamente");
            onClose?.();
        } else
            alert(result.error);
    }

    let signatureTypeName;
    if (props.type === "examMark") {
        signatureTypeName = "nota de examen"
    } else if (props.type === "reprimand") {
        signatureTypeName = "amonestación"
    }

    let dialogContentChild;
    if (!sendTokenResult)
        dialogContentChild = <div className="flex items-center justify-center">
            <CircularProgress/>
        </div>

    if (sendTokenResult) {
        if (sendTokenResult.success || sendTokenResult.errorType == "cooldown")
            dialogContentChild = <SignDialogForm onSubmit={submit} sendTokenResult={sendTokenResult} onResendClick={onResendClick}/>
        else {
            dialogContentChild = <div className="flex flex-col items-center text-white">
                <AlertTriangle className="h-16 w-16 text-red-500" />
                <h2>Se ha producido un error</h2>
                <p>{sendTokenResult.errorMessage}</p>
            </div>
        }
    }


    return (
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800" ovelayClassName="!bg-black/90">
            <DialogHeader>
                <DialogTitle className="text-center dark:text-white">Firmar {signatureTypeName}</DialogTitle>
            </DialogHeader>
            {dialogContentChild}
        </DialogContent>
    )

}

function SignDialogForm({onSubmit, sendTokenResult, onResendClick}: {
    onSubmit: (data: SignatureTokenData) => void,
    onResendClick: Parameters<typeof TimeoutButton>[0]["onClick"],
    sendTokenResult: SendTokenResult & ({
        success: true
    } | {
        errorType: "cooldown"
    })
}) {
    const {
        register,
        handleSubmit,
        formState
    } = useForm<SignatureTokenData>({resolver: zodResolver(SignatureTokenModel), mode: "all"})


    return (
        <>
            <div className="flex flex-col items-center space-y-3 p-2">
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                    Es necesario validar tu identidad para firmar.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">

                    {sendTokenResult.success && <>
                        <Mail className="h-5 w-5"/>
                        <span>Se ha enviado un código por correo electrónico.</span>
                    </>}
                    {!sendTokenResult.success && sendTokenResult.errorType == "cooldown" && <>
                        <Mail className="h-6 w-6"/>
                        <span>Ya has recibido un código recientemente. Revisa tu correo.</span>
                    </>}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full items-center">
                    <div className="relative w-7/12 mb-2 flex justify-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400"/>
                        </div>
                        <Input
                            type="number"
                            className="pr-3 w-full dark:bg-gray-700 dark:text-white text-lg font-medium rounded-full hide-arrows placeholder-shown:text-sm text-center"
                            placeholder="Introduce el código"
                            min={0}
                            {...register("token")}
                        />
                    </div>


                    <ErrorMessage
                        name="token"
                        errors={formState.errors}
                        render={({message}) => <p className="text-red-500 text-sm">{message}</p>}
                    />
                    <div className="flex w-full space-x-2 mt-4">
                        <TimeoutButton
                                       initialRemainingTime={sendTokenResult.cooldownTime}
                                       onClick={onResendClick}
                                       type="button"
                                       className="flex-1"
                        >
                            <Mail className="h-5 w-5 mr-1"/>
                            Reenviar
                        </TimeoutButton>
                        <Button
                            disabled={!formState.isValid}
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4  transition duration-300 ease-in-out transform hover:scale-105">
                            Firmar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default function SignButtonWithDialog(props: SignButtonWithDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [sendTokenResult, setSendTokenResult] = useState<SendTokenResult | null>(null)

    async function openDialog() {
        setDialogOpen(true);
        await sendToken();
    }

    async function sendToken(){
        if (props.type === "examMark") {
            const res = await sendExamMarkToken(props.examMarkId)
            setSendTokenResult(res)
            return res;
        } else if (props.type === "reprimand") {
            const res = await sendReprimandToken(props.reprimandId)
            setSendTokenResult(res)
            return res;
        }
        else
            throw new Error("Unknown signature type")
    }

    function closeDialog() {
        setDialogOpen(false);
        setSendTokenResult(null);
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            closeDialog()
        }
        else
            setDialogOpen(true)
    }

    async function handleResend() {
        const result = await sendToken();
        if(result.success || result.errorType == "cooldown"){
            return result.cooldownTime;
        }
        else
            return 0;

    }

    return (
        <>
            <Button className="w-full" onClick={openDialog}>
                <Signature className="mr-2 h-4 w-4"/>
                Firmar
            </Button>

            <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
                {dialogOpen && <SignDialogContent {...props} onClose={closeDialog} sendTokenResult={sendTokenResult} onResendClick={handleResend}/>}
            </Dialog>
        </>
    )
}