// CommonStatistics.js
import React from "react";

export default function CommonStatistics({ registeredCases, activeCases, closedCases, onCategoryClick }) {
  return (
    <div className="grid grid-cols-5 gap-3 mb-2 hover:shadow-lime-50">
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1 cursor-pointer" onClick={() => onCategoryClick("registered")}>
        <dt className="w-8 h-8 rounded-full bg-orange-500 text-gray-100 text-sm font-medium flex items-center justify-center mb-1">
          {registeredCases}
        </dt>
        <dd className="text-gray-100 text-sm font-medium mb-1">Registered Cases</dd>
      </dl>
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1 cursor-pointer" onClick={() => onCategoryClick("active")}>
        <dt className="w-8 h-8 rounded-full bg-teal-500 text-gray-100 text-sm font-medium flex items-center justify-center mb-1">
          {activeCases}
        </dt>
        <dd className="text-gray-100 text-sm font-medium mb-1">Active Cases</dd>
      </dl>
      <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1 cursor-pointer" onClick={() => onCategoryClick("closed")}>
        <dt className="w-8 h-8 rounded-full bg-blue-500 text-gray-100 text-sm font-medium flex items-center justify-center mb-1">
          {closedCases}
        </dt>
        <dd className="text-gray-100 text-sm font-medium mb-1">Closed Cases</dd>
      </dl>
    </div>
  );
}
