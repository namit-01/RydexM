import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { delay } from "motion";
import { Bike, Car, Bus, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
const HeroSection = ({ onAuthrequired }) => {
  const router = useRouter();
  const { userData } = useSelector((state: any) => state.user);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/heroImage.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/60">
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl"
          >
            Book any Vehicle
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 mx-w-xl text-gray-300"
          >
            From daily rides to heavy transport all on one platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex gap-8 text-gray-300"
          >
            <Bike size={30}></Bike>
            <Car size={30}></Car>
            <Bus size={30}></Bus>
            <Truck size={30}></Truck>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 px-10 py-4 bg-white text-black rounded-full font-semibold shadow-xl"
            onClick={() => router.push("/user/book")}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
