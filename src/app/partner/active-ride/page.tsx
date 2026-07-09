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
  /* pickup OTP */

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  /* Drop OTP */
  const [dropOtpMode, setDropOtpMode] = useState(false);
  const [dropOtp, setDropOtp] = useState("");
  const [loadingDropOtp, setLoadingDropOtp] = useState(false);
  const [dropOtpError, setDropOtpError] = useState("");
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
            {booking?.bookingStatus === "confirmed" && !otpVerified && (
              <div className="space-y-3">
                {!otpMode ? (
                  <button
                    onClick={() => setOtpMode(true)}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700"
                  >
                    Start Ride
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-zinc-200 p-5 space-y-4"
                  >
                    <h3 className="text-lg font-semibold">Verify Pickup OTP</h3>

                    <p className="text-sm text-zinc-500">
                      Ask the customer for the pickup OTP before starting the
                      ride.
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6 digit OTP"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    {otpError && (
                      <p className="text-sm text-red-500">{otpError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={
                          // Call Send OTP API here
                          async () => {
                            try {
                              const bookingId = booking?._id;

                              const { data } = await axios.post(
                                "/api/partner/bookings/otp/pickup/send",
                                { bookingId },
                              );
                              console.log(data);
                            } catch (err) {
                              console.log(err.response?.status);
                              console.log(err.response?.data);
                            }
                          }
                        }
                        className="flex-1 rounded-xl border border-zinc-300 py-3 font-semibold hover:bg-zinc-100"
                      >
                        Send OTP
                      </button>

                      <button
                        disabled={loadingOtp}
                        onClick={async () => {
                          try {
                            setLoadingOtp(true);
                            setOtpError("");

                            // Verify OTP API
                            // await axios.post("/api/partner/verify-pickup-otp", {
                            //   bookingId: booking?._id,
                            //   otp,
                            // });

                            const bookingId = booking?._id;

                            const { data } = await axios.post(
                              "/api/partner/bookings/otp/pickup/verify",
                              { bookingId, otp },
                            );

                            setOtpVerified(true);
                            setOtpMode(false);

                            // fetchActiveRide();
                          } catch (err: any) {
                            setOtpError("Invalid OTP");
                          } finally {
                            setLoadingOtp(false);
                          }
                        }}
                        className="flex-1 rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {loadingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setOtpMode(false);
                        setOtp("");
                        setOtpError("");
                      }}
                      className="w-full text-sm text-zinc-500 hover:text-zinc-900"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>
            )}
            {booking?.bookingStatus === "started" && (
              <div className="space-y-3">
                {!dropOtpMode ? (
                  <button
                    onClick={() => setDropOtpMode(true)}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700"
                  >
                    Complete Ride
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-zinc-200 p-5 space-y-4"
                  >
                    <h3 className="text-lg font-semibold">Verify Drop OTP</h3>

                    <p className="text-sm text-zinc-500">
                      Ask the customer for the pickup OTP before starting the
                      ride.
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      value={dropOtp}
                      onChange={(e) =>
                        setDropOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 6 digit OTP"
                      className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    {otpError && (
                      <p className="text-sm text-red-500">{otpError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={
                          // Call Send OTP API here
                          async () => {
                            try {
                              const bookingId = booking?._id;

                              const { data } = await axios.post(
                                "/api/partner/bookings/otp/drop/send",
                                { bookingId },
                              );
                              console.log(data);
                            } catch (err) {
                              console.log(err.response?.status);
                              console.log(err.response?.data);
                            }
                          }
                        }
                        className="flex-1 rounded-xl border border-zinc-300 py-3 font-semibold hover:bg-zinc-100"
                      >
                        Send OTP
                      </button>

                      <button
                        disabled={loadingOtp}
                        onClick={async () => {
                          try {
                            setLoadingOtp(true);
                            setOtpError("");

                            // Verify OTP API
                            // await axios.post("/api/partner/verify-pickup-otp", {
                            //   bookingId: booking?._id,
                            //   otp,
                            // });

                            const bookingId = booking?._id;
                            const otp = dropOtp;
                            const { data } = await axios.post(
                              "/api/partner/bookings/otp/drop/verify",
                              { bookingId, otp },
                            );

                            setDropOtp(false);

                            // fetchActiveRide();
                          } catch (err: any) {
                            setOtpError("Invalid OTP");
                            console.log(err.response?.status);
                            console.log(err.response?.data);
                          } finally {
                            setLoadingOtp(false);
                          }
                        }}
                        className="flex-1 rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {loadingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setOtpMode(false);
                        setOtp("");
                        setOtpError("");
                      }}
                      className="w-full text-sm text-zinc-500 hover:text-zinc-900"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
