import React, {useEffect, useState} from "react";
import BarGraph from '../../../component/Barchart'
import Donut from '../../../component/Donut'
import LoaderComponent from "../../../component/Loader";


export default function SsdpDrawing() {

 
  const [isLoading, setIsLoading] = useState(false);
  const [getAllSsdp,setAllSsdp] = useState([])


  // Fetch the task data from the API when the component is rendered
  useEffect(()=>{
    setIsLoading(true);
    fetch("http://localhost:3000/api/get-all-ssdp", {
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

  console.log('getAllSsdp',getAllSsdp);
  
if (isLoading)  return LoaderComponent

  


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