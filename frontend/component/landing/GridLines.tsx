export function GridLines() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
      <div className="w-full max-w-screen-xl h-full flex justify-between px-4 md:px-8">
        <div className="w-px h-full bg-slate-100"></div>
        <div className="w-px h-full bg-slate-100"></div>
      </div>
    </div>
  );
}