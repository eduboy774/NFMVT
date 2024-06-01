/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import Donut from '../../ssdp-statistics/Component/SsdpDonut'
import LoaderComponent from "../../../component/Loader";
import BarGraph from '../../ssdp-statistics/Component/SsdpBarchart'
import enviroment from "@/componets/env";

export default function SsdpDrawing() {

 
  const [isLoading, setIsLoading] = useState(false);
  const [getAllArp,setAllArp] = useState([])
  const endpoint = enviroment?.endpoint;

  // Fetch the task data from the API when the component is rendered
  useEffect(()=>{
    setIsLoading(true);
    fetch(endpoint+'/get-all-arp', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setAllArp(data)
        setIsLoading(false);
      });
    });
  },
  []
  )

  
if (isLoading)  return LoaderComponent

  return (
   <>
     <section className="dark:bg-gray-900 p-3 mt-4">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex mt-5 gap-3">
                           <div className="w-6/12">
                            <div className="bg-gray-50 rounded">
                            <BarGraph ssdpData={getAllArp}/>
                            </div>
                           </div>
                           <div className="w-6/12">
                               <div className="bg-gray-50 flex justify-center items-center rounded">
                                <Donut ssdpData={getAllArp}/>
                                </div> 
                           </div>
                        </div>
          </div>
        </section>
   </>
  );
}
