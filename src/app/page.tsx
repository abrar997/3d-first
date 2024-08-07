"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Loading from "./loading";

const Canvas = dynamic(() => import("../components/Canvas"), { ssr: false });

function Home() {
  const [loading, setLoading] = useState(false);
  useEffect(() => setLoading(true));
  return <div>{loading ? <Loading /> : <Canvas />}</div>;
}

export default Home;
