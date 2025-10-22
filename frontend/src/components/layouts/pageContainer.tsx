export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm">
        {children}
      </main>
    </div>
  );
}
