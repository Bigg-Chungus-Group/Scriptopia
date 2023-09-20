import React from "react";
import "./fzt.css";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const fzf = () => {
  return (
    <div className="fzf">
      <h1>
        Four<span>-</span>Zero<span>-</span>Three
      </h1>
      <h2>Server Is Under Maintainance</h2>
      <p>Please Try Again After the Maintainance is Completed</p>
    </div>
  );
};

export default fzf;
