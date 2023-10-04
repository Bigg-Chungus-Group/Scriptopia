import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Alert,
  Flex,
} from "@chakra-ui/react";
import "./Certificate.css";
import Navbar from "../../components/student/Navbar";
import Loader from "../../components/Loader";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import AdminNavbar from "../../components/admin/Navbar";
import FacultyNavbar from "../../components/faculty/Navbar";
import GuestNavbar from "../../components/guest/Navbar";

const Certificate = () => {
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [certificateName, setCertificateName] = useState();
  const [issuingOrg, setIssuingOrg] = useState();
  const [issueMonth, setIssueMonth] = useState();
  const [issueYear, setIssueYear] = useState();
  const [certificateType, setCertificateType] = useState();
  const [certificateLevel, setCertificateLevel] = useState();

  const [editPrivilege, setEditPrivilege] = useState(false);
  const [role, setRole] = useState("");
  const [mid, setMid] = useState("");

  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);

  const [colorStatus, setColorStatus] = useState("blue");

  const [steps, setSteps] = useState([
    { title: "Step I: Upload", description: "Uploaded" },
    { title: "Step II: Review", description: "Pending" },
    { title: "Step III: Approval By Faculty", description: "Pending" },
  ]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const year = new Date().getFullYear();
  const prevYear = year - 1;
  const prevPrevYear = year - 2;
  const prevPrevPrevYear = year - 3;

  useEffect(() => {
    let jwt;
    const token = Cookies.get("token");
    if (token) {
      jwt = jwtDecode(token);
      if (jwt?.role) {
        setRole(jwt.role);
        if (jwt.role === "S") {
          console.log(jwt.mid);
          setMid(jwt.mid);
        }
      } else {
        setRole("G");
      }
    }
  }, []);

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/certificates/get`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCertificate(data);
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
      });
  }, []);

  useEffect(() => {
    if (certificate?.mid === mid) {
      setEditPrivilege(true);
    }
  }, [certificate]);

  const toast = useToast();

  useEffect(() => {
    setCertificateName(certificate?.certificateName);
    setIssuingOrg(certificate?.issuingOrg);
    setIssueMonth(certificate?.issueMonth);
    setIssueYear(certificate?.issueYear);
    setCertificateType(certificate?.certificateType);
    setCertificateLevel(certificate?.certificateLevel);
  }, [certificate]);

  const handleDownload = () => {
    setLoader3(true);
    if (certificate.uploadType === "url") {
      setLoader3(false);
      window.open(certificate.certificateURL, "_blank");
      return;
    }

    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/download`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: certificate._id,
        }),
      }
    )
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${certificate.certificateName}.${certificate.ext}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoader3(false);
      })
      .catch((err) => {
        setLoader3(false);
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  useEffect(() => {
    const updatedSteps = [...steps];

    if (certificate.status === "rejected") {
      updatedSteps[2].description = "Rejected";
      updatedSteps[1].description = "Reviewed";
      setActiveStep(2);
      setColorStatus("red");
    }

    if (certificate.status === "approved") {
      updatedSteps[2].description = "Approved";
      updatedSteps[1].description = "Approved";
      setActiveStep(2);
      setColorStatus("green");
    }

    if (certificate.status === "pending") {
      updatedSteps[2].title = "Pending";
      setActiveStep(0);
      setColorStatus("blue");
    }

    setSteps(updatedSteps);
  }, [certificate]);

  const handleUpdate = () => {
    setLoader2(true);
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/update`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificateName,
          issuingOrg,
          issueMonth,
          issueYear,
          certificateType,
          certificateLevel,
          id: certificate._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLoader2(false);
        onEditClose();
        window.location.reload();
      })
      .catch((err) => {
        setLoader2(false);
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    setLoader1(true);
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/delete`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: certificate._id,
        }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setLoader1(false);
        toast({
          title: "Success",
          description: "Certificate Deleted Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        window.location.href = "/certificates";
      })
      .catch((err) => {
        setLoader1(false);
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (!loading) {
    return (
      <>
        {role === "S" ? (
          <Navbar />
        ) : role === "A" ? (
          <AdminNavbar />
        ) : role === "F" ? (
          <FacultyNavbar />
        ) : (
          <GuestNavbar />
        )}
        <Box className="StudentCertificate">
          <Box className="info" display="flex" flexDir="column" gap="20px">
            <Text textAlign="center">
              {certificate?.certificateType?.charAt(0).toUpperCase() +
                certificate?.certificateType?.slice(1)}{" "}
              Certification -{" "}
              {certificate?.certificateLevel.charAt(0).toUpperCase() +
                certificate?.certificateLevel.slice(1)}{" "}
              Level
            </Text>
            <Text textAlign="center" mt="-17px">
              Uploaded By {certificate.name}
            </Text>
            <Heading textAlign="center">
              {certificate?.certificateName.charAt(0).toUpperCase() +
                certificate?.certificateName.slice(1)}{" "}
            </Heading>
            <Text textAlign="center">
              By{" "}
              {certificate?.issuingOrg?.charAt(0).toUpperCase() +
                certificate?.issuingOrg?.slice(1)}
            </Text>

            <Button
              colorScheme="green"
              onClick={handleDownload}
              isLoading={loader3}
              width="fit-content"
              alignSelf="center"
            >
              Download / View Certificate
            </Button>

            <Text textAlign="center">
              Issued On{" "}
              {certificate?.issueMonth.charAt(0).toUpperCase() +
                certificate?.issueMonth.slice(1)}{" "}
              {certificate.issueYear}
            </Text>
          </Box>

          <Box className="track-wrapper">
            <Flex align="center" justify="center" mt="20px">
              <Stepper
                index={activeStep}
                width="50vw"
                alignSelf="center"
                colorScheme={colorStatus}
                mb="20px"
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Flex>
          </Box>

          <Box className="comments" mb="20px">
            <Textarea
              readOnly
              resize="none"
              value={
                certificate?.comments ? certificate?.comments : "No Comments Yet"
              }
            />
          </Box>

          <Box className="buttons">
            {certificate.status !== "approved" && editPrivilege ? (
              <Button colorScheme="blue" onClick={onEditOpen}>
                Edit Certificate
              </Button>
            ) : editPrivilege ? (
              <>
                <Text color="green" fontWeight="500">
                  Your House Earned{" "}
                  {certificate?.xp ? certificate?.xp + " XP" : "0 XP"}{" "}
                  from this Certificate
                </Text>
              </>
            ) : (
              <>
                <Text color="green" fontWeight="500">
                  {certificate.name} Earned{" "}
                  {certificate?.xp ? certificate?.xp + " XP" : "0 XP"}{" "}
                  from this Certificate
                </Text>
              </>
            )}{" "}
            {editPrivilege ? (
              <Button colorScheme="red" onClick={onOpen}>
                Delete Certificate
              </Button>
            ) : null}
          </Box>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Certificate?
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You will lose all the XP associated with this
                  certificate.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDelete}
                    ml={3}
                    isLoading={loader1}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Certificate</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box className="upload-main-StudentCertificates">
                  <Alert status="info" marginBottom="20px">
                    Your Certificate will be verified and approved by the house
                    coordinator.
                  </Alert>

                  <FormControl>
                    <FormLabel>Certificate Name</FormLabel>
                    <Input
                      type="text"
                      placeholder=""
                      onChange={(e) => {
                        setCertificateName(e.target.value);
                      }}
                      value={certificateName}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Issuing Organization</FormLabel>
                    <Input
                      type="text"
                      placeholder=""
                      onChange={(e) => {
                        setIssuingOrg(e.target.value);
                      }}
                      value={issuingOrg}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Certification Date</FormLabel>
                    <Box className="flex">
                      <Select
                        placeholder="Select Month"
                        onChange={(e) => setIssueMonth(e.target.value)}
                        value={issueMonth}
                      >
                        <option value="jan">January</option>
                        <option value="feb">February</option>
                        <option value="mar">March</option>
                        <option value="apr">April</option>
                        <option value="may">May</option>
                        <option value="jun">June</option>
                        <option value="jul">July</option>
                        <option value="aug">August</option>
                        <option value="sep">September</option>
                        <option value="oct">October</option>
                        <option value="nov">November</option>
                        <option value="dec">December</option>
                      </Select>

                      <Select
                        placeholder="Select Year"
                        onChange={(e) => setIssueYear(e.target.value)}
                        value={issueYear}
                      >
                        <option value={prevPrevPrevYear}>
                          {prevPrevPrevYear}
                        </option>
                        <option value={prevPrevYear}>{prevPrevYear}</option>
                        <option value={prevYear}>{prevYear}</option>
                        <option value={year}>{year}</option>
                      </Select>
                    </Box>
                  </FormControl>

                  <Box className="flex">
                    <Select
                      placeholder="Select Type"
                      onChange={(e) => setCertificateType(e.target.value)}
                      value={certificateType}
                    >
                      <option value="internal">Internal Certification</option>
                      <option value="external">External Certification</option>
                    </Select>

                    <Select
                      placeholder="Select Level"
                      onChange={(e) => setCertificateLevel(e.target.value)}
                      value={certificateLevel}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </Box>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onEditClose}>
                  Close
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleUpdate}
                  isLoading={loader2}
                >
                  Submit for Re-Approval
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Certificate;
