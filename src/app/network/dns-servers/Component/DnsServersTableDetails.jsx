/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import ReactPaginate from 'react-paginate';
import LoaderComponent from '../../../component/Loader'
import enviroment from "@/componets/env";


export default function DnsTableDetails(props) {

  const [getDNSservers, setDNSservers] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [forcePage, setForcePage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const endpoint = enviroment?.endpoint;
  const [getCaseUuid, setCaseUuid] = useState(localStorage.getItem('case_uuid') || null);

  useEffect(() => {
    if (props.case_uuid) {
      setCaseUuid(props.case_uuid);
      localStorage.setItem('case_uuid', props.case_uuid);
    }
  }, [props.case_uuid]);

  // Fetch the task data from the API when the component is rendered
  useEffect(()=>{
    setIsLoading(true);
    fetch(`${endpoint}/get-dns-servers?page=${page}&limit=${limit}&case_uuid=${getCaseUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        setDNSservers(data?.data);
        console.log("data " + data);
        setPageCount(data?.pageCount);
        setForcePage(data?.page - 1);
        setIsLoading(false);
      });
    });
  },[page,limit]
  )

  // Pagination controls
  const handlePageChange = ({ selected }) => {
    setPage(selected+1);
  };

if (isLoading) return <LoaderComponent />

  return (
   <>
     <section className="dark:bg-gray-900 p-3 mt-4">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-400 dark:text-gray-200">
                <tr>
                  {/*<th scope="col" className="px-4 py-3">ID</th>*/}
                  <th scope="col" className="px-4 py-3">Packet Number</th>
                  <th scope="col" className="px-4 py-3">Time Elapsed</th>
                  <th scope="col" className="px-4 py-3">Source IP</th>
                  <th scope="col" className="px-4 py-3">Destination IP</th>
                  <th scope="col" className="px-4 py-3">Packet Length</th>
                </tr>
                </thead>
                <tbody>
                {getDNSservers?.map((item, index) => (
                  <tr className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700`} key={item.case_uuid}>
                    {/*<td className="px-4 py-3">{index + 1}</td>*/}
                    <td className="px-4 py-3">{item.packetNumber}</td>
                    <td className="px-4 py-3">{item.timeElapsed}</td>
                    <td className="px-4 py-3">{item.sourceIp}</td>
                    <td className="px-4 py-3">{item.destinationIp}</td>
                    <td className="px-4 py-3">{item.packetLength}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
              { getDNSservers?.length === 0 &&(<div className="flex justify-center py-4">
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
