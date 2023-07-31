import React, { useState } from "react";
import "../../assets/fa/css/all.css";
import "./Auth.css";
import validator from "validator";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const mid = document.querySelector("#mid").value;
    const pwd = document.querySelector("#pw").value;
    const err = document.querySelector("#err");
    err.innerHTML = "&nbsp;";

    try {
      if (validator.isNumeric(mid) && validator.isLength(pwd, { min: 8 })) {
        // TODO: ADD BACKEND LOGIC HERE
        fetch("http://localhost:5000/auth/", {
          method: "POST",
          cors: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mid: mid.trim(), password: pwd.trim() }),
        }).then((res) => {
          res.status === 200
            ? (window.location.href = "/dashboard")
            : handleInvalidCredentials();
        });
      } else {
        handleInvalidCredentials();
      }
    } catch (error) {
      console.log(error);
      handleInvalidCredentials();
    }
  };

  const handleInvalidCredentials = () => {
    const err = document.querySelector("#err");
    err.innerHTML = "Invalid Credentials";
    setIsLoading(false);
  };

  return (
    <Box className="Auth">
      <Box className="left">
        <i className="fa-duotone fa-code"></i>
        <Heading className="heading">Welcome to Scriptopia</Heading>
        <Input placeholder="Moodle ID" id="mid"/>
        <InputGroup size="md" className="pw">
          <Input id="pw" type={show ? "text" : "password"} placeholder="Password" />
          <InputRightElement width="4.5rem">
            <Button onClick={handleClick} className="showpw" colorScheme="blue">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          type="submit"
          onClick={validateAndSubmit}
          className="submit"
          colorScheme="brand"
          isLoading={isLoading}
        >
          Login
        </Button>
        <p className="creds">A Project By Bigg Chungus</p>
        <p id="err">&nbsp;</p>
      </Box>
      <Box className="right">
        <h1>Did You Know?</h1>
        <p>
          the term "bug" in computer programming originated from a literal
          insect? In 1947, while working on the Harvard Mark II computer,
          computer scientist Grace Hopper encountered a malfunction caused by a
          moth that was trapped in a relay. The moth was carefully removed and
          taped to the logbook, along with a note that read "First actual case
          of bug being found." This incident led to the use of the term "bug" to
          describe a flaw or error in a computer program. Today, the term
          "debugging" is commonly used to refer to the process of identifying
          and fixing software issues.
        </p>
      </Box>
    </Box>
  );
};

export default Auth;
