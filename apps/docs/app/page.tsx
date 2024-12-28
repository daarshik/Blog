"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import("./Components/Editor/index"), {
  ssr: false,
});

export default function Home() {
  const [value, setValue] = useState("");
  console.log(value);

  return (
    <div className="container p-12">
      <Editor value={value} onChange={(newValue) => setValue(newValue)} />
    </div>
  );
}
