"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileCheck, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
const Page = () => {
  const [aadhar, setAadhar] = useState(null);
  const [rc, setRc] = useState(null);
  const [license, setLicense] = useState(null);

  const router = useRouter();
  const handleDocuments = async () => {
    try {
      const formdata = new FormData();
      if (aadhar) {
        formdata.append("aadhar", aadhar);
      }
      if (rc) {
        formdata.append("rc", rc);
      }
      if (license) {
        formdata.append("license", license);
      }
      const res = await axios.post(
        "/api/partner/onboarding/documents",
        formdata,
        {
          withCredentials: true,
        },
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        <div className="relative text-center">
          <button
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <p className="text-xs text-gray-500 font-medium">Step 1 of 3</p>
          <h1 className="text-2xl font-bold mt-1">Vehicle Documents</h1>
          <p className="text-sm text-gray-500 mt-2">Upload your Documents</p>
        </div>
        <div className="mt-8 space-y-5">
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            {" "}
            <div>
              <p className="text-sm font-semibold">Aadhaar / ID Proof</p>
              <p className="text-xs text-gray-500">Government issued ID</p>
            </div>
            <div>
              {aadhar && (
                <span className="text-xs text-gray-400">Uploaded</span>
              )}
              {!aadhar && <span className="text-xs text-gray-400">Upload</span>}
              {!aadhar && (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <UploadCloud size={18} />
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => {
                      const file = e.target?.files?.[0] ?? null;
                      setAadhar(file);
                      console.log(file);
                    }}
                  />
                </div>
              )}
            </div>
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            {" "}
            <div>
              <p className="text-sm font-semibold">Driving License</p>
              <p className="text-xs text-gray-500">Valid Driving License</p>
            </div>
            <div>
              {license && (
                <span className="text-xs text-gray-400">Uploaded</span>
              )}
              {!license && (
                <span className="text-xs text-gray-400">Upload</span>
              )}
              {!license && (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <UploadCloud size={18} />
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => {
                      const file = e.target?.files?.[0] ?? null;
                      setLicense(file);
                      console.log(file);
                    }}
                  />
                </div>
              )}
            </div>
          </motion.label>
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            {" "}
            <div>
              <p className="text-sm font-semibold">RC Document</p>
              <p className="text-xs text-gray-500">Registration Certificate</p>
            </div>
            <div>
              {rc && <span className="text-xs text-gray-400">Uploaded</span>}
              {!rc && <span className="text-xs text-gray-400">Upload</span>}
              {!rc && (
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <UploadCloud size={18} />
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => {
                      const file = e.target?.files?.[0] ?? null;
                      setRc(file);
                      console.log(file);
                    }}
                  />
                </div>
              )}
            </div>
          </motion.label>
        </div>
        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <FileCheck size={16} className="mt-0.5" />
          <p>
            {" "}
            Documents are securely stored and manually verified by our team.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
          onClick={handleDocuments}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Page;
