import React from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default function TableForDataAfterUploading(){
  return(  
    <>
    <div className="bg-gray-50 py-4  p-3 rounded-lg">
                                        <div className="grid grid-cols-5 gap-3 mb-2 hover:shadow-lime-50">
                                        <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt className="w-8 h-8 rounded-full bg-gray-500 text-orange-300 text-sm font-medium flex items-center justify-center mb-1">{11}</dt>
                                            <dd className="text-orange-300 text-sm font-medium">Registration</dd>
                                        </dl>
                                        <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt className="w-8 h-8 rounded-full bg-gray-500 text-teal-300 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
                                            <dd className="text-teal-300 text-sm font-medium">Scanning</dd>
                                        </dl>
                                        <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt className="w-8 h-8 rounded-full bg-gray-500 text-blue-300 text-sm font-medium flex items-center justify-center mb-1">{23}</dt>
                                            <dd className="text-blue-300 text-sm font-medium">Quality Check</dd>
                                        </dl>
                                        <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt className="w-8 h-8 rounded-full bg-gray-500 text-red-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
                                            <dd className="text-red-400  text-sm font-medium">Approval</dd>
                                        </dl>
                                        <dl className="bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                            <dt className="w-8 h-8 rounded-full bg-gray-500 text-green-400 text-sm font-medium flex items-center justify-center mb-1">{12}</dt>
                                            <dd className="text-green-400  text-sm font-medium">Total</dd>
                                        </dl>
                                        </div>
                        </div>
    </>
    
  )
}
