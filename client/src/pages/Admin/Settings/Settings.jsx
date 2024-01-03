import React, { useEffect } from "react";
import "./Settings.css";
import {
  Box,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  Switch,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  useColorMode,
  Button,
  InputRightElement,
  TabPanel,
  Text,
  Input,
  Alert,
} from "@chakra-ui/react";
import Navbar from "../../../components/admin/Navbar";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  useAuthCheck("A");
  const [toastDispatched, setToastDispatched] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();

  const Navigate = useNavigate();

  const [show1, setShow1] = React.useState(false);
  const handleClick1 = () => setShow1(!show1);

  const [show2, setShow2] = React.useState(false);
  const handleClick2 = () => setShow2(!show2);

  const [show3, setShow3] = React.useState(false);
  const handleClick3 = () => setShow3(!show3);

  const [oldPass, setOldPass] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [err, setErr] = React.useState("");

  const [mainMo, setMainMo] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [backupIsLoading, setBackupIsLoading] = React.useState(false);

  const validatePassMatch = (pass) => {
    setConfirmPass(pass);
    if (pass === newPass) {
      setErr("");
      setToastDispatched(true);
    } else {
      setErr("Passwords do not match");
      setToastDispatched(false);
    }
  };

  const sendNewPass = () => {
    if (oldPass === "" || newPass === "" || confirmPass === "") {
      setErr("Please fill all the fields");
      setToastDispatched(false);
    } else if (newPass !== confirmPass) {
      setErr("Passwords do not match");
      setToastDispatched(false);
    } else if (newPass === oldPass) {
      setErr("New Password cannot be same as Old Password");
      setToastDispatched(false);
    } else {
      setErr("");
      setIsButtonLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/profile/updatePW`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPass, newPass }),
      })
        .then(async (res) => {
          setIsButtonLoading(false);
          if (res.status === 401) {
            toast({
              title: "Password Change Failed! Old Password is Incorrect",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          } else {
            return await res.json();
          }
        })
        .then((data) => {
          if (data.success === true) {
            toast({
              title: "Password Changed Successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
            setToastDispatched(false);
          } else {
            toast({
              title: "Password Change Failed!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        });
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    setLoading(false);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/`, {
      method: "GET",
    }).then((res) => {
      if (res.status === 503) {
        setMainMo(true);
      }
    });
  }, []);

  useEffect(() => {
    if (toastDispatched) {
      toast({
        position: "bottom-left",
        title: "Heads up! You Have Unsaved Changes. Save to Apply!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setToastDispatched(true);
    }
  }, [toastDispatched]);

  const toggleMaintainaceMode = (mode) => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/profile/maintainanceMode`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      }
    ).then((res) => {
      if (res.status === 200) {
        setMainMo(!mainMo);
        toast({
          title: "Maintainance Mode Toggled!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Maintainance Mode Toggle Failed!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };
  const generateBackup = () => {
    setBackupIsLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/backups`, {
      method: "POST", // Keep it as POST if that's how your server handles backups
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          const blob = await res.blob(); // Get the response as a blob

          // Create a download link for the ZIP file
          const element = document.createElement("a");
          element.href = URL.createObjectURL(blob);
          const date = new Date();
          const dateString = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          const timeString = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
          element.download = `Scriptopia_backup-${dateString}-${timeString}.zip`;

          document.body.appendChild(element); // Required for this to work in Firefox
          element.click();
          setBackupIsLoading(false);

          toast({
            title: "Backup Generated Successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Backup Generation Failed!",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        setBackupIsLoading(false);
        console.error("Error generating backup:", error);
        toast({
          title: "Backup Generation Failed!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        // Handle the error and show a message to the user, if needed
      });
  };

  const setDark = () => {
    toggleColorMode();

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/profile/updateTheme`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        theme: colorMode === "dark" ? "light" : "dark",
      }),
    }).then((res) => {});
    window.location.reload();
  };

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="AdminSettings">
          <Box className="wrapper">
            <Heading alignSelf="flex-start">Settings</Heading>
            <Tabs
              variant="enclosed"
              alignSelf="flex-start"
              display="flex"
              justifyContent="space-between"
              flexDirection="column"
              width="100%"
            >
              <TabList mb="1em">
                <Tab>Admin Settings</Tab>
                <Tab>Server Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel display="flex" flexDirection="column" gap="30px">
                  <FormControl
                    display="flex"
                    alignItems="center"
                    className="formcontrol"
                    justifyContent="space-between"
                  >
                    <FormLabel htmlFor="dark-mode">Dark Mode</FormLabel>
                    <Switch
                      id="dark-mode"
                      onChange={(e) => {
                        setDark();
                      }}
                      isChecked={colorMode === "dark" ? true : false}
                    />
                  </FormControl>
                  <Divider />
                  <FormControl display="flex" flexDirection="column" gap="20px">
                    <Text>Change Password</Text>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={show1 ? "text" : "password"}
                        placeholder="Enter Old Password"
                        onChange={(e) => setOldPass(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick1}>
                          {show1 ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={show2 ? "text" : "password"}
                        placeholder="Enter New Password"
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick2}>
                          {show2 ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        type={show3 ? "text" : "password"}
                        placeholder="Confirm New Password"
                        onChange={(e) => validatePassMatch(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick3}>
                          {show3 ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Text color="red">{err}</Text>
                  </FormControl>
                  <Button
                    isLoading={isButtonLoading}
                    alignSelf="flex-end"
                    colorScheme="green"
                    isDisabled={!toastDispatched}
                    onClick={() => {
                      sendNewPass();
                    }}
                  >
                    Save
                  </Button>
                </TabPanel>
                <TabPanel display="flex" flexDirection="column" gap="30px">
                  <Button
                    variant="solid"
                    colorScheme="green"
                    onClick={() => {
                      Navigate("/admin/logs");
                    }}
                  >
                    Check Server Logs
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={generateBackup}
                    isLoading={backupIsLoading}
                  >
                    Generate Backup
                  </Button>
                  <Divider />
                  <FormControl
                    display="flex"
                    alignItems="center"
                    className="formcontrol"
                  >
                    <FormLabel htmlFor="maintainance-mode" mb="0">
                      Maintainance Mode KillSwitch
                    </FormLabel>
                    <Switch
                      id="maintainance-mode"
                      onChange={(e) => {
                        toggleMaintainaceMode(e.target.checked);
                      }}
                      isChecked={mainMo ? true : false}
                    />
                  </FormControl>
                  <Alert status="error">
                    <Text>
                      This will toggle the maintainance mode. This is a
                      dangerous operation and should only be used when the
                      maintainance is required.
                    </Text>
                  </Alert>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Settings;
