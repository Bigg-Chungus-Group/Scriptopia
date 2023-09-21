import React, { useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo-icon.png";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import io from "socket.io-client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDialogBody,
  Avatar,
} from "@chakra-ui/react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const token = Cookies.get("token");
  const [notifications, setNotifications] = React.useState([]);
  const [picture, setPicture] = React.useState(null);
  const socket = io(import.meta.env.VITE_BACKEND_ADDRESS);

  useEffect(() => {
    let dec;
    try {
      dec = jwt_decode(token);
      const p = dec.picture;
      setPicture(p);
    } catch (error) {
      console.log(error);
    }
  }, []);

  /*
  useEffect(() => {
    socket.on("onNewNotification", (notification) => {
      console.log("NOTI");
      setNotifications((prev) => [...prev, notification]);
    });

    socket.on("onDeleteNotification", (notification) => {
      setNotifications((prev) =>
        prev.filter((noti) => noti._id !== notification._id)
      );
    });

    socket.on("onUpdateNotifications", (newNotification) => {
      setNotifications((prev) =>
        prev.map((noti) => {
          if (noti._id === newNotification._id) {
            return newNotification;
          } else {
            return noti;
          }
        })
      );
    })  
  }, [])*/

  useEffect(() => {
    socket.on("onNotification", async () => {
      console.log("Notification Change Detected");
      try {
        await fetch(
          `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/receive`,
          {
            method: "GET",
          }
        ).then(async (res) => {
          if (res.status === 200) {
            await res.json().then((data) => {
              setNotifications(data.notifications);
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  const showSearch = () => {
    document.querySelector("input").style.display = "block";
    document.querySelector("input").style.position = "absolute";
    document.querySelector("input").focus();
  };

  const checkWidth = () => {
    if (window.innerWidth < 768) {
      document.querySelector("input").style.display = "none";
    }
  };

  useEffect(async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_ADDRESS}/admin/notifications/receive`,
        {
          method: "GET",
        }
      ).then(async (res) => {
        if (res.status === 200) {
          await res.json().then((data) => {
            setNotifications(data.notifications);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("chakra-ui-color-mode");
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN2,
    });
    window.location.href = "/auth";
  };

  return (
    <div className="nav">
      <div className="left-link">
        <div className="image">
          <img
            src={Logo}
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="links">
          <a href="/certificates">Certificates</a>
          <a href="/houses">Houses</a>
        </div>
        <i
          className="fa-solid fa-magnifying-glass"
          id="searchIcon"
          onClick={showSearch}
        ></i>
      </div>

      <Input
        type="text"
        placeholder="Search Here"
        onBlur={checkWidth}
        variant="filled"
      />

      <Menu>
        <Box className="rightmost">
          <i
            className="fa-sharp fa-solid fa-bell"
            style={{ color: "gray" }}
            ref={btnRef}
            onClick={onOpen}
          ></i>{" "}
          {picture ? (
            <MenuButton>
              <Avatar src={picture} size="sm" />{" "}
            </MenuButton>
          ) : (
            <Link to="/auth"> Sign In </Link>
          )}
        </Box>
        <MenuList className="menu">
          <Link to="/settings">
            {" "}
            <MenuItem className="menuitem">Settings</MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem className="menuitem">Profile</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem className="menuitem">Change Theme</MenuItem>
          <MenuItem className="menuitem" onClick={logout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent className="drawer-studentNav">
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody className="drawerbody">
            {notifications.length === 0 ? (
              <Alert>
                <AlertIcon />
                No Notifications
              </Alert>
            ) : (
              notifications.map((notification) => (
                <Alert status="info" key={notification._id} marginBottom="5px">
                  <AlertIcon />

                  <AlertDialogBody width="100%">
                    {notification.body}
                  </AlertDialogBody>
                </Alert>
              ))
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Clear All
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Navbar;
