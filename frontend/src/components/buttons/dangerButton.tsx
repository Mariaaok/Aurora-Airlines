export default function DangerButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium shadow-sm"
    >
      {children}
    </button>
  );
}
