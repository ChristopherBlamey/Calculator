"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "./useAuth";

const INACTIVITY_WARNING_TIME = 15 * 60 * 1000;
const INACTIVITY_LOGOUT_TIME = 16 * 60 * 1000;

export function useInactivityTimeout() {
  const { signOut, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimeouts = useCallback(() => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const resetTimers = useCallback(() => {
    clearAllTimeouts();
    setShowWarning(false);
    setRemainingTime(0);

    if (!user) return;

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setRemainingTime(Math.floor((INACTIVITY_LOGOUT_TIME - INACTIVITY_WARNING_TIME) / 1000));
      
      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      logoutTimeoutRef.current = setTimeout(() => {
        signOut();
      }, INACTIVITY_LOGOUT_TIME - INACTIVITY_WARNING_TIME);
    }, INACTIVITY_WARNING_TIME);
  }, [user, signOut, clearAllTimeouts]);

  const handleActivity = useCallback(() => {
    if (user) {
      resetTimers();
    }
  }, [user, resetTimers]);

  const handleStayLoggedIn = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (!user) {
      clearAllTimeouts();
      setShowWarning(false);
      return;
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearAllTimeouts();
    };
  }, [user, handleActivity, resetTimers, clearAllTimeouts]);

  return {
    showWarning,
    remainingTime,
    handleStayLoggedIn,
    handleLogout: signOut,
  };
}
