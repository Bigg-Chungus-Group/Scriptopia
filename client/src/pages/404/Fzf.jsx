import React from "react";
import "./fzf.css";
import fzfpic from "../../assets/img/404.svg";
import { Button } from "@chakra-ui/react";

const fzf = () => {
  return (
    <div className="fzf">
      
      <h1>Four<span>-</span>Zero<span>-</span>Four</h1>
      <h2>Page Not Found</h2>
      <p>It may be deleted, moved, or you may not have access to it.</p>
      <p>Think Its a Bug? Ight, Send Feedback <a href="/feedback">Here</a></p>
      <Button
        colorScheme="blue"
        variant="solid"
        size="lg"
        onClick={() => (window.location.href = "/")}
      >
        Go To Home
      </Button>
    </div>
  );
};

export default fzf;
