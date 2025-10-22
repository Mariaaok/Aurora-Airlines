import { Button } from "../ui/button";


export default function Navbar() {
  const items = ["Flights", "Flight Types", "Aircraft Types", "Aircrafts", "Airports", "Employees"];

  return (
    <nav className="bg-blue-900 text-white flex justify-between items-center px-8 py-3">
      <div className="flex items-center space-x-8">
        <span className="font-bold text-lg tracking-wide">AURORA AIRLINES</span>
        <ul className="flex space-x-6 text-sm">
          {items.map((item) => (
            <li key={item} className="hover:underline cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline" className="text-white border-white hover:bg-blue-800">Reports</Button>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Sign in</Button>
      </div>
    </nav>
  );
}
