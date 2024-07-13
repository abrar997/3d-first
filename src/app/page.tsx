import Canvas from "@/components/Canvas";

const Home = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return (
    <div>
      <Canvas />
    </div>
  );
};

export default Home;
