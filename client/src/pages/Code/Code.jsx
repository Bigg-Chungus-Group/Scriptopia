import React, { useEffect } from "react";
import "./Code.css";
import "jquery";
import "jquery-ui/dist/jquery-ui";
import { useParams } from "react-router";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  AccordionPanel,
  Button,
} from "@chakra-ui/react";

const aceLang = {
  js: "javascript",
  java: "java",
  py: "python",
  cpp: "c_cpp",
  c: "c_cpp",
  go: "golang",
  cs: "csharp",
};

const language = {
  js: "JavaScript",
  java: "Java",
  py: "Python",
  cpp: "C++",
  c: "C",
  go: "GoLang",
  cs: "C#",
};

const template = {
  js: `function add(a, b) {\n  // Your Code Goes Here\n}\n\nfunction main() {\n  // ! Do Not Modify This Function\n  const input = prompt();\n  const values = input.split(\" \");\n\n  const a = Number(values[0]);\n  const b = Number(values[1]);\n\n  add(a, b);\n}\n\nmain();`,
};

const Code = () => {
  const [exist, setExist] = React.useState("loading");
  const { id, lang } = useParams();

  useEffect(() => {
    if (exist == "true") {
      // ! SET LOADING TO TRUE
      var editor = ace.edit("editor");

      editor.setTheme("ace/theme/one_dark");
      editor.container.style.background = "#28282b";
      document.getElementsByClassName("ace_gutter")[0].style.background =
        "#28282b";
      editor.session.setMode(`ace/mode/${aceLang[lang]}`);
      editor.setShowPrintMargin(false);
      document.getElementById("editor").style.fontSize = "15px";
      editor.setValue(template[lang]);
    }

    fetch(`http://localhost:5000/problem/${lang}/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setExist("true");
        } else {
          setExist("true");
          if (exist == "true") {
            document.getElementById("title").innerHTML = data.codeTitle;
            document.getElementById("content").innerHTML = data.codeContent;
          }
        }
      });
  }, [exist]);

  const compile = () => {
    let code = ace.edit("editor").getValue();
    const output = document.getElementById("output");

    output.innerHTML = "Compiling Code....";
    code = `${code}`;

    fetch("http://localhost:5000/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, input: "3", lang, probId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          output.innerHTML = data.error;
        } else {
          output.innerHTML = `<pre>${data.output}</pre>`;
        }
      });
  };

  if (exist == "true") {
    // ! CHANGE THIS IF PROBLEM IS REGARDING LOADING (exist == "loading")
    return (
      <>
        <Navbar />
        <div className="Code">
          <div className="container">
            <div className="main">
              <div className="left">
                <div className="top">
                  {language[lang]}{" "}
                  <div className="buttons">
                    <Button className="btn" onClick={compile}>
                      Run Tests
                    </Button>
                    <Button className="btn">Submit</Button>
                  </div>
                </div>
                <div id="editor"></div>
              </div>
              <div className="right">
                <Accordion defaultIndex={0}>
                  <AccordionItem
                    border="none"
                    bg="#323238"
                    borderTopRadius="10px"
                  >
                    <h2>
                      <AccordionButton
                        bg="#28282b"
                        borderTopRadius="10px"
                        height="63px"
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Statement
                        </Box>

                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      height="69vh "
                      className="prob"
                      id="prob"
                    >
                      <h2 id="title"></h2>
                      <span id="content"></span>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    border="none"
                    bg="#323238"
                    borderBottomRadius="10px"
                  >
                    <h2>
                      <AccordionButton
                        bg="#28282b"
                        borderBottomRadius="10px"
                        height="63px"
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Console
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      height="69vh"
                      className="output"
                      id="output"
                    ></AccordionPanel>
                  </AccordionItem>
                </Accordion>
                {/*} <div id="accordion">
                <div className="button-wrapper">
                  <p>Output Console</p>
                  <div className="buttons">
                    <button className="btn" onClick={compile}>
                      Run Tests
                    </button>
                    <button className="btn">Submit</button>
                  </div>
                </div>

                <div className="output" id="output"></div>
                <p className="output-text">Statement</p>
                <div className="prob" id="prob">
                  <h2 id="title"></h2>
                  <span id="content"></span>
                </div>
              </div>{*/}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (exist == "false") {
    return (
      <div className="Code">
        <div className="nf">
          <div id="editor" style={{ display: "None" }}></div>
          <h1>Problem Not Found</h1>
        </div>
      </div>
    );
  } else if (exist == "loading") {
    return <Loader />;
  }
};

export default Code;
