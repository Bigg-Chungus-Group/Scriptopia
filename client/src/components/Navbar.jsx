import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";

const Navbar = () => {
  const token = Cookies.get("token");
  if(!token) window.location.href = "/auth";
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

  return (
    <div className="nav">
      <div className="left-link">
        <i
          className="fa-duotone fa-code"
          onClick={() => {
            window.location.href = "/";
          }}
        ></i>
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
        <MenuButton>
          <div
            className="profile"
            style={{
              background: `url(${picture}) no-repeat center center/cover`,
            }}
          ></div>
        </MenuButton>
        <MenuList bg="#323238" border="1px solid #068fff55">
          <MenuItem bg="#323238">Settings</MenuItem>
          <MenuItem bg="#323238">Profile</MenuItem>
          <MenuDivider />
          <MenuItem bg="#323238">Change Theme</MenuItem>
          <MenuItem bg="#323238">Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default Navbar;
