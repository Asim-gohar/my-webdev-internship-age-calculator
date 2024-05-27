'use client'
import React, { useState } from 'react';
import { Input, Button, Text } from '@chakra-ui/react'; // Using Chakra UI for styling

interface AgeCalculatorProps {}

const AgeCalculator: React.FC<AgeCalculatorProps> = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [calculatedAge, setCalculatedAge] = useState<string>('');
  const [previousCalculations, setPreviousCalculations] = useState<{ userInput: string; calculatedAge: string }[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredDate = event.target.value;
    setErrorMessage(''); // Clear error on input change

    try {
      const dateParts = enteredDate.split('-');
      if (dateParts.length !== 3) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD.');
      }

      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
      const day = parseInt(dateParts[2], 10);

      const newDate = new Date(year, month, day);
      if (isNaN(newDate.getTime())) {
        throw new Error('Invalid date. Please enter a valid date.');
      }

      setBirthDate(newDate);
    } catch (error:any) {
      setErrorMessage(error.message);
    }
  };

  const calculateAge = () => {
    if (!birthDate) {
      setErrorMessage('Please enter your birth date.');
      return;
    }

    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const ageInMonths = today.getMonth() - birthDate.getMonth();
    const isBirthdayPassed = today.getDate() >= birthDate.getDate();

    let ageMessage: string;
    if (ageInMonths < 0 || (ageInMonths === 0 && !isBirthdayPassed)) {
      ageMessage = `${ageInYears - 1} years and ${12 + ageInMonths} months old`;
    } else {
      ageMessage = `${ageInYears} years and ${ageInMonths} months old`;
    }

    setCalculatedAge(ageMessage);

    // Store the current calculation in previousCalculations state
    setPreviousCalculations(prevCalculations => [...prevCalculations, { userInput: birthDate?.toLocaleDateString() || "", calculatedAge: ageMessage }]);
  };

  return (
    <div className="main-container border-2 border-gray-300 p-4">
      <h1 className="text-3xl font-bold mb-4">Age Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <Input
            type="date"
            onChange={handleInputChange}
            placeholder="Enter your birth date (YYYY-MM-DD)"
            isInvalid={!!errorMessage}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Tailwind CSS for styling
          />
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          <Button onClick={calculateAge} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
            Calculate Age
          </Button>
        </div>
        <div className="bg-green-100 p-4 rounded">
          {calculatedAge && (
            <>
              <Text className="text-lg font-semibold">Your Date of Birth:</Text>
              <Text className="text-xl font-bold mb-4">{birthDate?.toLocaleDateString()}</Text>
              <Text className="text-lg font-semibold">Calculated Age:</Text>
              <Text className="text-xl font-bold">{calculatedAge}</Text>
            </>
          )}
        </div>
      </div>
      {previousCalculations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Previous Calculations</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Input</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated Age</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previousCalculations.map((calculation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{calculation.userInput}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{calculation.calculatedAge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
