"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  const load = async () => {
    try {
      const res = await axios.get(`/api/admin/reviews/vehicle/${id}`);
      setData(res.data);
    } catch (err: any) {
      console.log(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const handleApprove = async () => {
    try {
      const res = await axios.get(`/api/admin/reviews/vehicle/${id}/approve`);
      console.log(res);
    } catch (err) {
      console.log(err.response?.status);
      console.log(err.response?.data);
    }
  };
  const handleReject = async () => {
    try {
      const res = await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, {
        reason,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const status = data?.status;

  const statusMap: Record<
    string,
    { label: string; dot: string; pill: string }
  > = {
    approved: {
      label: "Approved",
      dot: "bg-emerald-400",
      pill: "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
    },
    rejected: {
      label: "Rejected",
      dot: "bg-red-400",
      pill: "bg-red-400/10 text-red-400 border border-red-400/20",
    },
    pending: {
      label: "Pending Review",
      dot: "bg-amber-400",
      pill: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    },
  };

  const s = statusMap[status] ?? statusMap["pending"];

  const details = [
    { label: "Type", icon: "🚗", value: data?.type },
    { label: "Model", icon: "🏷️", value: data?.vehicleModel },
    { label: "Plate", icon: "🔢", value: data?.number },
    {
      label: "Base Fare",
      icon: "💰",
      value: data?.baseFare ? `₹${data.baseFare}` : null,
    },
    {
      label: "Price / km",
      icon: "📍",
      value: data?.pricePerKM ? `₹${data.pricePerKM}` : null,
    },
    {
      label: "Waiting Charge",
      icon: "⏱️",
      value: data?.waitingCharge ? `₹${data.waitingCharge}` : null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Ambient glow ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Back */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => router.back()}
            className="shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center text-white/70 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </motion.button>

          {/* Owner – hidden on xs */}
          <div className="hidden sm:flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-[11px] font-bold">
              {data?.owner?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-medium text-white/90 truncate">
                {data?.owner?.name ?? "—"}
              </p>
              <p className="text-[11px] text-white/40 truncate">
                {data?.owner?.email ?? "—"}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 text-center">
            <p className="text-[10px] tracking-[0.18em] font-semibold text-white/30 uppercase">
              Admin · Review
            </p>
            <h1 className="text-base sm:text-lg font-semibold text-white leading-tight">
              {data?.vehicleModel ?? "Vehicle"}
            </h1>
          </div>

          {/* Status */}
          {status && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${s.pill}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`}
              />
              {s.label}
            </motion.span>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {/* Mobile owner row */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {data?.owner?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/90 truncate">
              {data?.owner?.name ?? "—"}
            </p>
            <p className="text-[11px] text-white/40 truncate">
              {data?.owner?.email ?? "—"}
            </p>
          </div>
        </motion.div>

        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Image panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-2 relative flex flex-col items-center justify-center p-8 min-h-[280px] sm:min-h-[380px] bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
            >
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Glow behind image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />
              </div>

              {/* Vertical divider (desktop) */}
              <div className="hidden lg:block absolute right-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              {data?.imageUrl ? (
                <motion.img
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  src={data.imageUrl}
                  alt={data?.vehicleModel}
                  className="relative z-10 w-full max-w-xs h-52 sm:h-64 object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="relative z-10 text-white/20">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
              )}

              {data?.number && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="relative z-10 mt-6 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-xs font-mono font-bold text-white/60 tracking-[0.2em]">
                    {data.number}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Details panel */}
            <div className="lg:col-span-3 flex flex-col p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Vehicle Details
                </h2>
                <p className="text-xs text-white/30 mt-0.5 capitalize">
                  {data?.type ?? "—"} · Submitted for review
                </p>
              </div>

              {/* Detail rows */}
              <div className="space-y-1 rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                {details.map(({ label, icon, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.055, duration: 0.3 }}
                    className={`flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors ${
                      i < details.length - 1
                        ? "border-b border-white/[0.05]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{icon}</span>
                      <span className="text-sm text-white/40">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80 capitalize">
                      {value ?? "—"}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="flex-1" />

              {/* Action buttons */}
              {status === "pending" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRejectModal(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 hover:border-red-400/30 transition font-semibold text-sm"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Reject
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setApproveModal(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 transition"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approve Vehicle
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Approve Modal ── */}
      <AnimatePresence>
        {approveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setApproveModal(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 280, damping: 24 },
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 16,
                transition: { duration: 0.15 },
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
            >
              {/* Green accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Approve vehicle
                    </h2>
                    <p className="text-xs text-white/40">
                      Driver will be notified immediately
                    </p>
                  </div>
                </div>

                <p className="text-sm text-white/50 leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  The vehicle will go live and the driver can start accepting
                  rides right away.
                </p>

                <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setApproveModal(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 text-white/60 hover:text-white/80 text-sm font-medium transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setApproveModal(false);
                      handleApprove();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-900/40 transition"
                  >
                    Yes, approve
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reject Modal ── */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setRejectModal(false);
              setReason("");
            }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 280, damping: 24 },
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 16,
                transition: { duration: 0.15 },
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
            >
              {/* Red accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-red-500 to-rose-500" />

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Reject vehicle
                    </h2>
                    <p className="text-xs text-white/40">
                      Driver will receive your reason
                    </p>
                  </div>
                </div>

                <label className="block text-[11px] font-semibold tracking-widest text-white/30 uppercase mb-2">
                  Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Documents are unclear — please re-upload with better lighting."
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 placeholder:text-white/20 text-sm p-4 outline-none focus:border-red-400/40 focus:ring-2 focus:ring-red-400/10 resize-none transition"
                />
                <p className="text-[11px] text-white/25 mt-1.5">
                  {reason.length} characters · Be specific so the driver knows
                  what to fix
                </p>

                <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setRejectModal(false);
                      setReason("");
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 text-white/60 hover:text-white/80 text-sm font-medium transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: reason.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: reason.trim() ? 0.97 : 1 }}
                    disabled={!reason.trim()}
                    onClick={() => {
                      if (!reason.trim()) return;
                      setRejectModal(false);
                      handleReject();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold shadow-lg shadow-red-900/30 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Reject vehicle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
