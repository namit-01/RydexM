"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetMe = (enabled: boolean) => {
  const disaptch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!enabled) return;

    const getMe = async () => {
      try {
        const res = await axios.get("/api/user/me");
        disaptch(setUserData(res.data));
      } catch (e) {
        console.log(e);
      }
    };

    getMe();
  }, [enabled]);
};

export default useGetMe;
