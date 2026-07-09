"use client";

import { BookingStatus, IBooking } from "@/models/booking.model";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import RideChat from "@/components/RideChat";
import { useSelector } from "react-redux";
import { getSocket } from "@/lib/socket";
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
    if (userData?.role !== "partner") return;
    const socket = getSocket();
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDriverPos([lat, lon]);
        socket.emit("driver-location-update", {
          bookingId: booking?._id,
          latitude: lat,
          longitude: lon,
        });
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
  useEffect(() => {
    if (userData?.role !== "user") return;

    const socket = getSocket();

    socket.on("driver-location-update", (data) => {
      setDriverPos([data.latitude, data.longitude]);
    });

    return () => {
      socket.off("driver-location-update");
    };
  }, [userData?.role]);
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
  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8 text-center"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
            <svg
              className="h-12 w-12 text-zinc-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 17l4 4 4-4m-4-5v9M4 5h16"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-zinc-900">
            No Active Ride
          </h2>

          <p className="mt-3 text-sm text-zinc-500 leading-6">
            You're currently not assigned to any ride. New ride requests will
            appear here automatically.
          </p>

          <div className="mt-8 rounded-2xl bg-zinc-100 p-5 text-left">
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="font-semibold text-emerald-600">Available</span>
            </div>

            <div className="mt-4 flex justify-between">
              <span className="text-zinc-500">Current Ride</span>
              <span className="font-semibold">0</span>
            </div>
          </div>

          <button
            onClick={fetchActiveRide}
            className="mt-8 w-full rounded-2xl bg-zinc-900 py-4 text-white font-semibold hover:bg-black transition"
          >
            Refresh
          </button>

          <button
            onClick={() => router.push("/")}
            className="mt-3 w-full rounded-2xl border border-zinc-300 py-4 font-semibold text-zinc-700 hover:bg-zinc-100 transition"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }
  if (booking?.bookingStatus === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          <div className="bg-emerald-600 px-8 py-10 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-3xl font-bold text-white">
              Ride Completed
            </h1>

            <p className="mt-2 text-emerald-100 text-center">
              Thank you! The trip has been completed successfully.
            </p>
          </div>

          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-xs text-zinc-500">Fare</p>
                <p className="text-2xl font-bold">₹{booking?.fare}</p>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4">
                <p className="text-xs text-zinc-500">Payment</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {booking?.paymentStatus}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Customer
              </p>
              <p className="mt-1 font-semibold">{booking?.user?.name}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Pickup
              </p>
              <p className="mt-1 text-sm">{booking?.pickUpAddress}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Drop
              </p>
              <p className="mt-1 text-sm">{booking?.dropAddress}</p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full rounded-2xl bg-zinc-900 py-4 text-white font-semibold hover:bg-black transition"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
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
              <button
                onClick={() => setShowChat(true)}
                className="w-full rounded-xl bg-zinc-900 py-3 text-white font-semibold transition hover:bg-zinc-800"
              >
                {userData?.role === "partner"
                  ? "Chat with customer"
                  : "Chat with driver"}
              </button>
            </button>

            {booking?.bookingStatus === "confirmed" &&
              userData.role == "partner" && (
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
