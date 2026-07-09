"use client";
import { RootState } from "@/redux/store";
import axios from "axios";
import {
  CheckCircle2,
  Clock,
  Truck,
  User,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Kpi from "./Kpi";
import TabButton from "./TabButton";
import { AnimatePresence, motion } from "motion/react";
import ContentList from "./ContentList";
import { signOut } from "next-auth/react";

type Stats = {
  totalPartner: number;
  totalApprovedPartner: number;
  totalPendingPartner: number;
  totalRejectedPartner: number;
};
type Tab = "kyc" | "partner" | "vehicle";
function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { userData } = useSelector((state: RootState) => state.user);
  const [partnerReviews, setPartnerReviews] = useState();
  const [activeTab, setActiveTab] = useState<Tab>("partner");
  const [pendingKyc, setPendingkyc] = useState();
  const [vehicleReviews, setVehicleReviews] = useState();
  const [open, setOpen] = useState(false);
  const getk = async () => {
    try {
      const data = await axios.get("/api/admin/video-kyc/pending");
      setPendingkyc(data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = async () => {
    await signOut({ redirect: false });
  };
  const get = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard");

      setStats(res.data.stats);
      setVehicleReviews(res.data.pendingVehicles);
      setPartnerReviews(res.data.pendingPartnersReviews);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (userData) {
      get();
      getk();
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-40">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={44}
              height={44}
              priority
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-black text-white"
            >
              <User size={14} />
              Admin Dashboard
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Kpi
            label="Total Partners"
            value={stats?.totalPartner}
            icon={<Users />}
            variant={"totalPartners"}
          />
          <Kpi
            label="Approved Partners"
            value={stats?.totalApprovedPartner}
            icon={<CheckCircle2 />}
            variant={"approved"}
          />
          <Kpi
            label="Pending Partners"
            value={stats?.totalPendingPartner}
            icon={<Clock />}
            variant={"pending"}
          />
          <Kpi
            label="Rejected Partners"
            value={stats?.totalRejectedPartner}
            icon={<XCircle />}
            variant={"rejected"}
          />
        </div>
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-wrap gap-2">
          <TabButton
            active={activeTab == "partner"}
            count={partnerReviews?.length ?? 0}
            icon={<Users size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            Pending Partner Reviews
          </TabButton>
          <TabButton
            active={activeTab == "kyc"}
            count={pendingKyc?.length ?? 0}
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending Video KYC
          </TabButton>

          <TabButton
            active={activeTab == "vehicle"}
            count={vehicleReviews?.length ?? 0}
            icon={<Truck size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Pending Vehicle Reviews
          </TabButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            {activeTab == "partner" && (
              <ContentList data={partnerReviews ?? []} type={"partner"} />
            )}
            {activeTab == "kyc" && (
              <ContentList data={pendingKyc ?? []} type={"kyc"} />
            )}
            {activeTab == "vehicle" && (
              <ContentList data={vehicleReviews ?? []} type={"vehicle"} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;
