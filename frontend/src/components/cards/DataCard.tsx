interface DataCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DataCard({ children, actions }: DataCardProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
      <div className="flex-1">{children}</div>
      {actions && <div className="flex space-x-3">{actions}</div>}
    </div>
  );
}
