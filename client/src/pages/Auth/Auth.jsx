import React, { useState } from "react";
import "../../assets/fa/css/all.css";
import "./Auth.css";
import validator from "validator";
import { Button } from "@chakra-ui/react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const validateAndSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const mid = document.querySelector("#mid").value;
    const pwd = document.querySelector(".pwd input").value;
    const err = document.querySelector("#err");
    const btn = document.querySelector("#btn");

    btn.setAttribute("isLoading", "true");

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
    const btn = document.querySelector("#btn");
    err.innerHTML = "Invalid Credentials";
    setIsLoading(false);
  };

  return (
    <div className="Auth">
      <div className="container">
        <div className="left">
          <i className="fa-duotone fa-code 2xs"></i>

          <h2>Welcome to Scriptopia</h2>

          <form action="" method="POST">
            <input type="number" placeholder="Moodle ID" id="mid" />
            <div className="pwd">
              <input type={show ? "text" : "password"} placeholder="Password" />
              <i
                class={
                  show
                    ? "fa-sharp fa-solid fa-eye"
                    : "fa-sharp fa-solid fa-eye-low-vision"
                }
                onClick={handleClick}
              ></i>
            </div>

            <Button
              colorScheme="brand"
              isLoading={isLoading}
              onClick={validateAndSubmit}
              id="btn"
            >
              Login
            </Button>

            <p className="credit">A Project By Bigg Chungus</p>

            <p id="err">&nbsp;</p>
          </form>
        </div>

        <div className="right">
          <h3>Did You Know?</h3>
          <p>
            the term "bug" in computer programming originated from a literal
            insect? In 1947, while working on the Harvard Mark II computer,
            computer scientist Grace Hopper encountered a malfunction caused by
            a moth that was trapped in a relay. The moth was carefully removed
            and taped to the logbook, along with a note that read "First actual
            case of bug being found." This incident led to the use of the term
            "bug" to describe a flaw or error in a computer program. Today, the
            term "debugging" is commonly used to refer to the process of
            identifying and fixing software issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
