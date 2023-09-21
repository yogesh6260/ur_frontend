"use client";
import Header from "./components/Header";
import Form from "./components/Form";
import Footer from "./components/Footer";
import { client } from "./utils/API";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const getServer = async () => {
      const data = await client.get("/api/ip/verify-address");
      console.log(data.data.message);
    };
    getServer();
  }, []);
  return (
    <main>
      <Header title={"User Registration Form"} />
      <Form />
      <Footer />
    </main>
  );
}
