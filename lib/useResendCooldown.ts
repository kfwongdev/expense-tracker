import { useEffect, useRef, useState } from "react";

const COOLDOWN_SECONDS = 30;

export const useResendCooldown = () => {
    const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const restart = () => setSecondsLeft(COOLDOWN_SECONDS);

    return { secondsLeft, canResend: secondsLeft === 0, restart };
};
