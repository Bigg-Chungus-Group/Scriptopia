import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Logo from "../../../assets/img/logo-icon.png"
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
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
} from "@chakra-ui/react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const token = Cookies.get("token");
  if (!token) window.location.href = "/auth";
  const decoded = jwt_decode(token);

  const { picture } = decoded;

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

  const logout = () => {
    Cookies.remove("token", { path: '/', domain: import.meta.env.VITE_COOKIE_DOMAIN });
    window.location.href = "/auth";
  };

  return (
    <div className="nav">
      <div className="left-link">
        <div className="image">
          <img src={Logo} onClick={() => {window.location.href = "/"}}/>
        </div>
        <div className="links">
          <a href="/courses">Courses</a>
          <a href="/practice">Practice</a>
        </div>
        <i
          className="fa-solid fa-magnifying-glass"
          id="searchIcon"
          onClick={showSearch}
        ></i>
      </div>

      <input type="text" placeholder="Search Here" onBlur={checkWidth} />

      <Menu>
        <Box className="rightmost">
          <i
            className="fa-sharp fa-solid fa-bell"
            style={{ color: "gray" }}
            ref={btnRef}
            onClick={onOpen}
          ></i>{" "}
          <MenuButton>
            <div
              className="profile"
              style={{
                background: `url(${picture}) no-repeat center center/cover`,
              }}
            ></div>
          </MenuButton>
        </Box>
        <MenuList bg="#323238" border="1px solid #068fff55">
          <Link to="/settings">
            {" "}
            <MenuItem bg="#323238">Settings</MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem bg="#323238">Profile</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem bg="#323238">Change Theme</MenuItem>
          <MenuItem bg="#323238" onClick={logout}>
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Notifications</DrawerHeader>

          <DrawerBody className="drawerbody">
            <Alert status="info" marginBottom="5px">
              <AlertIcon />
              You have a new assignment in Python
            </Alert>{" "}
            <Alert status="info" marginBottom="5px">
              <AlertIcon />
              IP Lab Assignment is Due Today
            </Alert>{" "}
            <Alert status="success" marginBottom="5px">
              <AlertIcon />
              Join the Hackathon scheduled on 30th August!
            </Alert>
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
