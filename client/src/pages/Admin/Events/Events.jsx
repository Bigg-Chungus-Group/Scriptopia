import React, { useState, useEffect } from "react";
import Navbar from "../../../components/admin/Navbar";
import {
  Badge,
  Box,
  Flex,
  Heading,
  useToast,
  Text,
  Button,
  ButtonGroup,
  Stack,
  Divider,
  Card,
  CardBody,
  CardFooter,
  Image,
  Skeleton,
  Center,
} from "@chakra-ui/react";
import "./Events.css";
import { useAuthCheck } from "../../../hooks/useAuthCheck";
import { Link } from "react-router-dom";

const Events = () => {
  useAuthCheck("A");
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

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return (
    <>
      <Navbar />
      <Box className="AdminEvents">
        <Heading>Events </Heading>
        <Box className="events">
          <Card
            w="320px"
            maxW="sm"
            maxH="md"
            overflow="hidden"
            cursor="pointer"
          >
            <Flex
              justify="center"
              align="center"
              height="100%"
              direction="column"
            >
              <Text fontSize="100px" color="lightgray">
                +
              </Text>{" "}
              <Text color="lightgray">Add Event</Text>
            </Flex>
          </Card>
          {events.map((event) => (
            <Card
              w="320px"
              maxW="sm"
              maxH="md"
              overflow="hidden"
              key={event._id}
            >
              <CardBody>
                <Image
                  fallback={<Skeleton height="150px" />}
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                />

                <Stack mt="6" spacing="3">
                  <Divider />
                  <Heading size="md">{event.name}</Heading>
                  <Text>
                    {new Date(event.eventStarts).toLocaleDateString(
                      "en-US",
                      dateOptions
                    )}
                  </Text>
                  <Text>Seminar Hall</Text>
                  <Text color="blue.600">
                    {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                    <Badge
                      colorScheme={event.expiresAt > date ? "green" : "red"}
                      ml="15px"
                      fontSize="13px"
                    >
                      {event.expiresAt > date ? "Active" : "Expired"}
                    </Badge>
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <ButtonGroup spacing="2">
                  <Link to={`/events/${event._id}`}>
                    <Button variant="solid" colorScheme="blue">
                      View Event
                    </Button>
                  </Link>
                  <Link to={`admin/events/${event._id}/edit`}>
                  <Button variant="ghost" colorScheme="blue">
                    Edit
                  </Button>
                  </Link>
                </ButtonGroup>

                <Flex
                  justifySelf="flex-end"
                  align="center"
                  justifyContent="flex-end"
                >
                  <i
                    className="fa-regular fa-users"
                    style={{ marginRight: "10px" }}
                  ></i>
                  <Text justifySelf="flex-end">{event.registered.length}</Text>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Events;
