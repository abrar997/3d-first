"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Loading from "./loading";

const Canvas = dynamic(() => import("../components/Canvas"), { ssr: false });

function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return <div>{loading ? <Loading /> : <Canvas />}</div>;
}

export default Home;
