"use client";
import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import dynamic from "next/dynamic";
import { getAllBlogs } from "../api/auth";
import useAuthStore from "../utils/useAuthStore";

const OAuth = dynamic(() => import("../Components/OAuth"), { ssr: false });
const Test = () => {
  const { state, handleGoogleClick, UserDetails } = useUserContext();
  const token = useAuthStore((state) => state.token);
  const fxn = async () => await getAllBlogs();
  console.log(token);

  useEffect(() => {
    fxn();
    UserDetails();
  }, [token]);

  return (
    <div className="container p-12">
      {token ? (
        "Go to Test Page"
      ) : (
        <OAuth handleGoogleClick={handleGoogleClick} />
      )}
    </div>
  );
};

export default Test;
