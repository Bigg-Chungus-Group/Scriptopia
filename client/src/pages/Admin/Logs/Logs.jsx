import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/admin/Navbar";
import "./Logs.css";
import jsPDF from "jspdf";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthCheck } from "../../../hooks/useAuthCheck";
import Loader from "../../../components/Loader";

const Logs = () => {
  const [loading, setLoading] = useState(true);
  useAuthCheck("A");
  const [logs, setLogs] = useState("");
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/logs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        const logLines = data.data.split("\n").map((line, index) => {
          const [time, message] = line.split("] ");
          return (
            <div key={index}>
              <span className="log-time">{time.length > 0 ? time + "]" : ""}</span>
              {message}
            </div>
          );
        });
        setLogs(logLines);
        setLoading(false);
      })
      .catch((err) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Error fetching logs.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLogs([<div key="error">Error fetching logs! {err}</div>]);
      });
  }, []);

  useEffect(() => {
    const logContainer = document.querySelector(".log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  const search = (e) => {
    const searchValue = e.target.value;
    const logContainer = document.querySelector(".log-container");
    const logLines = logContainer.querySelectorAll("div");
    logLines.forEach((line) => {
      if (line.innerText.toLowerCase().includes(searchValue.toLowerCase())) {
        line.style.display = "block";
      } else {
        line.style.display = "none";
      }
    });
  };

  const deleteLogs = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/logs/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast({
            title: "Logs Deleted",
            description: "Server logs have been deleted.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setLogs("");
          onClose();
        } else {
          toast({
            title: "Error",
            description: "Error deleting logs.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error deleting logs.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const exportAsPDF = () => {
    const logContainer = document.querySelector(".log-container");
    const logLines = logContainer.querySelectorAll("div");
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Server Logs", 10, 10);
    doc.setFontSize(10);
    let y = 20;
    logLines.forEach((line) => {
      const text = line.innerText;
      const maxWidth = 180;
      const wrappedText = doc.splitTextToSize(text, maxWidth);
      doc.text(wrappedText, 10, y);
      y += wrappedText.length * 6; // Adjust the line spacing as needed
    });
    doc.save("server-logs.pdf");
  };

  const exportAsTXT = () => {
    const logContainer = document.querySelector(".log-container");
    const logLines = logContainer.querySelectorAll("div");
    let text = "Server Logs\n\n";
    logLines.forEach((line) => {
      text += line.innerText + "\n";
    });
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "server-logs.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="AdminLogs">
          <Flex alignItems="center" direction="row" gap="20px" wrap="wrap">
            <Heading>Server Logs</Heading>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="green"
              >
                Export
              </MenuButton>
              <MenuList>
                <MenuItem onClick={exportAsPDF}>Export as .PDF</MenuItem>
                <MenuItem onClick={exportAsTXT}>Export as .TXT</MenuItem>
                <MenuItem onClick={() => setTimeout(() => window.print(), 100)}>
                  Print Currently Visible Logs
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              onClick={onOpen}
              colorScheme="red"
              alignSelf="flex-end"
              justifySelf="flex-end"
            >
              Flush Logs
            </Button>
            <Button
              onClick={() =>
                document.querySelector(".log-container").scrollTo(0, 0)
              }
            >
              Scroll to Top
            </Button>
            <Button onClick={() => window.location.reload()}>Refresh</Button>

            <Input
              placeholder="Search Logs"
              width="250px"
              variant="filled"
              onChange={search}
            />
          </Flex>
          <div className="log-wrapper">
            <div className="log-container">{logs}</div>
          </div>
        </Box>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Flush Server Logs?
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={deleteLogs} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  } else {
    <Loader />;
  }
};

export default Logs;
