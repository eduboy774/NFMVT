import React, { useState, useEffect } from "react";

export default function CaseCounts({ caseData }) {
  const [registeredCases, setRegisteredCases] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [closedCases, setClosedCases] = useState(0);

  useEffect(() => {
    let registered = 0;
    let active = 0;
    let closed = 0;
    caseData.forEach((item) => {
      if (item.status === "registered") {
        registered++;
      } else if (item.status === "active") {
        active++;
      } else if (item.status === "closed") {
        closed++;
      }
    });
    setRegisteredCases(registered);
    setActiveCases(active);
    setClosedCases(closed);
  }, [caseData]);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="py-10 p-3 rounded-lg">
        <div className="grid grid-cols-5 gap-3 mb-2 hover:shadow-lime-50">
          <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
            <dt className="w-8 h-8 rounded-full bg-gray-500 text-orange-300 text-sm font-medium flex items-center justify-center mb-1">
              {registeredCases}
            </dt>
            <dd className="text-orange-300 text-sm font-medium mb-1">Registered Cases</dd>
          </dl>
          <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
            <dt className="w-8 h-8 rounded-full bg-gray-500 text-teal-300 text-sm font-medium flex items-center justify-center mb-1">
              {activeCases}
            </dt>
            <dd className="text-teal-300 text-sm font-medium mb-1">Active Cases</dd>
          </dl>
          <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[120px] m-1">
            <dt className="w-8 h-8 rounded-full bg-gray-500 text-blue-300 text-sm font-medium flex items-center justify-center mb-1">
              {closedCases}
            </dt>
            <dd className="text-blue-300 text-sm font-medium mb-1">Closed Cases</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
