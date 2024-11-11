import React, {MouseEventHandler, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

export default function TimeoutButton({initialRemainingTime, onClick, children, ...props}: {
    initialRemainingTime: number,
    onClick: (event: Parameters<MouseEventHandler<HTMLButtonElement>>[0]) => Promise<number>,
} & React.ComponentProps<typeof Button>) {
    const [timeLeft, setTimeLeft] = useState(initialRemainingTime)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [timeLeft])

    async function handleClick (e: Parameters<NonNullable<typeof onClick>>[0]) {
        setDisabled(true);
        const cooldown = await onClick(e);
        setTimeLeft(cooldown);
        setDisabled(false);
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <Button
            {...props}
            onClick={handleClick}
            disabled={timeLeft > 0 || disabled}
            className="flex-1 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
        >
            {children}
            {timeLeft > 0 && <span className="ml-1">({formatTime(timeLeft)})</span>}
        </Button>
    )
}