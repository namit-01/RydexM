import React, { useState } from "react";
import { motion } from "motion/react";
import { Loader2, Lock, Mail, User, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

type propType = {
  open: boolean;
  onClose: () => void;
};
type stepType = "login" | "signup" | "otp";
const AuthModel = ({ open, onClose }: propType) => {
  const [step, setStep] = useState<stepType>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { data } = useSession();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setLoading(false);
      setStep("otp");
    } catch (error: any) {
      setLoading(false);
      setErr(error.response.data.message);
    }
  };
  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    console.log(res);
  };
  const handleGoogleLogin = async () => {
    await signIn("google");
  };
  const handleOtpVerify = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/verifyEmail", {
        email,
        otp: otp.join(""),
      });
      setLoading(false);
      console.log(res);
      setStep("login");
    } catch (err: any) {
      setLoading(false);
      setErr(err.response.data.message);
    }
  };
  const handleChangeOtp = (index: number, value: string) => {
    const j = value;
    const updated = [...otp];
    if (j == "") {
      updated[index] = "";
      setOtp(updated);
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
      return;
    }
    if (
      j == "0" ||
      j == "1" ||
      j == "2" ||
      j == "3" ||
      j == "4" ||
      j == "5" ||
      j == "6" ||
      j == "7" ||
      j == "8" ||
      j == "9"
    ) {
      updated[index] = value;
      setOtp(updated);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    } else {
      return;
    }
  };
  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[90] bg-black/80 black-drop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black">
              <div
                className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
                onClick={onClose}
              >
                <X size={20}></X>
              </div>
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-extrabold tracking-widest">
                  RYDEX
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Premium Vehicle Booking
                </p>
              </div>
              <button
                className=" w-full h-11 rounded-xl
                  border border-black/20
                  flex items-center justify-center gap-3
                  text-sm font-semibold
                  hover:bg-black hover:text-white
                  transition"
                onClick={handleGoogleLogin}
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Continue with Google
              </button>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-black/10" />
                <div className="text-xs text-gray-500">OR</div>
                <div className="flex-1 h-px bg-black/10" />
              </div>
              <div>
                {step == "login" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h1 className="text-xl font-semibold "> Welcome Back</h1>
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                        <Mail size={18} className="text-gray-500" />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full bg-transparent outline-none text-sm"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                        <Lock size={18} className="text-gray-500" />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full bg-transparent outline-none text-sm"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </div>
                      <button
                        className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center"
                        onClick={() => handleLogin()}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Login"
                        )}
                      </button>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        don't have an account ?
                        <span
                          onClick={() => setStep("signup")}
                          className="text-black font-medium hover:underline"
                        >
                          Sign Up
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {step == "signup" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h1 className="text-xl font-semibold "> Create Account</h1>
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                        <User size={18} className="text-gray-500" />
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full bg-transparent outline-none text-sm"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                        <Mail size={18} className="text-gray-500" />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full bg-transparent outline-none text-sm"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                        <Lock size={18} className="text-gray-500" />
                        <input
                          type="password"
                          placeholder="Password"
                          className="w-full bg-transparent outline-none text-sm"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </div>
                      {err && <p className="text-red-400">{err}</p>}
                      <button
                        className="w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition flex justify-center items-center"
                        onClick={() => handleSignUp()}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                      <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account ?
                        <span
                          onClick={() => setStep("login")}
                          className="text-black font-medium hover:underline"
                        >
                          Login
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {step == "otp" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h2 className="text-xl font-semibold">Verify Email</h2>
                    <div className="mt-4 flex justify-between gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          value={digit}
                          id={`otp-${i}`}
                          maxLength={1}
                          className="w-10 h-12 sm:w-12
                            text-center text-lg font-semibold
                            rounded-xl bg-white
                            border border-black/20
                            outline-none"
                          onChange={(e) => handleChangeOtp(i, e.target.value)}
                        ></input>
                      ))}
                    </div>
                    <button
                      className="mt-6 w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 flex justify-center items-center transition"
                      onClick={() => {
                        handleOtpVerify();
                      }}
                    >
                      Verify and Create Account
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AuthModel;
