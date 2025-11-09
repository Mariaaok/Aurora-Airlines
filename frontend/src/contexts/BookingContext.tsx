import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Flight } from '../flights.constants';

interface SearchData {
    from: string;
    to: string;
    departureDate: string;
    returnDate: string;
}

export interface PassengerData {
    fullName: string;
    birthday: string;
    phoneNumber: string;
    cpf: string;
    email: string;
    rg: string;
}

interface BookingContextType {
    searchData: SearchData | null;
    setSearchData: (data: SearchData) => void;
    
    departureFlight: Flight | null;
    setDepartureFlight: (flight: Flight) => void;
    
    departureSeats: string[];
    setDepartureSeats: (seats: string[]) => void;
    
    returnFlight: Flight | null;
    setReturnFlight: (flight: Flight) => void;
    
    returnSeats: string[];
    setReturnSeats: (seats: string[]) => void;
    
    passengers: PassengerData[];
    setPassengers: (passengers: PassengerData[]) => void;
    
    passengerCount: number;
    
    clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchData, setSearchData] = useState<SearchData | null>(null);
    const [departureFlight, setDepartureFlight] = useState<Flight | null>(null);
    const [departureSeats, setDepartureSeats] = useState<string[]>([]);
    const [returnFlight, setReturnFlight] = useState<Flight | null>(null);
    const [returnSeats, setReturnSeats] = useState<string[]>([]);
    const [passengers, setPassengers] = useState<PassengerData[]>([]);

    const passengerCount = departureSeats.length;

    const clearBooking = () => {
        setSearchData(null);
        setDepartureFlight(null);
        setDepartureSeats([]);
        setReturnFlight(null);
        setReturnSeats([]);
        setPassengers([]);
    };

    return (
        <BookingContext.Provider
            value={{
                searchData,
                setSearchData,
                departureFlight,
                setDepartureFlight,
                departureSeats,
                setDepartureSeats,
                returnFlight,
                setReturnFlight,
                returnSeats,
                setReturnSeats,
                passengers,
                setPassengers,
                passengerCount,
                clearBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = (): BookingContextType => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
