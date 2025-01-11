"use client";
import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import dynamic from "next/dynamic";
import { getAllBlogs } from "../api/auth";

const OAuth = dynamic(() => import("../Components/OAuth"), { ssr: false });
const Test = () => {
  const { state, handleGoogleClick } = useUserContext();
  const fxn = async () => await getAllBlogs();
  useEffect(() => {
    const res = fxn();
    console.log(res);
  }, []);

  return (
    <div className="container p-12">
      {state?.userProfile?.loggedIn ? (
        "Go to Test Page"
      ) : (
        <OAuth handleGoogleClick={handleGoogleClick} />
      )}
    </div>
  );
};

export default Test;
