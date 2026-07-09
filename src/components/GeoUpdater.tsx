"use client";
import React, { useEffect, useRef } from "react";
import { getSocket } from "../lib/socket";
const GeoUpdater = ({ userId }: { userId: string }) => {
  const socketRef = useRef<any>(null);
  useEffect(() => {
    if (!userId) {
      return;
    }
    if (!navigator.geolocation) {
      return;
    }
    socketRef.current = getSocket();
    socketRef.current.emit("identity", { userId: userId });
    console.log(socketRef.current?.io.uri);
    console.log(socketRef.current?.id);
    console.log(socketRef.current?.connected);
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        socketRef.current.emit("update-location", {
          userId,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0, // Always try to get a fresh location
        timeout: 10000, // Wait up to 10 seconds
      },
    );
    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [userId]);

  return null;
};

export default GeoUpdater;
