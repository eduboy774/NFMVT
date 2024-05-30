// CommonStatistics.js
import React from "react";

export default function CommonStatistics({ registeredCases, activeCases, closedCases, onCategoryClick }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[150px] w-full cursor-pointer hover:shadow-lg" onClick={() => onCategoryClick("registered")}>
        <dt className="w-12 h-12 rounded-full bg-orange-500 text-gray-100 text-lg font-medium flex items-center justify-center mb-2">
          {registeredCases}
        </dt>
        <dd className="text-gray-100 text-lg font-medium">Registered Cases</dd>
      </dl>
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[150px] w-full cursor-pointer hover:shadow-lg" onClick={() => onCategoryClick("active")}>
        <dt className="w-12 h-12 rounded-full bg-teal-500 text-gray-100 text-lg font-medium flex items-center justify-center mb-2">
          {activeCases}
        </dt>
        <dd className="text-gray-100 text-lg font-medium">Active Cases</dd>
      </dl>
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[150px] w-full cursor-pointer hover:shadow-lg" onClick={() => onCategoryClick("closed")}>
        <dt className="w-12 h-12 rounded-full bg-blue-500 text-gray-100 text-lg font-medium flex items-center justify-center mb-2">
          {closedCases}
        </dt>
        <dd className="text-gray-100 text-sm font-medium mb-1">Closed Cases</dd>
      </dl>
    </div>
  );
}
