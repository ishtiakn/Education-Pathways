import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

const override: React.CSSProperties = {
  margin: "60px auto",
};
const spinner = () => {
  return (
    <div>
      <BounceLoader
        cssOverride={override}
        size={150}
        color={"#1C3E6E"}
        loading={true}
        speedMultiplier={1.5}
      />
    </div>
  );
};

export default spinner;
