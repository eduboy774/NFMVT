/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState,useEffect } from 'react';

const DropdownMenu = ({isModalClicked }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  useEffect( () =>{
    setIsMenuOpen(isModalClicked);
  },[isModalClicked])

  const onClickViewDocProp=()=>{
    console.log();
  }
  return (
    <div className="relative">
      <button
        id="dropdownMenuIconButton"
        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
        type="button"
        onClick={toggleMenu}
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>

      {isMenuOpen && (
        <div
          id="dropdownDots"
          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
            <li>
              <a onClick={onClickViewDocProp} className="block px-4 py-2  cursor-pointer hover:bg-[#77522F] hover:text-white">
                View Details
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};


export default DropdownMenu;
