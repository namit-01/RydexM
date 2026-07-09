"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import AuthModel from "./AuthModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { ChevronRight, ChevronRightIcon, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
const Nav_items = ["Home", "Bookings", "aboutus", "Contact"];
const Nav = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState();
  const handleLogOut = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setProfileOpen(false);
  };
  const pendingCountCall = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/bookings/pending-requests-count",
      );
      setPendingCount(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (userData) {
      pendingCountCall();
    }
  }, [userData]);
  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-3 left-1/2 -translate-x-1/2
          w-[94%] md:w-[86%]
          z-50 rounded-full bg-[#0B0B0B] text-white
          shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-3">
          <Image src={"/logo.png"} alt="logo" width={44} height={44} priority />
          <div className="hidden md:flex items-center gap-10">
            {userData?.role == "partner" ? (
              <>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/pending-requests"}
                >
                  Pending Requests
                  <span className="absolute -top-2 -right-5 w-6 h-6 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingCount ?? 0}
                  </span>
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/bookings"}
                >
                  Bookings
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/active-ride"}
                >
                  Active Ride
                </Link>
              </>
            ) : (
              Nav_items.map((i, index) => {
                let href;
                if (i == "Home") {
                  href = `/`;
                } else {
                  href = `/${i.toLowerCase()}`;
                }

                const active = href == pathName;
                return (
                  <Link
                    key={index}
                    href={href}
                    className={`text-sm  font-medium transition ${active ? "text-white " : "text-gray-400 hover:text-white"}`}
                  >
                    {i}
                  </Link>
                );
              })
            )}
          </div>
          <div className="flex items-center gap-3 relative">
            <div className="hidden md:block relative">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border"
                      >
                        <div className="p-5">
                          <p className="font-semibold text-lg">
                            {userData.name}
                          </p>
                          <p className="text-xs uppercase text-gray-500 mb-4">
                            {userData.role}
                          </p>
                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                              onClick={() =>
                                router.push("/partner/onboarding/vehicle")
                              }
                            >
                              Become A Partner
                              <ChevronRight size={16} className="ml-auto" />
                            </div>
                          )}
                          <button
                            className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                            onClick={handleLogOut}
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
            <div className="md:hidden">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                </>
              )}
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[85px] left-1/2 -translate-x-1/2 w-[92%] bg-black rounded-2xl shadow-2xl z-40 md:hidden overflow-hidden"
            >
              <div className="flex flex-col divide-y divide-white/10">
                {Nav_items.map((i, index) => {
                  let href;
                  if (i == "Home") {
                    href = `/`;
                  } else {
                    href = `/${i.toLowerCase()}`;
                  }

                  return (
                    <Link
                      key={index}
                      href={href}
                      className="px-6 py-4 text-white hover:bg-gray-200 hover:text-black"
                    >
                      {i}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            ></motion.div>

            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-5">
                <p className="font-semibold text-lg">{userData.name}</p>
                <p className="text-xs uppercase text-gray-500 mb-4">
                  {userData.role}
                </p>
                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                    onClick={() => router.push("/partner/onboarding/vehicle")}
                  >
                    Become A Partner
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
                )}
                <button
                  className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                  onClick={handleLogOut}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Nav;
