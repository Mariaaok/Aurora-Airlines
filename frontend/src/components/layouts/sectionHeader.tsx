interface SectionHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({ title, buttonText, onButtonClick }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-blue-900">{title}</h1>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
