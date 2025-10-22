import Navbar from "../components/layouts/navbar";
import PageContainer from "../components/layouts/pageContainer";
import SectionHeader from "../components/layouts/sectionHeader";
import DataCard from "../components/cards/DataCard";
import DangerButton from "../components/buttons/dangerButton";

export default function AircraftsPage() {
  const aircrafts = [
    { id: "A0001", type: "Airbus A350-900" },
    { id: "A0077", type: "Airbus A220-300" },
    { id: "A0512", type: "Airbus A330-900" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageContainer>
        <SectionHeader title="Aircrafts" buttonText="Add new aircraft" onButtonClick={() => alert("Add new")} />
        {aircrafts.map((a) => (
          <DataCard
            key={a.id}
            actions={
              <>
                <button className="text-blue-800 hover:text-blue-900">✏️</button>
                <DangerButton>🗑️</DangerButton>
              </>
            }
          >
            <div className="flex justify-between w-full">
              <span className="font-medium">{a.id}</span>
              <span className="text-gray-700">{a.type}</span>
            </div>
          </DataCard>
        ))}
      </PageContainer>
    </div>
  );
}
