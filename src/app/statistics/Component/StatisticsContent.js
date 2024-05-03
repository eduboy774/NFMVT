import React,{useState} from "react";


export default function  StatisticsContent()
{

  const [allIps, setAllIps] = useState([]);

   // Fetch the task data from the API when the component is rendered
   fetch("http://localhost:3000/api/get-ipv4hosts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      setAllIps(data); // Set the task data state with the API response
    });
  });
  return(
   <>
     {allIps}
   </>
  );
}
