"use client";

import { IVehicle } from "@/models/vehicle.model";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, IndianRupee, X } from "lucide-react";
import axios from "axios";
import { Loader2 } from "lucide-react";

type PropType = {
  open: boolean;
  onClose: (a: boolean) => void;
  data: IVehicle | null;
};

const PricingModel = ({ open, onClose, data }: PropType) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [baseFare, setBaseFare] = useState();
  const [pricePerKm, setPricePerKm] = useState();
  const [waitingCharge, setWaitingCharge] = useState();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("baseFare", baseFare);
      formData.append("pricePerKm", pricePerKm);
      formData.append("waitingCharge", waitingCharge);
      if (image) {
        formData.append("image", image);
      }
      const { data } = await axios.post(
        "/api/partner/onboarding/pricing",
        formData,
      );

      setLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data) {
      setBaseFare(data?.baseFare);
      setWaitingCharge(data?.waitingCharge);
      setPricePerKm(data?.pricePerKM);
      setPreview(data?.imageUrl);
      console.log(data.baseFare);
    }
  }, [data]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">Pricing & Vehicle Image</h2>
                {data && (
                  <p className="mt-1 text-sm text-gray-500">
                    Configure pricing for this vehicle
                  </p>
                )}
              </div>

              <button
                onClick={() => onClose(false)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto p-6">
              {/* Image Upload */}
              <div className="mb-6">
                <label
                  htmlFor="imageLabel"
                  className="relative flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-black"
                >
                  {!preview ? (
                    <>
                      <ImagePlus size={36} className="text-gray-400" />
                      <p className="mt-3 text-sm font-medium text-gray-600">
                        Upload Vehicle Image
                      </p>
                      <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                    </>
                  ) : (
                    <img
                      src={preview}
                      alt="Vehicle Preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  <input
                    id="imageLabel"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              {/* Pricing Fields */}
              <div className="space-y-5">
                {/* Base Fare */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Base Fare
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border px-4 py-3 transition focus-within:border-black">
                    <IndianRupee size={18} />
                    <input
                      type="number"
                      value={baseFare}
                      onChange={(e) => setBaseFare(e.target.value)}
                      placeholder="Enter base fare"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Price Per KM */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price Per KM
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border px-4 py-3 transition focus-within:border-black">
                    <IndianRupee size={18} />
                    <input
                      type="number"
                      value={pricePerKm}
                      onChange={(e) => setPricePerKm(e.target.value)}
                      placeholder="Enter price per kilometer"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Waiting Charge */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Waiting Charge
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border px-4 py-3 transition focus-within:border-black">
                    <IndianRupee size={18} />
                    <input
                      type="number"
                      value={waitingCharge}
                      onChange={(e) => setWaitingCharge(e.target.value)}
                      placeholder="Enter waiting charge"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t p-6">
              <button
                onClick={() => onClose(false)}
                className="flex-1 rounded-xl border py-3 font-medium transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Saving..." : "Save Pricing"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PricingModel;
