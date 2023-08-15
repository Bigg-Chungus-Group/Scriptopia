import React, { useState } from "react";
import "../../assets/fa/css/all.css";
import "./Auth.css";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Cookies from "js-cookie";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const [err, setErr] = useState(" ");
  const handleClick = () => setShow(!show);

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const mid = document.querySelector("#mid").value;
    const pwd = document.querySelector("#pw").value;

    try {
      // TODO: ADD BACKEND LOGIC HERE
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mid: mid.trim(), password: pwd.trim() }),
      }).then(async (res) => {
        res.status === 200
          ? (window.location.href = "/")
          : setErr(await res.json().then((data) => data.message));
        setIsLoading(false);
      });
    } catch (error) {
      setErr("Something Went Wrong");
      setIsLoading(false);
    }
  };

  return (
    <Box className="Auth">
      <Box className="left">
        <i className="fa-duotone fa-code"></i>
        <Heading className="heading">Welcome to Scriptopia</Heading>
        <Input placeholder="Moodle ID" id="mid" />
        <InputGroup size="md" className="pw">
          <Input
            id="pw"
            type={show ? "text" : "password"}
            placeholder="Password"
          />
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
        <pre>{err}</pre>
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
