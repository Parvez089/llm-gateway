// frontend/component/landing/GridLines.tsx
export function GridLines() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex justify-center w-full h-full">
      <div className="w-full max-w-screen-xl h-full flex justify-between px-4 md:px-8">
        {/* টেস্ট করার জন্য লাল রঙ */}
        <div className="w-px h-full bg-gray-200"></div>
        <div className="w-px h-full bg-gray-200"></div>
      </div>
    </div>
  );
}