"use client";
import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import Image from "next/image";
import {
  MicIcon,
  MicOffIcon,
  Video,
  VideoIcon,
  VideoOff,
  VideoOffIcon,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { userData } = useSelector((state) => state.user);
  const [joined, setJoined] = useState(false);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [iscameraOn, setIscameraOn] = useState(true);
  const [ismicOn, setIsmickOn] = useState(true);
  const { roomId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState();
  console.log(roomId);
  const start = async () => {
    if (!containerRef) {
      return null;
    }
    setLoading(true);
    let displayName;

    if (userData.role == "admin") {
      displayName = "Admin";
    } else {
      displayName = userData?.name.toString();
    }
    const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const sec = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
    const z = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      sec!,
      roomId.toString()!,
      userData?._id.toString(),
      displayName,
    );
    const zp = ZegoUIKitPrebuilt.create(z);
    zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
    });
    setJoined(true);
    setLoading(false);
  };
  useEffect(() => {
    if (joined) return;
    let localStream: MediaStream;
    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (previewRef.current) {
          previewRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.log(err);
      }
    };
    init();
  }, []);
  const toggleCamera = () => {
    if (!stream) {
      return;
    }
    stream.getVideoTracks().forEach((track) => (track.enabled = !iscameraOn));
    setIscameraOn(!iscameraOn);
  };
  const toggleMic = () => {
    if (!stream) {
      return;
    }
    stream.getAudioTracks().forEach((track) => (track.enabled = !ismicOn));
    setIsmickOn(!ismicOn);
  };
  const handleApprove = async () => {
    try {
      const res = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "approved",
      });
      console.log(res);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setErr(message);
      console.error(err);
    }
  };
  const handleReject = async () => {
    try {
      const res = await axios.post("/api/admin/video-kyc/complete", {
        roomId,
        action: "rejected",
        reason,
      });
      console.log(res);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setErr(message);
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Image src={"/logo.png"} alt="logo" width={44} height={44} priority />
          <p>
            {userData?.role == "admin" ? "Admin Verification" : "Partner kyc"}
          </p>
        </div>
        <div className="flex gap-4">
          {joined && userData?.role === "admin" && (
            <>
              <button
                className="px-6 py-2.5 rounded-md bg-green-600 text-white font-medium border border-green-700 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 
                   transition-transform duration-200"
                onClick={() => setShowApprove(true)}
              >
                Approve
              </button>
              <button
                className="px-6 py-2.5 rounded-md bg-red-600 text-white font-medium border border-red-700 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 
                   transition-transform duration-200"
                onClick={() => setShowReject(true)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className={`absolute inset-0 ${joined ? "block" : "hidden"}`}
        ></div>
        {!joined && (
          <div className="h-full flex items-center justify-center px-4 py-10">
            <div className="w-full mx-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <video
                  ref={previewRef}
                  autoPlay
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                ></video>
                {!iscameraOn && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <VideoOff size={40} />
                  </div>
                )}
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Secure Video Kyc
                </h1>
                <div className="flex justify-center lg:justify-start gap-6">
                  <button
                    onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      iscameraOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20 text-white"
                    }`}
                  >
                    {iscameraOn ? (
                      <VideoIcon></VideoIcon>
                    ) : (
                      <VideoOffIcon></VideoOffIcon>
                    )}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      ismicOn
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/20 text-white"
                    }`}
                  >
                    {ismicOn ? <MicIcon></MicIcon> : <MicOffIcon></MicOffIcon>}
                  </button>
                </div>
                <button
                  className="w-full bg-white text-black py-4 rounded-xl font-semibold"
                  onClick={() => start()}
                  disabled={loading}
                >
                  Join Secure Call
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showApprove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowApprove(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
              <div className="flex gap-4">
                <button
                  className="flex-1 border rounded-xl py-2"
                  onClick={() => setShowApprove(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-green-600 rounded-xl py-2"
                  onClick={() => handleApprove()}
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-[#111] w-full max-w-md rounded-2xl p-6 shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 text-gray-400"
                onClick={() => setShowReject(false)}
              >
                <X size={16} />
              </button>
              <h2 className="text-lg font-semibold mb-4">Reject Partner</h2>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter Reason"
                className="w-full min-h-[140px] p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray text-white-900 placeholder-gray-400 shadow-sm resize-none py-2"
              ></textarea>

              <div className="flex gap-4 py-2">
                <button
                  className="flex-1 border rounded-xl py-2"
                  onClick={() => setShowReject(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-600 rounded-xl py-2"
                  onClick={() => handleReject()}
                >
                  Reject
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
