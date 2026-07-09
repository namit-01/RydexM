"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Bike,
  Car,
  CircleDashed,
  MapPin,
  Navigation,
  Package,
  RefreshCcw,
  Search,
  Truck,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
const SearchMap = dynamic(() => import("@/components/SearchMap"), {
  ssr: false,
});
import axios from "axios";
import VehicleCard from "@/components/VehicleCard";
import dynamic from "next/dynamic";

const SearchContent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [pickup, setPickUp] = useState(params.get("pickup") || "");
  const [drop, setDrop] = useState(params.get("drop") || "");
  const mobile = params.get("mobile");
  const pickuplat = params.get("pickuplat");
  const pickuplon = params.get("pickuplon");
  const droplat = params.get("droplat");
  const droplon = params.get("droplon");
  const vehicle = params.get("vehicle") || "";
  const [vehilces, setVehicles] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [km, setKm] = useState<number>();

  console.log(pickup);
  const VEHICLE_META: any = {
    bike: {
      label: "Bike",
      Icon: Bike,
    },
    car: {
      label: "Car",
      Icon: Car,
    },
    loading: {
      label: "Loading",
      Icon: Package,
    },
    truck: {
      label: "Truck",
      Icon: Truck,
    },
    auto: {
      label: "Auto",
      Icon: CircleDashed, // Replace with a better icon if you prefer
    },
  };
  const meta = VEHICLE_META[vehicle];
  const getNearBy = async (lat, lon, vehicleType) => {
    try {
      setLoading(true);
      const long = Number(lon);
      const lati = Number(lat);

      const { data } = await axios.post("/api/vehicles/near-by", {
        lat: lati,
        lon: long,
        vehicleType,
      });

      setVehicles(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    getNearBy(pickuplat, pickuplon, vehicle);
  }, [pickuplat, pickuplon, vehicle, pickup]);
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-x-hidden">
      <div className="absolute top-5 left-3 z-50">
        <motion.button
          whileTap={{ scale: 0.08 }}
          onClick={() => {
            console.log("clicked");
            router.push("/user/book");
          }}
          className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-zinc-900"></ArrowLeft>
        </motion.button>
      </div>
      <div className="relative w-full h-[52vh] z-0">
        <SearchMap
          pickup={pickup}
          drop={drop}
          onChange={(p: string, d: string) => {
            setPickUp(p);
            setDrop(d);
          }}
          onDistance={setKm}
        />
      </div>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        className="relative z-20 -mt-10 bg-white rounded-t-[28px] border-t border-zinc-200 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] pt-5 pb-20 min-h-[52vh]"
      >
        <div className="px-5 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden mb-5"
          >
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                <div
                  className="w-px flex-1 bg-zinc-300 my-1"
                  style={{ minHeight: 14 }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-0.5">
                  Pickup
                </p>
                <p className="text-sm text-zinc-900 font-semibold leading-snug truncate">
                  {pickup || "-"}
                </p>
              </div>
              <MapPin
                size={14}
                className="text-zinc-400 flex-shrink-0 mt-1.5"
              />
            </div>
            <div className="flex gap-3 px-4 py-3 border-b border-zinc-100 ">
              <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-0.5">
                  Drop
                </p>
                <p className="text-sm text-zinc-900 font-semibold leading-snug truncate">
                  {drop || "-"}
                </p>
              </div>
              <Navigation
                size={14}
                className="text-zinc-400 flex-shrink-0 mt-1.5"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-4"
          >
            <div>
              <h2 className="text-zinc-900 text-lg font-black tarcking-tight">
                {loading
                  ? "Finding vehicles"
                  : vehilces?.length > 0
                    ? "Available"
                    : "No nearby vehicles"}
              </h2>
              {meta && (
                <div className="text-zinc-400 text-xs mt-0.5">
                  {meta.label} rides near you
                </div>
              )}
            </div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3py-rounded-full"
                >
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300 border-t-zinc-700 animate-spin"></div>
                  <span className="text-zinc text-xs font-semibold">
                    Searching
                  </span>
                </motion.div>
              ) : vehilces?.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5"
                >
                  <Zap
                    size={18}
                    className="fill-emerald-600 text-emerald-600"
                  />
                  <span className="text-xs font-bold text-emerald-700">
                    Live
                  </span>
                </motion.div>
              ) : (
                <div></div>
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {!loading && vehilces?.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="flex flex-col items-center justify-center py-14 text-center"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100">
                  <Search className="h-8 w-8 text-zinc-400" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-900">
                  No {meta.label} Found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  We couldn't find any nearby{" "}
                  {meta.label?.toLowerCase() || "vehicle"} drivers at the
                  moment. Please try again in a few minutes.
                </p>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => getNearBy(pickuplat, pickuplon, vehicle)}
                >
                  <RefreshCcw className="h-5 w-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehilces?.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.66,
                  duration: 38,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <VehicleCard
                  vehicle={v}
                  distance={km}
                  onBook={() => {
                    const url = new URLSearchParams({
                      pickup,
                      drop,
                      vehicle: v.type,
                      driverId: v.owner,
                      vehicleId: String(v._id),
                      fare: String(
                        Math.round(v.baseFare! + v.pricePerKM! * km),
                      ),
                      pickUpLat: String(pickuplat),
                      pickUpLon: String(pickuplon),
                      dropLat: String(droplat),
                      dropLon: String(droplon),
                      mobile: String(mobile),
                    });
                    router.push(`/user/checkout?${url.toString()}`);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchContent;
