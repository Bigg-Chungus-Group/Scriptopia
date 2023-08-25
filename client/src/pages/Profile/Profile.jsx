import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Box, Heading, Text } from "@chakra-ui/react";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";

const Profile = () => {
  !Cookies.get("token") ? (window.location.href = "/auth") : null;
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [level, setLevel] = React.useState({});
  const [data, setData] = React.useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        data.lastOnline = new Date(data.lastOnline).toLocaleString();
        setLevel(calculateLevelInfo(data.XP));
        console.log(progress);
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        window.location.href = "/auth";
      });
  }, []);

  function calculateLevelInfo(xp) {
    // Define the XP breakpoints for levels
    const breakpoints = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800,
      9100, 10500, 12000, 13600, 15300, 17100, 19000,
    ];

    // Check if XP is negative or zero (invalid case)
    if (xp <= 0) {
      return {
        level1: 1,
        currentXP: 0,
        levelMaxXP: breakpoints[0],
      };
    }

    // Find the corresponding level based on the XP
    let level1;
    for (level1 = 1; level1 < breakpoints.length; level1++) {
      if (xp < breakpoints[level1]) {
        break;
      }
    }

    const currentXP = xp - breakpoints[level1 - 1];
    const levelMaxXP = breakpoints[level1] - breakpoints[level1 - 1];

    const percentage = (currentXP / levelMaxXP) * 100;
    setProgress(Math.min(percentage, 100));

    return {
      level1: level1,
      currentXP: currentXP,
      levelMaxXP: levelMaxXP,
    };
  }

  const lang = {
    py: "Python",
    js: "JavaScript",
    java: "Java",
    c: "C",
    cpp: "C++",
  };

  return (
    <>
      <Navbar />
      <Box className="Profile">
        <Box className="main-profile">
          <Box className="image-wrapper">
            <Box
              className="img"
              style={{
                background: `url(${data.profilePicture}) no-repeat center center/cover`,
              }}
            ></Box>
          </Box>
          <Box className="info">
            <h4>{data.fname + " " + data.lname}</h4>
            <p>{data.mid}</p>
          </Box>

          <Box className="stats">
            <Box className="stat-group">
              <Heading>17</Heading>
              <Text>XP Points</Text>
            </Box>
            <Box className="stat-group">
              <Heading>17</Heading>
              <Text>Monthly Rank</Text>
            </Box>
            <Box className="stat-group">
              <Heading>17</Heading>
              <Text>Weekly Rank</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
