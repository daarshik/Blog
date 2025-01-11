import React from "react";
import { Button } from "antd";

function OAuth({ handleGoogleClick }: any) {
  return <Button onClick={() => handleGoogleClick()}>Google Sign In</Button>;
}

export default OAuth;
