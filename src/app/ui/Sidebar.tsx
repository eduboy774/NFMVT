/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from "classnames";

const Navigation = ({ navigation, activeItem, setActiveItem }) => {
  return (
    <ul className="flex flex-col py-4 space-y-1">
      {navigation.map((item) => (
        <li key={item.name} className="px-5">
          <a
            href={item.href}
            onClick={() => setActiveItem(item.name)}
            className={classNames(
              "relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6",
              { 'bg-gray-100 text-gray-900 border-indigo-500': activeItem === item.name }
            )}
          >
            <span className="inline-flex justify-center items-center ml-4">
              {item.icon}
            </span>
            <span className="ml-2 text-sm tracking-wide truncate">{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

const Sidebar = ({ navigation, activeItem, setActiveItem }) => {
  return (
    <div className="fixed top-0 left-0 w-64 bg-white h-full border-r z-10">
      <div className="flex items-center justify-center h-14 border-b">
        <div>
          <img src="./visual.png" alt="NFMVT Logo" className="h-12 w-16 rounded-full"/>
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <Navigation navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>
    </div>
  );
};

export default Sidebar;
