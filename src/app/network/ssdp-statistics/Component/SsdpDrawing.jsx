/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import BarGraph from './SsdpBarchart'
import Donut from './SsdpDonut'
import LoaderComponent from "../../../component/Loader";
import enviroment from "@/componets/env";
import { useRouter } from "next/navigation";

export default function SsdpDrawing(case_uuid) {
  const [isLoading, setIsLoading] = useState(false);
  const [getAllSsdp, setAllSsdp] = useState([])
  const endpoint = enviroment?.endpoint;
  const [getCaseUuid,setCaseUuid] = useState(null)

  useEffect(() => {
    if (case_uuid) {
      setCaseUuid(case_uuid)
    }
  }, [case_uuid])

  // Fetch the task data from the API when the component is rendered 
  useEffect(() => {
      setIsLoading(true); 
      fetch(`${endpoint}/get-ssdp-all?case_uuid=${getCaseUuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          setAllSsdp(data)
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
                <BarGraph ssdpData={getAllSsdp}/>
              </div>
            </div>
            <div className="w-6/12">
              <div className="bg-gray-50 flex justify-center items-center rounded">
                <Donut ssdpData={getAllSsdp}/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
