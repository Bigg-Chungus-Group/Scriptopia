import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Select,
  BreadcrumbSeparator,
  Divider,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/admin/Navbar";
import "./Home.css";
import Chart from "chart.js/auto";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Home = () => {
  const decoded = useAuthCheck("A")

  useEffect(() => {
    const housePoints = document.getElementById("housePoints");

    new Chart(housePoints, {
      type: "bar",
      data: {
        labels: ["Red", "Green", "Blue", "Yellow"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5],
            borderWidth: 1,
            barPercentage: 5,
            categoryPercentage: 0.1,
            backgroundColor: ["#FFC3C3", "#C3FFC5", "#C3DBFF", "#FFF9C3"],
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            beginAtZero: true,
            grid: {
              display: false, // Hide y-axis gridlines
            },
          },
          y: {
            display: false, // Hide y-axis gridlines
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }, []);

  useEffect(() => {
    const certificationStatus = document.getElementById("certificationStatus");

    new Chart(certificationStatus, {
      type: "bar",
      data: {
        labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "#AAC9FF",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            display: false, // Hide x-axis gridlines
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              display: false, // Hide y-axis gridlines
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }, []);

  return (
    <>
      <Navbar />
      <Box className="adminHome">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Admin</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>Dashboard</Heading>
        <Text>View All House Status</Text>

        <Box className="main">
          <Box className="top">
            <Box className="housePoints">
              <Box className="heading">
                <Heading size="md">House Points</Heading>
                <Text>Points as Of August 2023</Text>
              </Box>
              <div id="housePointsWrapper">
                <canvas id="housePoints"></canvas>
              </div>
            </Box>

            <Box className="certificationStatus">
              <Box className="heading">
                <Box className="text">
                  {" "}
                  <Heading size="md">Certification</Heading>
                  <Text>Status of College Allocated Courses</Text>
                </Box>
                <div className="select">
                  <Select placeholder="Select Course">
                    <option value="option1">Course 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </div>
              </Box>
              <Divider />
              <div id="certificationStatusWrapper">
                <canvas id="certificationStatus"></canvas>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
