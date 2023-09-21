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
} from "@chakra-ui/react";
import "./Certificate.css";
import Navbar from "../../../../components/student/Navbar";
import Loader from "../../../../components/Loader";
import { useAuthCheck } from "../../../../hooks/useAuthCheck";

const Certificate = () => {
  useAuthCheck("S");
  const [certificate, setCertificate] = useState({});
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [certificateName, setCertificateName] = useState();
  const [issuingOrg, setIssuingOrg] = useState();
  const [issueMonth, setIssueMonth] = useState();
  const [issueYear, setIssueYear] = useState();
  const [certificateType, setCertificateType] = useState();
  const [certificateLevel, setCertificateLevel] = useState();

  const [loader1, setLoader1] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);

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
    const id = window.location.pathname.split("/")[2];

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/get`, {
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
      window.location.href = certificate.certificateURL;
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
        <Navbar />
        <Box className="StudentCertificate">
          <Box className="info">
            <Text>
              {certificate?.certificateType?.charAt(0).toUpperCase() +
                certificate?.certificateType?.slice(1)}{" "}
              Certification -{" "}
              {certificate?.certificateLevel.charAt(0).toUpperCase() +
                certificate?.certificateLevel.slice(1)}{" "}
              Level
            </Text>
            <Heading>
              {certificate?.certificateName.charAt(0).toUpperCase() +
                certificate?.certificateName.slice(1)}{" "}
            </Heading>
            <Text>
              Issued On:{" "}
              {certificate?.issueMonth.charAt(0).toUpperCase() +
                certificate?.issueMonth.slice(1)}{" "}
              {certificate.issueYear}
            </Text>
            <Text>
              By:{" "}
              {certificate?.issuingOrg?.charAt(0).toUpperCase() +
                certificate?.issuingOrg?.slice(1)}
            </Text>
          </Box>

          <Box className="track-wrapper">
            <Text color="green" fontWeight="500">
              You Earned {certificate?.XP + "XP" || "0XP"} from this Certificate
            </Text>
            <Text color="green" fontWeight="500">
              Your House Earned {certificate?.houseXP + "XP" || "0XP"} from this
              Certificate
            </Text>
            <Text fontSize="20px">Status</Text>
            <Box className="track">
              <Box className="uploaded green">Uploaded</Box>
              <Box
                className={`reviewed ${
                  certificate?.status === "approved" ||
                  certificate.status === "rejected"
                    ? "green"
                    : ""
                }`}
              >
                {certificate?.status === "approved" ||
                certificate.status === "rejected"
                  ? "Reviewed"
                  : "Not Reviewed"}
              </Box>
              <Box
                className={`status  ${
                  certificate?.status === "approved"
                    ? "green"
                    : certificate?.status === "rejected"
                    ? "red"
                    : ""
                }`}
              >
                {certificate?.status === "approved"
                  ? "Approved"
                  : certificate?.status === "rejected"
                  ? "Rejected"
                  : "Not Reviewed"}
              </Box>
            </Box>
          </Box>

          <Box className="comments">
            <Textarea
              readOnly
              resize="none"
              value={
                certificate?.comment ? certificate?.comment : "No Comments Yet"
              }
            />
          </Box>

          <Box className="buttons">
            <Button colorScheme="red" onClick={onOpen}>
              Delete Certificate
            </Button>
            <Button colorScheme="blue" onClick={onEditOpen}>
              Edit Certificate
            </Button>
            <Button
              colorScheme="green"
              onClick={handleDownload}
              isLoading={loader3}
            >
              Download / View Certificate
            </Button>
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
