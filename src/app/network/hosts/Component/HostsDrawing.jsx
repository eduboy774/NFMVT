import React, {useEffect, useState} from "react";
import BarGraph from '../../../component/Barchart';
import Donut from '../../../component/Donut'
import LoaderComponent from "../../../component/Loader";

export default function HostsDrawing() {
  const [isLoading, setIsLoading] = useState(false);
  const [getHosts, setHosts] = useState([])

  // Fetch the task data from the API when the component is rendered
  useEffect(() => {
      setIsLoading(true);
      fetch("http://localhost:3000/api/get-hosts-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((data) => {
          setHosts(data)
          setIsLoading(false);
        });
      });
    },
    []
  )

  console.log('getHosts', getHosts);

  if (isLoading) return LoaderComponent
  
  return (
    <>
      <section className="dark:bg-gray-900 p-3 mt-4">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex mt-5 gap-3">
            <div className="w-6/12">
              <div className="bg-gray-50 rounded">
                <BarGraph ssdpData={getHosts}/>
              </div>
            </div>
            <div className="w-6/12">
              <div className="bg-gray-50 flex justify-center items-center rounded">
                <Donut ssdpData={getHosts}/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
