import React, { useEffect, useState } from "react";
import "./House.css";
import {
  Box,
  Flex,
  Heading,
  useToast,
  Text,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  useDisclosure,
  Link,
  Input,
  Textarea,
  InputLeftAddon,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormControl,
  InputLeftElement,
  position,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";
import AdminNavbar from "../../../components/admin/Navbar";
import FacultyNavbar from "../../../components/faculty/Navbar";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { ChromePicker as SketchPicker } from "react-color";
import Loader from "../../../components/Loader";
import GuestNavbar from "../../../components/guest/Navbar";
import Chart from "chart.js/auto";
import AvatarEditor from "react-avatar-editor";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const House = () => {
  const [houses, setHouses] = useState(null);
  const [members, setMembers] = useState(null);
  const [facCord, setFacCord] = useState(null);
  const [studentCord, setStudentCord] = useState(null);
  const houseID = window.location.pathname.split("/")[2];
  const [totalpoints, setTotalPoints] = useState(0);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const [internalPoints, setInternalPoints] = useState(0);
  const [externalPoints, setExternalPoints] = useState(0);
  const [eventPoints, setEventPoints] = useState(0);

  const logoRef = React.useRef(null);
  const bannerRef = React.useRef(null);

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [logoZoom, setLogoZoom] = useState(1);
  const [bannerZoom, setBannerZoom] = useState(1);

  const {
    isOpen: isLogoOpen,
    onOpen: onLogoOpen,
    onClose: onLogoClose,
  } = useDisclosure();

  const {
    isOpen: isBannerOpen,
    onOpen: onBannerOpen,
    onClose: onBannerClose,
  } = useDisclosure();

  const [houseName, setHouseName] = useState(null);
  const [houseColor, setHouseColor] = useState(null);
  const [houseAbstract, setHouseAbstract] = useState(null);
  const [houseDesc, setHouseDesc] = useState(null);
  const [facCordID, setFacCordID] = useState(null);
  const [studentCordID, setStudentCordID] = useState(null);
  const [update, setUpdate] = useState(false);
  const [editPrivilege, setEditPrivilege] = useState(false);
  const [hid, setHid] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [decoded, setDecoded] = useState(null);

  const [pickedColor, setPickedColor] = useState("#fff");

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  useEffect(() => {
    if (role === "A" || decoded?.perms?.includes(`HCO${hid}`)) {
      setEditPrivilege(true);
    } else {
      setEditPrivilege(false);
    }
  }, [role, hid, decoded]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const jwt = jwtDecode(token);
      setDecoded(jwt);
      setRole(jwt.role);
    }

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          return await res.json();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .then((data) => {
        setHouses(data.house);
        setMembers(data.members);
        setFacCord(data.facCordInfo);
        setStudentCord(data.studentCordInfo);
        setHid(data.house.no);

        setHouseName(data?.house.name);
        setHouseColor(data?.house.color);
        setHouseAbstract(data?.house.abstract);
        setHouseDesc(data?.house.desc);
        setFacCordID(data?.facCordInfo?.mid);
        setStudentCordID(data?.studentCordInfo?.mid);
        setBanner(data.house.banner);

        setLogo(data.house.logo);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: data.msg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [update]);

  useEffect(() => {
    if (houses) {
      const currentYear = new Date().getFullYear();

      for (const month in houses.points[currentYear]) {
        const points =
          (houses.points[currentYear][month].internal ?? 0) +
          (houses.points[currentYear][month].external ?? 0) +
          (houses.points[currentYear][month].events ?? 0);

        setTotalPoints((prev) => prev + points);
        setInternalPoints(
          (prev) => prev + houses.points[currentYear][month].internal
        );
        setExternalPoints(
          (prev) => prev + houses.points[currentYear][month].external
        );
        setEventPoints(
          (prev) => prev + houses.points[currentYear][month].events
        );
      }
    }
  }, [houses]);

  const [updateMembers, setUpdateMembers] = useState(false);

  useEffect(() => {
    if (members) {
      let newArr = [];
      members.forEach((member) => {
        let totalPoints = 0;
        for (const year in member.contr) {
          for (const month in member.contr[year]) {
            const points =
              (member.contr[year][month]?.internal ?? 0) +
              (member.contr[year][month]?.external ?? 0) +
              (member.contr[year][month]?.events ?? 0);
            const p = parseInt(points);
            totalPoints += p;
          }
        }
        // member.totalPoints = parseInt(totalPoints);
        member.totalPoints = parseInt(totalPoints);
      });

      members.sort((a, b) => b.totalPoints - a.totalPoints);
    }
  });

  const updateHouse = () => {
    if (!houseName || !houseColor || !houseAbstract) {
      toast({
        title: "Error",
        description: "Please fill all the required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onSettingsClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: houseName,
        color: houseColor,
        abstract: houseAbstract,
        desc: houseDesc,
        fc: facCordID,
        sc: studentCordID,
        hid: hid,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "House updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUpdate((prev) => !prev);
        return;
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.msg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };
  [];

  const cancelRef = React.useRef();

  const [selectedMember, setSelectedMember] = useState(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const openDelete = (id) => {
    setSelectedMember(id);
    onDeleteOpen();
  };

  const delMem = () => {
    onDeleteClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        mid: selectedMember,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Member removed successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUpdate((prev) => !prev);
        return await res.json();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  useEffect(() => {
    let myPieChart;

    if (houses) {
      if (internalPoints !== undefined && externalPoints !== undefined && eventPoints !== undefined) {
        var ctx = document.getElementById("myChart").getContext("2d");
        var data = {
          labels: ["Internal Points", "External Points", "Event Points"],
          datasets: [
            {
              data: [internalPoints, externalPoints, eventPoints],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        myPieChart = new Chart(ctx, {
          type: "doughnut",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }

    return () => {
      myPieChart?.destroy();
    };
  }, [houses, internalPoints, externalPoints, eventPoints]);

  const openLogo = (e) => {
    setLogo(e?.target?.files[0]);
    onLogoOpen();
  };

  const openBanner = (e) => {
    setBanner(e?.target?.files[0]);
    onBannerOpen();
  };

  const selectLogo = () => {
    document.getElementById("logofile").click();
  };

  const selectBanner = () => {
    document.getElementById("bannerfile").click();
  };

  const [logoLoading, setLogoLoading] = useState(false);

  const saveLogo = () => {
    setLogoLoading(true);
    const canvas = logoRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/png");
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}/logo`, {
      method: "POST",
      credentials: "include",
      body: canvas,
    })
      .then(async (res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: "Logo updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUpdate((prev) => !prev);
          return await res.json();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setLogoLoading(false);
        onLogoClose();
        window.location.reload();
      });
  };

  const [bannerLoading, setBannerLoading] = useState(false);

  const saveBanner = () => {
    setBannerLoading(true);
    const canvas = bannerRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/png");
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}/banner`, {
      method: "POST",
      credentials: "include",
      body: canvas,
    })
      .then(async (res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: "Banner updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setUpdate((prev) => !prev);
          return await res.json();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setBannerLoading(false);
        onBannerClose();
        window.location.reload();
      });
  };

  if (houses) {
    return (
      <>
        {role === "S" ? (
          <Navbar />
        ) : role == "F" ? (
          <FacultyNavbar />
        ) : role == "A" ? (
          <AdminNavbar />
        ) : (
          <GuestNavbar />
        )}
        <Box className="StudentHouse">
          <Flex gap="20px">
            <Box width="60%">
              <Box className="top">
                <Box
                  className="cover"
                  bg={`url(${houses.banner})`}
                  position={"relative"}
                >
                  <Box className="cover-wrapper">
                    <Box className="cover-inside" bg={houses.color}></Box>
                    {editPrivilege ? (
                      <Flex
                        height="100%"
                        width="100%"
                        position="absolute"
                        bg="black"
                        transform="translate(-50%, -50%)"
                        borderRadius="20px"
                        top="50%"
                        left="50%"
                        className="cover-overlay"
                        justify="center"
                        align="center"
                        onClick={selectBanner}
                      >
                        <i
                          className="fa-solid fa-pen"
                          style={{
                            color: "white",
                            marginTop: "-80px",
                            marginLeft: "30px",
                          }}
                        ></i>
                        <Input
                          type="file"
                          id="bannerfile"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={openBanner}
                        />
                      </Flex>
                    ) : null}
                  </Box>
                  <Flex className="details" gap="10px" alignItems="center">
                    <Box className="logo" position="relative">
                      <Avatar
                        height="150px"
                        width="150px"
                        src={houses.logo}
                        className="logo-img"
                      ></Avatar>

                      {editPrivilege ? (
                        <>
                          <Flex
                            height="150px"
                            width="100%"
                            position="absolute"
                            bg="black"
                            transform="translate(-50%, -50%)"
                            borderRadius="50%"
                            top="50%"
                            left="50%"
                            className="logo-overlay"
                            justify="center"
                            align="center"
                            onClick={selectLogo}
                          >
                            <i
                              className="fa-solid fa-pen"
                              style={{ color: "white" }}
                            ></i>
                          </Flex>
                          <Input
                            type="file"
                            id="logofile"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={openLogo}
                          />
                        </>
                      ) : null}
                    </Box>
                    <Box
                      gap="50px"
                      alignItems="center"
                      className="details-inside"
                    >
                      <Flex
                        direction="column"
                        className="name"
                        alignItems="center"
                      >
                        <Heading
                          fontSize="30px"
                          fontWeight="600"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {houses?.name} House
                          {editPrivilege ? (
                            <i
                              className="fa-solid fa-pen"
                              onClick={onSettingsOpen}
                              style={{
                                cursor: "pointer",
                                fontSize: "15px",
                                marginLeft: "10px",
                              }}
                            ></i>
                          ) : null}
                        </Heading>
                        <Flex align="center" gap="10px" direction="column">
                          <Flex gap="10px">
                            {facCord.map((fac) => (
                              <Text
                                key={fac?.mid}
                                fontSize="15px"
                                _hover={{
                                  textDecor: "underline",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/profile/faculty/${fac?.mid}`)
                                }
                              >
                                @{fac?.fname} {fac?.lname}
                              </Text>
                            ))}
                          </Flex>

                          <Flex gap="10px">
                            <a href="">
                              <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="">
                              <i className="fa-brands fa-twitter"></i>
                            </a>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Box height="180px" mt="20px">
                        <Heading fontSize="20px">{houses?.abstract}</Heading>
                        <Text overflowY="auto" mt="5px" pr="20px" width="50vw">
                          {houses?.desc}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Box>

            <Box>
              <Flex
                align="center"
                justify="center"
                direction="column"
                className="mychart"
              >
                <Box height="80%">
                  <canvas id="myChart"></canvas>
                </Box>
                <Text mt="20px">Total Points: {totalpoints}</Text>
              </Flex>

              <Box
                className="table"
                mt="20px"
                borderRadius="20px"
                padding="20px"
                height="40.5vh"
              >
                <Tabs isFitted>
                  <TabList>
                    <Tab>House Ranking</Tab>
                    {/*}                    <Tab>Recent Contribution</Tab>{*/}
                  </TabList>

                  <TabPanels>
                    <TabPanel height="28.5vh">
                      <Flex align="center" justify="center">
                        <Table variant="striped" colorScheme="twitter">
                          <Thead>
                            <Tr>
                              <Td>#</Td>
                              <Td>Name</Td>
                              <Td>Moodle ID</Td>
                              <Td>Points</Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {members.slice(0, 2).map((member, index) => (
                              <Tr key={member?.mid}>
                                <Td>{index + 1}</Td>
                                <Td
                                  onClick={() =>
                                    navigate(`/profile/${member?.mid}`)
                                  }
                                  textDecor="underline"
                                  cursor="pointer"
                                >
                                  {member?.fname} {member?.lname}
                                </Td>
                                <Td>{member?.mid}</Td>
                                <Td>{member?.totalPoints}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>

                        <Button
                          height="23vh"
                          colorScheme="twitter"
                          onClick={onOpen}
                        >
                          <ArrowRightIcon />
                        </Button>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </Flex>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
          <ModalContent>
            <ModalHeader>{houses?.members.length} Members</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflow="auto">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Td>#</Td>
                    <Td>Name</Td>
                    <Td>Moodle ID</Td>
                    <Td>Points</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {members.map((member, index) => (
                    <Tr key={member?.mid}>
                      <Td>{index + 1}</Td>
                      <Td
                        onClick={() => navigate(`/profile/${member?.mid}`)}
                        textDecor="underline"
                        cursor="pointer"
                      >
                        {member?.fname} {member?.lname}
                      </Td>
                      <Td>{member?.mid}</Td>
                      <Td>{member?.totalPoints}</Td>
                      {editPrivilege ? (
                        <Td>
                          <Link onClick={() => openDelete(member?.mid)}>
                            Remove
                          </Link>
                        </Td>
                      ) : null}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="4xl">
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
          <ModalContent>
            <ModalHeader>{houses?.name} Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap="20px">
              <Text fontSize="13px">
                <i
                  className="fa-solid fa-asterisk"
                  style={{ fontSize: "10px", marginRight: "5px" }}
                ></i>{" "}
                Required
              </Text>
              <Text fontSize="13px">
                <i
                  className="fa-solid fa-lock"
                  style={{ fontSize: "9px", marginRight: "5px" }}
                ></i>{" "}
                Requires Administrator Rights
              </Text>

              <Flex gap="20px">
                <InputGroup>
                  <InputLeftAddon>House Name*</InputLeftAddon>
                  <Input
                    placeholder="House Name*"
                    value={houseName}
                    onChange={(e) => {
                      setHouseName(e?.target?.value);
                    }}
                    isDisabled={role !== "A"}
                  />
                  <InputRightElement>
                    <i
                      className="fa-solid fa-lock"
                      style={{ fontSize: "9px", marginRight: "5px" }}
                    ></i>{" "}
                  </InputRightElement>
                </InputGroup>

                <InputGroup width="70%">
                  <InputLeftAddon>Color Hex* #</InputLeftAddon>
                  <SketchPicker
                    color={pickedColor}
                    onChange={(color) => {
                      setPickedColor(color?.hex);
                      setHouseColor(color?.hex);
                    }}
                    styles={{
                      default: {
                        picker: {
                          position: "absolute",
                          zIndex: "999",
                          right: -298,
                          width: "80%",
                        },
                      },
                    }}
                  />
                  <Input
                    placeholder="House Color Hex*"
                    value={houseColor}
                    onChange={(e) => {
                      setHouseColor(e?.target?.value);
                    }}
                  />
                </InputGroup>
              </Flex>

              <InputGroup>
                <InputLeftAddon>House Abstract*</InputLeftAddon>
                <Input
                  placeholder="House Abstract*"
                  value={houseAbstract}
                  onChange={(e) => {
                    setHouseAbstract(e?.target?.value);
                  }}
                />
              </InputGroup>

              <FormControl>
                <FormLabel>House Description</FormLabel>
                <Textarea
                  placeholder="House Description"
                  value={houseDesc}
                  onChange={(e) => {
                    setHouseDesc(e?.target?.value);
                  }}
                />
              </FormControl>

              <Flex gap="20px">
                {/*}<FormControl>
                  <FormLabel>Faculty Coordinator Moodle ID*</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>

                    <Input
                      placeholder="Faculty Coordinator Moodle ID*"
                      list="facSelect"
                      value={facCordID}
                      onChange={(e) => {
                        setFacCordID(e?.target?.value);
                      }}
                      isDisabled={role !== "A"}
                    />
                    <InputRightElement>
                      <i
                        className="fa-solid fa-lock"
                        style={{ fontSize: "9px", marginRight: "5px" }}
                      ></i>{" "}
                    </InputRightElement>
                  </InputGroup>
                    </FormControl>{*/}

                {/*} <FormControl>
                  <FormLabel>Student Coordinator Moodle ID*</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>
                    <Input
                      placeholder="Student Coordinator Moodle ID*"
                      list="stuSelect"
                      value={studentCordID}
                      onChange={(e) => {
                        setStudentCordID(e?.target?.value);
                      }}
                    />
                  </InputGroup>
                    </FormControl>{*/}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onSettingsClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={updateHouse}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Remove Member
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={delMem} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Modal isOpen={isLogoOpen} onClose={onLogoClose}>
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
          <ModalContent>
            <ModalHeader>Edit Logo</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflow="auto"></ModalBody>
            <Flex
              align="center"
              justify="center"
              direction="column"
              gap="20px"
              p="20px"
            >
              <AvatarEditor
                image={logo}
                width={250}
                height={250}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={logoZoom}
                rotate={0}
                borderRadius={250}
                ref={logoRef}
              />

              <Slider
                aria-label="slider-ex-1"
                value={logoZoom}
                onChange={setLogoZoom}
                min={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onLogoClose}>
                Close
              </Button>{" "}
              <Button onClick={saveLogo} isLoading={logoLoading}>
                Set
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isBannerOpen} onClose={onBannerClose} size="5xl">
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
          <ModalContent>
            <ModalHeader>Edit Banner</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflow="auto"></ModalBody>
            <Flex
              align="center"
              justify="center"
              direction="column"
              gap="20px"
              p="20px"
            >
              <AvatarEditor
                image={banner}
                width={865}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={bannerZoom}
                rotate={0}
                borderRadius={20}
                ref={bannerRef}
              />

              <Slider
                aria-label="slider-ex-1"
                value={bannerZoom}
                onChange={setBannerZoom}
                min={1}
                step={0.1}
                max={2}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onBannerClose}>
                Close
              </Button>
              <Button onClick={saveBanner} isLoading={bannerLoading}>
                Set
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default House;
