import React, { useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo-icon.png";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  DrawerContent,
  DrawerHeader,
  Avatar,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Input,
  Button,
  Alert,
  AlertIcon,
  Textarea,
  FormLabel,
  Text,
} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <div className="navAdmin">
      <div className="left-link">
        <div className="image">
          <img
            src={Logo}
            onClick={() => {
              window.location.href = "/auth";
            }}
          />
        </div>

        <i className="fa-solid fa-magnifying-glass" id="searchIcon"></i>
      </div>
      <Box className="rightmost">
        <Button onClick={() => window.location.href = "/auth"}>Sign In</Button>
      </Box>
    </div>
  );
};

export default Navbar;
