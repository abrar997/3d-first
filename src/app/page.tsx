"use client";
import { useState, useEffect } from "react";
import Canvas from "@/components/Canvas";
import Loading from "./loading";
function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);
  return <div>{isLoading ? <Loading /> : <Canvas />}</div>;
}

export default Home;
