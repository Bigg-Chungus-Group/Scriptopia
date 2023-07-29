import React, { useEffect } from "react";
import "./Code.css";
import "jquery";
import "jquery-ui/dist/jquery-ui";
import { useParams } from "react-router";
import Navbar from "../../components/Navbar";

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
      var editor = ace.edit("editor");

      editor.setTheme("ace/theme/one_dark");
      editor.session.setMode(`ace/mode/${aceLang[lang]}`);
      editor.setShowPrintMargin(false);
      document.getElementById("editor").style.fontSize = "15px";
      editor.setValue(template[lang]);
    }

    $(function () {
      $("#accordion").accordion({
        active: 1,
      });
    });

    fetch(`http://localhost:5000/problem/${id}/${lang}`, {
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
            console.log(data.content);
          }
        }
      });
  }, [exist]);

  const compile = () => {
    let code = ace.edit("editor").getValue();
    const output = document.getElementById("output");

    output.innerHTML = "Compiling Code....";
    code = `${code}`;
    console.log(code);

    fetch("http://localhost:5000/api/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, input: "3", lang, probId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          output.innerHTML = data.error;
        } else {
          output.innerHTML = `<pre>${data.output}</pre>`;
        }
      });
  };

  if (exist == "true") {
    return (
      <div className="Code">
        <div className="container">
          <Navbar />          

          <div className="main">
            <div className="left">
              <div className="top">{language[lang]}</div>
              <div id="editor"></div>
            </div>
            <div className="right">
              <div id="accordion">
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
              </div>
            </div>
          </div>
        </div>
      </div>
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
    return (
      <div className="Code">
        <div className="nf">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }
};

export default Code;
