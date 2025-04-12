export default function Loader({
  color = "text-white",
  size = "h-4 w-4",
  className = "",
}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`flex gap-1 ${color}`}>
        <div
          className={`rounded-full ${size} bg-current animate-bounce [animation-delay:-0.3s]`}
        />
        <div
          className={`rounded-full ${size} bg-current animate-bounce [animation-delay:-0.15s]`}
        />
        <div className={`rounded-full ${size} bg-current animate-bounce`} />
      </div>
    </div>
  );
}
