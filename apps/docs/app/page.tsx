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
import { useEffect } from "react";
import useAuthStore from "./utils/useAuthStore";
import axios from "axios";
import { logout } from "./api/auth";

// Dynamically import the OAuth component with SSR disabled
const OAuth = dynamic(() => import("./Components/OAuth"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { handleGoogleClick, state, UserDetails } = useUserContext();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    UserDetails();
  }, [token]);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post(
        "http://localhost:8000/payment/createOrder",
        {
          amount: 5000,
          currency: "INR",
        }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Your Company",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const result = await axios.post(
              "http://localhost:8000/payment/verifyPayment",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            );
            console.log(result.data);
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        },
        // prefill: {
        //   name: 'Your Name',
        //   email: 'your.email@example.com',
        //   contact: '9999999999'
        // },
        // theme: {
        //   color: '#F37254'
        // },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="container p-12">
      {token ? (
        <>
          <Button onClick={() => router.push("/Test")}>Go to Test Page</Button>
          {/* <Button onClick={() => logout()}>Logout</Button> */}
        </>
      ) : (
        <div>
          <h1>Razorpay Payment</h1>
          <Button onClick={handlePayment}>Pay Now</Button>
        </div>
        // <OAuth handleGoogleClick={handleGoogleClick} />
      )}
    </div>
  );
}
