/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import LoaderComponent from "../../../component/Loader";
import enviroment from "@/componets/env";
import ArpDonut  from './AprDonut'


export default function ARPDrawing(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [getARP, setA] = useState([])
  const endpoint = enviroment?.endpoint;
  const [getCaseUuid, setCaseUuid] = useState(localStorage.getItem('case_uuid') || null);

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
    if (props.case_uuid) {
      setCaseUuid(props?.case_uuid);
      localStorage.setItem('case_uuid', props?.case_uuid);
    }
  }, [props.case_uuid]);

  useEffect(()=>{
    setIsLoading(true);
    fetch(`${endpoint}/get-arp-all?case_uuid=${getCaseUuid}`, {
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
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg">
          <div className="flex justify-center rounded">
              <div className="bg-gray-50">
                <ArpDonut arpData={getARP} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
