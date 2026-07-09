"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Landmark,
  Phone,
  CheckCircle,
  CircleDashed,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Page = () => {
  const router = useRouter();

  // dummy states
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [upi, setupi] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // dummy validations (no logic, just to remove errors)
  const isNameValid = true;
  const isAccountValid = true;
  const isIfscValid = true;
  const isMobileValid = true;
  const canSubmit = true;
  const [available, setAvailable] = useState("");
  const { userData } = useSelector((state: RootState) => state.user);

  // empty function
  const handleBank = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/partner/onboarding/bank", {
        accountHolder,
        accountNumber,
        ifsc,
        mobileNumber,
        upi,
      });
      setLoading(false);
      console.log(res);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const getVehicle = async () => {
    try {
      const res = await axios.get("/api/partner/onboarding/bank");
      console.log(res);
      if (res.data.message == "No bank account ") {
        setAvailable(res.data.message);
      } else {
        setAccountHolder(res.data.b.accountHolder);
        setAccountNumber(res.data.b.accountNumber);
        setIfsc(res.data.b.ifsc);
        setupi(res.data.b.upi);
        if (userData) {
          setMobileNumber(userData?.mobileNumber);
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    }
  };

  useEffect(() => {
    getVehicle();
  }, [userData]);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-xs text-gray-500 font-medium">step 3 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Bank & Payout Setup</h1>
          <p className="text-sm text-gray-500 mt-2">Used for partner payouts</p>
          {available !== "" && (
            <div>
              {/* Render something when available is not empty */}
              <p className="text-red-600 text-sm">{available}</p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-semibold text-gray-500">
              Account holder name
            </label>
            <div className="flex items-center gap-2 mt-2">
              <BadgeCheck className="text-gray-400" />
              <input
                type="text"
                placeholder="As per bank records"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              Bank account number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <CreditCard className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              IFSC code
            </label>
            <div className="flex items-center gap-2 mt-2">
              <Landmark className="text-gray-400" />
              <input
                type="text"
                placeholder="HDFC0001234"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              Mobile number
            </label>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="text-gray-400" />
              <input
                type="text"
                placeholder="10 digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">
              UPI ID (optional)
            </label>
            <input
              type="text"
              placeholder="name@upi"
              value={upi}
              onChange={(e) => setupi(e.target.value)}
              className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black mt-2"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">*{error}</p>}

        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle size={16} className="mt-0.5" />
          <p>
            Bank details are verified before first payout. This usually takes
            24–48 hours.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBank}
          disabled={!canSubmit || loading}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold disabled:opacity-40 transition flex items-center justify-center"
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Page;
