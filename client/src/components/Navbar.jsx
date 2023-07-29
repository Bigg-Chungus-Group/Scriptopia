import React from "react";
import "./Navbar.css";

const Navbar = () => {
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
      </div>

      <input type="text" placeholder="Search Here" />

      <div className="profile"></div>
    </div>
  );
};

export default Navbar;
