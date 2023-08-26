import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  Stack,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import APSIT from "./../../assets/img/apsit-logo.png";
import Logo from "./../../assets/img/logo.png";
import "./Auth.css";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

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
        if (res.status === 200) {
          const response = await res.json();
          console.log(response);
          if (response.role === "A") {
            window.location.href = "/admin";
          } else if (response.role === "F") {
            window.location.href = "/faculty";
          } else if (response.role === "S") {
            window.location.href = "/";
          }
        } else {
          const response = await res.json();
          setIsLoading(false);
          toast({
            title: response.title,
            description: response.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "An Error Occured.",
        description: "Something Went Wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="Auth">
      <Box className="left">
        <Box className="left-inner">
          <Heading>Did You Know?</Heading>
          <Text>
            {" "}
            the term "bug" in computer programming originated from a literal
            insect? In 1947, while working on the Harvard Mark II computer,
            computer scientist Grace Hopper encountered a malfunction caused by
            a moth that was trapped in a relay. The moth was carefully removed
            and taped to the logbook, along with a note that read "First actual
            case of bug being found." This incident led to the use of the term
            "bug" to describe a flaw or error in a computer program. Today, the
            term "debugging" is commonly used to refer to the process of
            identifying and fixing software issues.
          </Text>
          <Text className="creds">A Project by Bigg Chungus</Text>
        </Box>
      </Box>
      <Box className="right">
        <Box className="logos">
          <Image src={APSIT} className="img" draggable="false" />
          <Image src={Logo} className="img" draggable="false" />
        </Box>
        <Box className="title">
          <Heading>Hey, hello 👋</Heading>
          <Text>Sign in with your Moodle ID to Continue</Text>
        </Box>
        <Box>
          <FormLabel>Moodle ID</FormLabel>
          <Input id="mid" />
        </Box>

        <Box>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder=""
              id="pw"
            />
            <InputRightElement width="4.5rem" marginTop="2px" marginRight="3px">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>

        <Button
          className="btn"
          onClick={validateAndSubmit}
          isLoading={isLoading}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;
