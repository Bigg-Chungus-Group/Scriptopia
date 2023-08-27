import React from "react";
import { Spinner } from "@chakra-ui/react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="nf">
      <div className="spinner">
        <Spinner />
      </div>
    </div>
  );
};

export default Loader;
