import React from 'react';
import Loader from "react-js-loader";

const LoaderComponent = () => {
  return (
    <div className="loader">
     
      <div className='flex justify-center items-center h-screen'>
              <Loader type="bubble" bgColor={"#77522F"} color={"black"}  size={40}/>
              </div>;
            
    </div>
  );
};

export default Loader;
