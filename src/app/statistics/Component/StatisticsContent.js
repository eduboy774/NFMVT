import React, {useEffect, useState} from "react";
import {ChevronRightIcon  } from '@heroicons/react/24/outline';
import ReactPaginate from 'react-paginate';
import Loader from "react-js-loader";
export default function StatisticsContent() {

  const [getAllSsdp, setAllSsdpData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [forcePage, setForcePage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Fetch the task data from the API when the component is rendered
  useEffect(()=>{
    setIsLoading(true);
    fetch(`http://localhost:3000/api/get-ssdp?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setAllSsdpData(data?.data); 
        setPageCount(data?.pageCount);
        setForcePage(data?.page - 1);
        setIsLoading(false);
      });
    });
  }
,[page,limit]
  )

  // Pagination controls
  const handlePageChange = ({ selected }) => {
    setPage(selected+1);
  };
  
  // Handle delete
  const handleDelete = () => {
    console.log('deleting');
  }


if (isLoading) {
  return <div className='flex justify-center items-center h-screen'>
    <Loader type="bubble"  bgColor={"#6c757d"} color={"black"}  size={80} />
  </div>;
}


  return (
   <>
   <section className="dark:bg-gray-900 p-3 mt-4">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-400 dark:text-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Packet Number</th>
                  <th scope="col" className="px-4 py-3">Time Elapsed</th>
                  <th scope="col" className="px-4 py-3">Source Ip</th>
                  <th scope="col" className="px-4 py-3">Destination Ip</th>
                  <th scope="col" className="px-4 py-3">Packet Length</th>
                  <th scope="col" className="px-4 py-3">Protocol</th>
                  <th scope="col" className="px-4 py-3">HTTP Method</th>
                  <th scope="col" className="px-4 py-3">HTTP Request Target</th>

                  {/*<th scope="col" className="px-4 py-3" colSpan={5}>Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {getAllSsdp?.map((item, index) => (
                  <tr className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700`} key={item.case_uuid}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{item.packetNumber}</td>
                    <td className="px-4 py-3">{item.timeElapsed}</td>
                    <td className="px-4 py-3">{item.sourceIp}</td>
                    <td className="px-4 py-3">{item.destinationIp}</td>
                    <td className="px-4 py-3">{item.packetLength}</td>
                    <td className="px-4 py-3">{item.protocol}</td>
                    <td className="px-4 py-3">{item.httpMethod}</td>
                    <td className="px-4 py-3">{item.httpRequestTarget}</td>

                    {/*<td className="py-4" colSpan={3}>*/}
                    {/*  <button className="btn-icon-primary px-2" onClick={() => handleDelete(item.case_uuid)}>*/}
                    {/*    <ChevronRightIcon className="w-6 h-6 text-grey-300"/>*/}
                    {/*  </button>*/}
                    {/*</td>*/}
                  </tr>
                ))}
                
                </tbody>
                
              </table>
            </div>
              { getAllSsdp?.length ===0 &&(<div className="flex justify-center py-4">
                <span className="text-grey-300 py-4 px-4 text-md text-gray-700 dark:text-gray-200 border rounded">No Data Found</span>
              </div>)}    

            <nav>
              <div className="flex justify-center py-2 mt-4">
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  breakLabel="..."
                  pageCount={pageCount}
                  forcePage={forcePage}
                  renderOnZeroPageCount={null}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName="pagination flex flex-row"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  activeClassName="active"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link" 
                  />
              </div>
            </nav>
          </div>
        </section>
   </>
  );
}
