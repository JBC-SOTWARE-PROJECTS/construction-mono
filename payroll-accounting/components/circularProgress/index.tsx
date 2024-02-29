import React from "react";

interface Iprops {
  className: string;
}

const CircularProgress = ({ className }: Iprops) => (
  <div className={`loader ${className}`}>
    <img src="/images/loader-sync.svg" alt="loader" style={{ height: 60 }} />
  </div>
);
export default CircularProgress;
CircularProgress.defaultProps = {
  className: "",
};
