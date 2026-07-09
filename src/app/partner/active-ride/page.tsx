"use client";

import { BookingStatus, IBooking } from "@/models/booking.model";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import RideChat from "@/components/RideChat";
import { useSelector } from "react-redux";
const LiveRideMap = dynamic(() => import("@/components/LiveRideMap"), {
  ssr: false,
});
const STATUS_LABEL: Record<
  BookingStatus,
  { label: string; sublabel: string; dot: string }
> = {
  idle: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
  },
  requested: {
    label: "Awaiting Confirmation",
    sublabel: "Booking is being processed",
    dot: "bg-amber-400",
  },
  awaiting_payment: {
    label: "Payment Pending",
    sublabel: "Customer payment is pending",
    dot: "bg-purple-400",
  },
  confirmed: {
    label: "Heading to Pickup",
    sublabel: "Drive to the pickup location",
    dot: "bg-amber-400",
  },
  started: {
    label: "Ride in Progress",
    sublabel: "Heading to drop location",
    dot: "bg-emerald-400",
  },
  completed: {
    label: "Ride Completed",
    sublabel: "Trip has ended successfully",
    dot: "bg-zinc-400",
  },
  cancelled: {
    label: "Ride Cancelled",
    sublabel: "This ride was cancelled",
    dot: "bg-red-400",
  },
  rejected: {
    label: "Ride Rejected",
    sublabel: "Ride was rejected",
    dot: "bg-red-400",
  },
  expired: {
    label: "Request Expired",
    sublabel: "Booking timed out",
    dot: "bg-orange-400",
  },
};
const Page = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [pickUpPos, setPickUpPos] = useState<[number, number] | null>(null);
  const [dropPos, setDropPos] = useState<[number, number] | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { userData } = useSelector((state: any) => state.user);
  const fetchActiveRide = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/partner/my-active");
      setBooking(res.data);
      const [pickLng, pickLat] = res.data.pickUpLocation.coordinates;
      setPickUpPos([pickLat, pickLng]);

      const [dropLng, dropLat] = res.data.dropLocation.coordinates;
      setDropPos([dropLat, dropLng]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActiveRide();
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDriverPos([lat, lon]);
      },
      (error) => {
        console.log("gps error", error);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const MAP_STATUS: Record<
    BookingStatus,
    "arriving" | "ongoing" | "completed"
  > = {
    idle: "arriving",
    requested: "arriving",
    awaiting_payment: "arriving",
    confirmed: "arriving",
    started: "ongoing",
    completed: "completed",
    cancelled: "completed",
    rejected: "completed",
    expired: "completed",
  };
  if (loading) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-white/40 text-sm tracking-widest uppercase font-medium">
            Loading Ride...
          </p>
        </div>
      </div>
    );
  }
  const cfg = STATUS_LABEL[booking?.bookingStatus! ?? "confirmed"];
  const router = useRouter();
  if (showChat) {
    return (
      <RideChat
        currentRole={userData.role}
        bookingId={booking?._id}
        userName={booking?.user?.name}
        driverName={booking?.driver?.name}
        onBack={() => setShowChat(false)}
      />
    );
  }
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      {/* Left Map */}
      <div className="relative flex-1 min-w-0">
        <div className="relative w-full h-[52vh] z-0">
          <LiveRideMap
            driverLocation={driverPos}
            pickupLocation={pickUpPos}
            dropLocation={dropPos}
            mapStatus={MAP_STATUS[booking?.bookingStatus!]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
        >
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            <span className="text-sm font-semibold">{cfg.label}</span>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto -mt-8 relative z-20 w-full max-w-5xl px-4 pb-6"
      >
        <div className="rounded-3xl bg-white shadow-xl border border-zinc-200 overflow-hidden">
          <div className="bg-zinc-950 px-6 py-5">
            <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-semibold">
              Driver Panel
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">{cfg.label}</h2>

            <p className="text-sm text-zinc-400 mt-1">{cfg.sublabel}</p>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-xs text-zinc-500">Fare</p>
                <p className="mt-1 text-2xl font-bold">
                  ₹{booking?.fare ?? "--"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Pickup
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 break-words">
                  {booking?.pickUpAddress || "Pickup address not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Drop
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 break-words">
                  {booking?.dropAddress || "Drop address not available"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(true)}
              className="w-full rounded-xl bg-zinc-900 py-3 text-white font-semibold transition hover:bg-zinc-800"
            >
              Chat with Customer
            </button>

            {booking?.bookingStatus === "confirmed" && (
              <button className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700">
                Start Ride
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
