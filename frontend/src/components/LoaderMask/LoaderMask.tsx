import * as React from 'react';

import loaderIcon from './three-dots.svg';

const LoaderMask = () => (
  <div className="container">
    <div className="row d-flex justify-content-center align-items-center mt-4">
      <img src={loaderIcon} className="loader-mask d-block" alt="loaderMask" />
    </div>
    <div className="row d-flex justify-content-center align-items-center m-5">
      <span className="text-secondary h5">Loading...</span>
    </div>
  </div>
);
export default LoaderMask;
