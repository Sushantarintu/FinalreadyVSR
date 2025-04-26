import React, { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const ActivityTracker = ({ sessionId ,roomid2,userId}) => {
  // Function to handle active state
  const handleOnActive = () => {
    if (!sessionId) return; // Ensure sessionId exists
    fetch('https://readyvsr.onrender.com/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, eventType: 'active',roomId:roomid2,userId }) // Sending active event type
    }).catch(err => console.error('Activity track failed:', err));
  };

  // Function to handle idle state
  const handleOnIdle = () => {
    console.log('User is idle');
    if (!sessionId) return;
    fetch('https://readyvsr.onrender.com/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, eventType: 'idle',roomId:roomid2,userId }) // Sending idle event type
    }).catch(err => console.error('Idle tracking failed:', err));
  };

  // Setting up idle timer
  useIdleTimer({
    timeout: 1000 * 60, // 1 minute idle timeout
    onActive: handleOnActive,
    onIdle: handleOnIdle,
    debounce: 500 // Delay for triggering the event
  });

  // Trigger initial activity when component is mounted
  useEffect(() => {
    handleOnActive(); // Track initial activity as "active"
  }, [sessionId]);

  return null; // No UI component needed, just background activity tracking
};

export default ActivityTracker;
