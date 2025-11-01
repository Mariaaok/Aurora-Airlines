import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const adminItems = [
    { label: "Flights", path: "/admin/flights" },
    { label: "Flight Types", path: "/admin/flightTypesPage" },
    { label: "Aircraft Types", path: "/admin/aircraftTypes" },
    { label: "Aircrafts", path: "/admin/aircrafts" },
    { label: "Airports", path: "/admin/airports" },
    { label: "Employees", path: "/admin/employees" },
];

export const AdminTabs: React.FC = () => {
    const location = useLocation();

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto">
                <nav className="flex space-x-4 pt-2"> 
                    {adminItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => 
                                `py-3 px-2 text-sm font-medium transition duration-150 ease-in-out 
                                ${isActive 
                                    ? 'border-b-2 border-blue-600 text-blue-900 font-semibold' 
                                    : 'text-gray-500 hover:text-blue-600 hover:border-blue-300 border-b-2 border-transparent'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};