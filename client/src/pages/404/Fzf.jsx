import React from "react";
import "./fzf.css";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const fzf = () => {
  return (
    <div className="fzf">
      <h1>
        Four<span>-</span>Zero<span>-</span>Four
      </h1>
      <h2>Page Not Found</h2>
      <p>It may be deleted, moved, or you may not have access to it.</p>
      <p>
        Think Its a Bug? Ight, Send Feedback <a href="/feedback">Here</a>
      </p>
      <Link to="/">
        <Button colorScheme="blue" variant="solid" size="lg">
          Go To Home
        </Button>
      </Link>
    </div>
  );
};

export default fzf;
