/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BarGraph from './HttpEverthingBarchart';
import Donut from './HttpEverythingDonut'
import LoaderComponent from "../../../component/Loader";
import enviroment from "@/componets/env";

export default function HttpEverythingDrawing() {
  const [isLoading, setIsLoading] = useState(false);
  const [gethttpEverything, sethttpEverything] = useState([])
  const endpoint = enviroment?.endpoint;

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
    setIsLoading(true);
    fetch(endpoint + '/get-ssdp-all', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        sethttpEverything(data)
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
                <BarGraph httpEverythingData={gethttpEverything} />
              </div>
            </div>
            <div className="w-6/12">
              <div className="bg-gray-50 flex justify-center items-center rounded">
                <Donut httpEverythingData={gethttpEverything} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
