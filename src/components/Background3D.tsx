const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0F] to-[#2D1F1F] opacity-90" />
      <div className="absolute inset-0 bg-[url('/wall-texture.png')] mix-blend-overlay opacity-20" />
    </div>
  );
};

export default Background3D;