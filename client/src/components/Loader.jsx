import React from "react";
import { Spinner } from "@chakra-ui/react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="nf">
      <div className="loader">
        <link
          href="https://fonts.googleapis.com/css?family=Russo+One"
          rel="stylesheet"
        ></link>
        <svg viewBox="0 0 1320 300">
          <text x="50%" y="50%" dy=".35em" textAnchor="middle">
            Scriptopia
          </text>
        </svg>
      </div>
      <div className="spinner">
        <Spinner />
      </div>
    </div>
  );
};

export default Loader;
