/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LoaderComponent from "../../../component/Loader";
import enviroment from "@/componets/env";
import ArpBarGraph from './ARPBarchart'
import ArpDonut from './ARPDonut'

export default function ARPDrawing() {
  const [isLoading, setIsLoading] = useState(false);
  const [getARP, setA] = useState([])
  const endpoint = enviroment?.endpoint;

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
    setIsLoading(true);
    fetch(endpoint + '/get-arp-all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setA(data)
        setIsLoading(false);
      });
    });
  },
    []
  )


  if (isLoading) return LoaderComponent

  return (
    <>
      <section className="dark:bg-gray-900 p-3 mt-4">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex mt-5 gap-3">
            <div className="w-6/12">
              <div className="bg-gray-50 rounded">
                <ArpBarGraph arpData={getARP} />
              </div>
            </div>
            <div className="w-6/12">
              <div className="bg-gray-50 flex justify-center items-center rounded">
                <ArpDonut arpData={getARP} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
