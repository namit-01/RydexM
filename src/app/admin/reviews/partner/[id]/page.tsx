"use client";
import AnimatedCard from "@/components/AnimatedCard";
import DocPreview from "@/components/DocPreview";
import axios from "axios";
import {
  ArrowLeft,
  CarIcon,
  CheckCircle,
  CircleDashed,
  Clock,
  FileText,
  Landmark,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [vehicleDetails, setVehicleDetails] = useState<any>();
  const [vehicleDoc, setVehicleDoc] = useState<any>();
  const [vehicleBank, setVehicleBank] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [rs, setRs] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const handleGetPartner = async () => {
    try {
      const res = await axios.get(`/api/admin/reviews/partner/${params.id}`);
      setData(res?.data.partner);
      setVehicleDetails(res?.data.vehicle);
      setVehicleDoc(res?.data.documents);
      setVehicleBank(res?.data.bank);
      console.log(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (params.id) {
      handleGetPartner();
    }
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading Partner....
      </div>
    );
  }
  const handleApprove = async () => {
    try {
      setApproveLoading(true);

      const res = await axios.get(
        `/api/admin/reviews/partner/${params.id}/approve`,
      );

      console.log(res);

      setShowApprove(false);
      await handleGetPartner();
    } catch (err) {
      console.log(err);
    } finally {
      setApproveLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setRejectLoading(true);

      const res = await axios.post(
        `/api/admin/reviews/partner/${params.id}/reject`,
        {
          rs,
        },
      );

      console.log(res);

      setShowReject(false);
      setRs("");
      await handleGetPartner();
    } catch (err) {
      console.log(err);
    } finally {
      setRejectLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="font-semibold text-lg">{data.name}</div>
            <div className="text-xs text-gray-500">{data.email}</div>
          </div>
          <div>
            {data?.partnerStatus === "approved" ? (
              <div className="px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-green-100 text-green-700">
                <CheckCircle size={18} />
                Approved
              </div>
            ) : data?.partnerStatus === "rejected" ? (
              <div className="px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-red-100 text-red-700">
                <XCircle />
                Rejected
              </div>
            ) : (
              <div className="px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 bg-yellow-100 text-yellow-700">
                <Clock size={14} />
                Pending
              </div>
            )}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <AnimatedCard
            title="Vehicle Details"
            icon={<CarIcon size={18}></CarIcon>}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle Type</span>
              <span className="font-semibold">
                {vehicleDetails?.type || "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Registration Number</span>
              <span className="font-semibold">
                {vehicleDetails?.number || "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Model</span>
              <span className="font-semibold">
                {vehicleDetails?.vehicleModel || "-"}
              </span>
            </div>
          </AnimatedCard>
          <AnimatedCard
            title="Documents"
            icon={<FileText size={18}></FileText>}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DocPreview
                label="Aadhar"
                url={vehicleDoc.aadharUrl}
              ></DocPreview>
              <DocPreview
                label="License"
                url={vehicleDoc.licenseUrl}
              ></DocPreview>
              <DocPreview label="RC" url={vehicleDoc.rcUrl}></DocPreview>
            </div>
          </AnimatedCard>
        </div>
        <div className="space-y-8">
          <AnimatedCard
            title="Bank Details"
            icon={<Landmark size={18}></Landmark>}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Holder</span>
              <span className="font-semibold">
                {vehicleBank?.accountHolder || ""}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account Number</span>
              <span className="font-semibold">
                {vehicleBank?.accountNumber || ""}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IFSC</span>
              <span className="font-semibold">{vehicleBank?.ifsc || ""}</span>
            </div>
          </AnimatedCard>
          {data?.partnerStatus == "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-xl space-y-6"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} />
                Admin Check
              </div>
              <p className="text-sm text-gray-500">
                Verify documents carefully before approving.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  className="py-3 rounded-2xl bg-linear-to-r from-black to-gray-800 text-white font-semibold hover:opacity-90 transition"
                  onClick={() => setShowApprove(true)}
                >
                  Approve
                </button>

                <button
                  className="py-3 rounded-2xl border font-semibold hover:bg-gray-100 transition"
                  onClick={() => setShowReject(true)}
                >
                  Reject
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <AnimatePresence>
        {showApprove && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex
            items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Approve Partner</h2>
              <p className="text-sm text-gray-500 mt-2">
                Confirm all information has been verified.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 py-2 rounded-xl border disabled:opacity-50"
                  onClick={() => setShowApprove(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={approveLoading}
                  className="flex-1 py-2 rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleApprove}
                >
                  {approveLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircleDashed size={16} className="animate-spin" />
                      Approving...
                    </div>
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReject && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <h2 className="text-lg font-bold">Reject Partner?</h2>
              <p className="text-sm text-gray-500 mt-2">
                <textarea
                  placeholder="Enter rejection reason (required)"
                  className="w-full mt-3 border rounded-xl p-3 text-sm"
                  onChange={(e) => setRs(e.target.value)}
                  value={rs}
                />
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 py-2 rounded-xl border disabled:opacity-50"
                  onClick={() => setShowReject(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={rejectLoading}
                  className="flex-1 py-2 flex items-center justify-center rounded-xl bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleReject}
                >
                  {rejectLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <CircleDashed size={16} className="animate-spin" />
                      Rejecting...
                    </div>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
