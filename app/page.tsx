"use client";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const localPaymentMethodsArr = [
  {
    operator: "ZAAD",
    refNumber: "252",
    isSelected: false,
  },
  {
    operator: "EVC",
    refNumber: "252",
    isSelected: false,
  },
  {
    operator: "SAHAL",
    refNumber: "252",
    isSelected: false,
  },
];

export default function Home() {
  const [paymentMethod, setPaymentMethod] = useState("local");
  const [localPaymentMethods, setLocalPaymentMethods] = useState(
    localPaymentMethodsArr,
  );
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const [orderId, setOrderId] = useState('33321232'); // Set your order ID here


  const handlePaymentClickOption = (index: number) => {

    setLocalPaymentOptions(localPaymentOptions.map((option, i) => ({
      ...option,
      isSelected: i === index
    })))
  }

  const handlePaymentMethodChange = (index: number) => {
    const updatedMethods = localPaymentMethods.map((method, i) => ({
      ...method,
      isSelected: i === index,
    }));
    setLocalPaymentMethods(updatedMethods);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/local", {
        phone,
        amount,
      });

      toast.success(response.data.params.description);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toast.error("Error Accured")
      // toast.error(response.data.params.description)
    }
  };

   useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://test-gateway.mastercard.com/static/checkout/checkout.min.js";

    script.async = true;
    script.onload = () => console.log("master card script loaded");
    document.body.appendChild(script);

    // clean up
    return () => {
      document.body.removeChild(script);
    }
  }, []);


  const configureCheckout = (sessionId: string) => {

    if (!window.Checkout) {
      console.log("checkout script not loaded");
      return
    }


    window.Checkout.configure({
      session: {
        id: sessionId,
      },
      order: {
        description: "Order something",
        id: orderId
      },
      interaction: {
        operation: 'PURCHASE',
        merchant: {
          name: "Dugsiiye",
          // address: {
          //   line1: '123 Premier bank Street',
          //   line2: 'StreetAddressLine2',
          // },
        },
      },
    })
    window.Checkout.showPaymentPage();
  }

  return (
    <>
    <Toaster />
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="mb-4">
        <button
          onClick={() => setPaymentMethod("local")}
          className={`mr-2 ${paymentMethod === "local" ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"}`}
          >
          Local Payment
        </button>
        <button
          onClick={() => setPaymentMethod("online")}
          className={`mr-2 ${paymentMethod === "online" ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"}`}
        >
          Online Payment
        </button>
      </div>
      {paymentMethod === "online" && (
        <>
        
        <h1 className="text-2xl ">Online Payment methods</h1>
        <button onClick={handleOnlinePayment}>Pay now</button>
              <div id="embedded-checkout"></div>
        </>
      )}
      {paymentMethod === "local" && (
        <div className="max-w-2xl">
          <h1 className="text-2xl">Local Payment methods</h1>
          {localPaymentMethods.map((option, index) => (
            <div
              onClick={() => handlePaymentMethodChange(index)}
              className={`${option.isSelected ? "bg-gray-150 rounded w-full p-2 my-2 border-2 border-blue-500 cursor-pointer" : "bg-gray-100 rounded w-full p-2 my-2 cursor-pointer"}`}
              key={option.operator}
            >
              <h1 className="font-bold">{option.operator}</h1>
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your payment reference number"
              className="border w-full border-gray-300 rounded p-2 mb-2"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your amount"
              className="border w-full border-gray-300 rounded p-2 mb-2"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
              {loading ? "Paying..." : "Pay now"}
            </button>
          </form>
        </div>
      )}
    </main>
              </>
  );
}
