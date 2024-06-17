/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BarGraph from './OpenPortsBarchart';
import LoaderComponent from "../../../component/Loader";
import enviroment from "@/componets/env";

export default function OpenPortsDrawing(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [getOpenPorts, setOpenPorts] = useState([])
  const endpoint = enviroment?.endpoint


  const [getCaseUuid, setCaseUuid] = useState(localStorage.getItem('case_uuid') || null);

  useEffect(() => {
    if (props.case_uuid) {
      setCaseUuid(props);
      localStorage.setItem('case_uuid', props);
    }
  }, [props.case_uuid]);
  

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
    setIsLoading(true);
    fetch(`${endpoint}/get-open-ports-all?case_uuid=${getCaseUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setOpenPorts(data)
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
          <div className="rounded">
              <div className="bg-gray-50">
                <BarGraph openPortsData={getOpenPorts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
