import React from 'react';
import Loader from "react-js-loader";

const LoaderComponent = () => {
  return (
    <div className="loader">
      <div className='flex justify-center items-center h-screen'>
              <Loader type="bubble"  bgColor={"#6c757d"} color={"black"}  size={80} />
        </div>;
    </div>
  );
};

export default LoaderComponent;
