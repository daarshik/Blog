"use client";

// import dynamic from "next/dynamic";
// import { useState } from "react";
// import { useUserContext } from "../context/UserContext";
// import { Button } from "antd";
// import { useRouter } from "next/navigation";

// // Dynamically import the Editor component with SSR disabled
// // const Editor = dynamic(() => import("./Components/Editor/index"), {
// //   ssr: false,
// // });
// const OAuth = dynamic(() => import("./Components/OAuth"), { ssr: false });
// const Test = dynamic(() => import("./Test/page"), { ssr: false });

// export default function Home() {
//   // const [value, setValue] = useState("");
//   // console.log(value);
//   const router = useRouter();

//   const { handleGoogleClick, state } = useUserContext();

//   return (
//     <div className="container p-12">
//       {state?.userProfile?.loggedIn ? (
//         <>
//           <Button onClick={() => router.push("/test")}>Test button</Button>
//           <Test />
//         </>
//       ) : (
//         <OAuth handleGoogleClick={handleGoogleClick} />
//       )}

//       {/* <Editor value={value} onChange={(newValue) => setValue(newValue)} /> */}
//     </div>
//   );
// }

import dynamic from "next/dynamic";
import { useUserContext } from "../context/UserContext";
import { Button } from "antd";
import { useRouter } from "next/navigation";

// Dynamically import the OAuth component with SSR disabled
const OAuth = dynamic(() => import("./Components/OAuth"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { handleGoogleClick, state } = useUserContext();

  return (
    <div className="container p-12">
      {state?.userProfile?.loggedIn ? (
        <Button onClick={() => router.push("/Test")}>Go to Test Page</Button>
      ) : (
        <OAuth handleGoogleClick={handleGoogleClick} />
      )}
    </div>
  );
}
