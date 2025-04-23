import React, { useEffect, useState } from 'react';

const RoomTimer = ({ expiresAt ,onRoomExpired }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(expiresAt).getTime();
            const diff = end - now;

            if (diff <= 0) {
                clearInterval(countdown);
                setTimeLeft("Room closed");

                // Notify parent that the room is expired
        if (typeof onRoomExpired === "function") {
            onRoomExpired();
          }
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [expiresAt]);

    return <div style={{color:"black"}}><strong>Time Left:</strong> {timeLeft}</div>;
};

export default RoomTimer;
