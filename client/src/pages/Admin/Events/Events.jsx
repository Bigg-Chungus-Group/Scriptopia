import React, { useState, useEffect } from "react";
import Navbar from "../../../components/admin/Navbar";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Tag,
  TagLabel,
  Link,
  useToast,
  Text,
} from "@chakra-ui/react";
import "./Events.css";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Events = () => {
  useAuthCheck("A")
  const toast = useToast();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/events`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Error fetching events",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, []);

  const date = new Date().toISOString();

  return (
    <>
      <Navbar />
      <Box className="AdminEvents">
        <Heading>Events </Heading>
        {events.map((event) => (
          <Box className="event" key={event._id}>
            <Flex gap="30px">
              <Box className="left" width="75%">
                <Heading fontSize="25px">
                  {event.name}{" "}
                  <Badge
                    colorScheme={event.expiresAt > date ? "green" : "red"}
                    ml="5px"
                    fontSize="13px"
                  >
                    {event.expiresAt > date ? "Active" : "Expired"}
                  </Badge>
                </Heading>
                <Text fontSize="14px" overflow="auto" mt="15px" width="90%">
                  {event.desc}
                </Text>
              </Box>

              <Box
                className="right"
                display="flex"
                flexDirection="column"
                gap="10px"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Flex gap="20px">
                  <Tag width="fit-content">
                    <TagLabel width="fit-content">
                      Started{" "}
                      {new Date(event.createdAt).toLocaleDateString("en-GB")}
                    </TagLabel>
                  </Tag>

                  <Tag>
                    <TagLabel>
                      Ends{" "}
                      {new Date(event.expiresAt).toLocaleDateString("en-GB")}
                    </TagLabel>
                  </Tag>
                </Flex>
                <Flex gap="20px">
                  {" "}
                  <Text justifySelf="flex-end">
                    {" "}
                    <i
                      className="fa-regular fa-users"
                      style={{ marginRight: "10px" }}
                    ></i>{" "}
                    {event.registered.length} Registered
                  </Text>
                  <Link justifySelf="flex-end" href={`events/${event._id}`}>
                    Edit Event
                  </Link>
                </Flex>
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Events;
