import React from 'react'
import Navbar from '../../../components/student/Navbar'

const Houses = () => {
  return (
    <>
    <Navbar/>
    <div>Page Currently Broken :/</div>
    </>
  )
}

export default Houses

/*import React, { useEffect, useState } from "react";
import "./Houses.css";
import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useToast,
  Button,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Houses = () => {
  useAuthCheck("S");
  const [houses, setHouse] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/houses`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      async (res) =>
        await res
          .json()
          .then((data) => {
            setHouse(data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: "Error",
              description: "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          })
    );
  }, []);

  useEffect(() => {
    if (!loading) {
      const houseActivity0 = document
        .getElementById("houseActivity0")
        .getContext("2d");
      const down0 = (ctx, value) =>
        ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

      const houseActivity1 = document
        .getElementById("houseActivity1")
        .getContext("2d");
      const down1 = (ctx, value) =>
        ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

      const houseActivity2 = document
        .getElementById("houseActivity2")
        .getContext("2d");
      const down2 = (ctx, value) =>
        ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

      const houseActivity3 = document
        .getElementById("houseActivity3")
        .getContext("2d");
      const down3 = (ctx, value) =>
        ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

      const houseActivityChart0 = new Chart(houseActivity0, {
        type: "line",
        data: {
          labels: [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
          datasets: [
            {
              label: "Hufflepuff",
              data: [
                3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 17, 12,
                30,
              ],
              backgroundColor: "#ffffff",
              borderColor: "green",
              borderWidth: 1,
              segment: {
                borderColor: (ctx) => down0(ctx, "red"),
              },
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false, // This prevents canvas from resizing itself
          // This also prevents aspect ratio adjustment
          scales: {
            x: {
              display: false, // This removes the x-axis labels
            },
            y: {
              display: false, // This removes the y-axis labels and name
            },
          },
          plugins: {
            legend: {
              display: false, // This removes the legend
            },
          },
        },
      });

      const houseActivityChart1 = new Chart(houseActivity1, {
        type: "line",
        data: {
          labels: [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
          datasets: [
            {
              label: "Hufflepuff",
              data: [
                3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 17, 12,
                30,
              ],
              backgroundColor: "#ffffff",
              borderColor: "green",
              borderWidth: 1,
              segment: {
                borderColor: (ctx) => down1(ctx, "red"),
              },
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false, // This prevents canvas from resizing itself
          // This also prevents aspect ratio adjustment
          scales: {
            x: {
              display: false, // This removes the x-axis labels
            },
            y: {
              display: false, // This removes the y-axis labels and name
            },
          },
          plugins: {
            legend: {
              display: false, // This removes the legend
            },
          },
        },
      });

      const houseActivityChart2 = new Chart(houseActivity2, {
        type: "line",
        data: {
          labels: [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
          datasets: [
            {
              label: "Hufflepuff",
              data: [
                3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 17, 12,
                30,
              ],
              backgroundColor: "#ffffff",
              borderColor: "green",
              borderWidth: 1,
              segment: {
                borderColor: (ctx) => down2(ctx, "red"),
              },
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false, // This prevents canvas from resizing itself
          // This also prevents aspect ratio adjustment
          scales: {
            x: {
              display: false, // This removes the x-axis labels
            },
            y: {
              display: false, // This removes the y-axis labels and name
            },
          },
          plugins: {
            legend: {
              display: false, // This removes the legend
            },
          },
        },
      });

      const houseActivityChart3 = new Chart(houseActivity3, {
        type: "line",
        data: {
          labels: [
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
            "Week 1",
            "Week 2",
            "Week 3",
            "Week 4",
          ],
          datasets: [
            {
              label: "Hufflepuff",
              data: [
                3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 3, 10, 7, 15, 17, 12,
                30,
              ],
              backgroundColor: "#ffffff",
              borderColor: "green",
              borderWidth: 1,
              segment: {
                borderColor: (ctx) => down3(ctx, "red"),
              },
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false, // This prevents canvas from resizing itself
          // This also prevents aspect ratio adjustment
          scales: {
            x: {
              display: false, // This removes the x-axis labels
            },
            y: {
              display: false, // This removes the y-axis labels and name
            },
          },
          plugins: {
            legend: {
              display: false, // This removes the legend
            },
          },
        },
      });

      return () => {
        houseActivityChart0.destroy();
        houseActivityChart1.destroy();
        houseActivityChart2.destroy();
        houseActivityChart3.destroy();
      };
    }
  }, [loading]);

  return (
    <>
      <Navbar />
      <Box className="StudentHouses">
        {houses.map((house, index) => (
          <Box className="house" key={house._id}>
            <Box
              className="text"
              display="flex"
              alignItems="center"
              gap="20px"
              justifyContent="flex-start"
              width="100%"
            >
              <Heading>{house.name} House</Heading>
              <Text>{house.points} XP</Text>
            </Box>
            <Box className="details">
              <canvas id={`houseActivity${index}`} className="canvas"></canvas>
              <Box className="det">
                <StatGroup>
                  <Stat>
                    <StatLabel>XP</StatLabel>
                    <StatNumber fontSize="40px">{house.points}</StatNumber>
                    <StatHelpText fontSize="15px">
                      <StatArrow type="increase" />
                      23.36%
                    </StatHelpText>
                  </Stat>
                </StatGroup>
                <Link to={`/houses/${house._id}`}>
                  <Button>View House</Button>
                </Link>
                <Text></Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Houses;
*/