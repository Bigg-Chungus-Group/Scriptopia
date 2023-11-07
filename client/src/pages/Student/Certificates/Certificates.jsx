0;
import React, { useEffect } from "react";
import Navbar from "../../../components/student/Navbar/";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  ModalCloseButton,
  useToast,
  Text,
  Input,
  FormLabel,
  Alert,
  FormControl,
  Select,
  Checkbox,
  InputGroup,
  InputRightAddon,
  Flex,
  CheckboxGroup,
} from "@chakra-ui/react";
import Breadcrumb from "../../../components/Breadcrumb";
import "./Certificates.css";
import Loader from "../../../components/Loader";
import { Link } from "react-router-dom";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Certificates = () => {
  useAuthCheck("S");
  const [certificates, setCertificates] = React.useState([]);
  const [filteredCertificates, setFilteredCertificates] = React.useState([]); // eslint-disable-line no-unused-vars
  const [loading, setLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [btnLoading, setBtnLoading] = React.useState(false); // eslint-disable-line no-unused-vars

  const [certificateName, setCertificateName] = React.useState("");
  const [issuingOrg, setIssuingOrg] = React.useState("");
  const [issueMonth, setIssueMonth] = React.useState("null");
  const [issueYear, setIssueYear] = React.useState("null");
  const [expiry, setExpiry] = React.useState(false);
  const [expiryMonth, setExpiryMonth] = React.useState("null");
  const [expiryYear, setExpiryYear] = React.useState("null");
  const [certificateType, setCertificateType] = React.useState("");
  const [certificateLevel, setCertificateLevel] = React.useState("");
  const [certificateUrl, setCertificateUrl] = React.useState("");
  const [file, setFile] = React.useState("");
  const [fileName, setFileName] = React.useState("No File Selected");

  useEffect(() => {
    console.log(expiry);
  }, [expiry]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        setLoading(false);
        if (res.status === 200) {
          const data = await res.json();
          setCertificates(data);
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

  const year = new Date().getFullYear();
  const prevYear = year - 1;
  const prevPrevYear = year - 2;
  const prevPrevPrevYear = year - 3;

  const handleUpload = () => {
    setBtnLoading(true);
    const uploadedCertificate = document.querySelector("#upload").files[0];

    const formData = new FormData();

    if (
      certificateName === "" ||
      issuingOrg === "" ||
      issueMonth === "" ||
      issueYear === "" ||
      expiryMonth === "" ||
      expiryYear === "" ||
      certificateType === "" ||
      certificateLevel === ""
    ) {
      setBtnLoading(false);
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (uploadedCertificate || certificateUrl) {
      if (
        certificateName &&
        issuingOrg &&
        issueMonth &&
        issueYear &&
        certificateType &&
        certificateLevel
      ) {
        formData.append("certificateName", certificateName);
        formData.append("issuingOrg", issuingOrg);
        formData.append("issueMonth", issueMonth);
        formData.append("issueYear", issueYear);
        formData.append("expires", expiry);
        formData.append("expiryMonth", expiryMonth);
        formData.append("expiryYear", expiryYear);
        formData.append("certificateType", certificateType);
        formData.append("certificateLevel", certificateLevel);
        formData.append("certificateURL", certificateUrl);
        formData.append("certificate", file);

        fetch(
          `${import.meta.env.VITE_BACKEND_ADDRESS}/student/certificates/upload`,
          {
            method: "POST",
            credentials: "include",
            body: formData, // Use the FormData object as the body
          }
        )
          .then(async (res) => {
            setBtnLoading(false);
            if (res.status === 200) {
              window.location.reload();
              onClose();
            } else if (uploadedCertificate && certificateUrl) {
              toast({
                title: "Error",
                description: "Please fill either URL or upload certificate",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
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
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill either URL or upload certificate",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFile = (file) => {
    setFileName(file.name);
    setFile(file);
  };

  useEffect(() => {
    setFilteredCertificates(certificates);
  }, [certificates]);

  const search = (e) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const result = filteredCertificates.filter((certificate) => {
        certificate.certificateName = certificate.certificateName.toLowerCase();

        return certificate.certificateName.includes(keyword.toLowerCase());
      });
      setFilteredCertificates(result);
    } else {
      setFilteredCertificates(certificates);
    }
  };

  const filterType = (e) => {
    const type = e;
    if (type.length !== 0) {
      const result = certificates.filter((certificate) => {
        return type.includes(certificate.certificateType);
      });
      setFilteredCertificates(result);
    } else {
      setFilteredCertificates(certificates);
    }
  };

  if (!loading) {
    return (
      <>
        <Navbar />
        <Breadcrumb title="Certificates" links={[{ href: "/", name: "" }]} />
        <Box className="StudentCertificates">
          <Button colorScheme="green" marginBottom="20px" onClick={onOpen}>
            Upload Certificate
          </Button>
          <Flex gap="20px" alignItems="center" mb="20px">
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => search(e)}
              width="50%"
            />

            <CheckboxGroup onChange={(e) => filterType(e)}>
              <Checkbox value="internal">Internal</Checkbox>
              <Checkbox value="external">External</Checkbox>
            </CheckboxGroup>
          </Flex>
          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Sr No.</Th>
                  <Th>Certification Name</Th>
                  <Th>Issuing Organization</Th>
                  <Th>Issue Date</Th>
                  <Th>Certification Type</Th>
                  <Th>Level</Th>
                  <Th>Status</Th>
                  <Th>View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCertificates.map((certificate, index) => (
                  /* ! CHANGE TARGET*/
                  <Tr key={certificate?._id}>
                    <Td>{index + 1}</Td>
                    <Td>{certificate?.certificateName}</Td>
                    <Td>{certificate?.issuingOrg}</Td>
                    <Td>
                      {certificate?.issueMonth?.charAt(0).toUpperCase() +
                        certificate?.issueMonth?.slice(1)}{" "}
                      {certificate?.issueYear}
                    </Td>
                    <Td>
                      {certificate?.certificateType?.charAt(0).toUpperCase() +
                        certificate?.certificateType?.slice(1)}
                    </Td>
                    <Td>
                      {certificate?.certificateLevel?.charAt(0).toUpperCase() +
                        certificate?.certificateLevel?.slice(1)}
                    </Td>
                    <Td>
                      {certificate.status?.charAt(0).toUpperCase() +
                        certificate.status?.slice(1)}
                    </Td>
                    <Td>
                      <Link to={`/certificates/${certificate?._id}`}>View</Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)/" />
            <ModalContent>
              <ModalHeader>Upload Certificate</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box className="upload-main-StudentCertificates">
                  <Alert status="info" marginBottom="20px">
                    Your Certificate will be verified and approved by the house
                    coordinator.
                  </Alert>

                  <Box className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Certificate Name"
                        onChange={(e) => {
                          setCertificateName(e?.target?.value);
                        }}
                        value={certificateName}
                      />
                    </FormControl>

                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Issuing Organization"
                        onChange={(e) => {
                          setIssuingOrg(e?.target?.value);
                        }}
                        value={issuingOrg}
                      />
                    </FormControl>
                  </Box>

                  <FormControl>
                    <Box className="flex">
                      <Select
                        onChange={(e) => setIssueMonth(e?.target?.value)}
                        value={issueMonth}
                      >
                        <option value="null" disabled>
                          Certification Issue Month
                        </option>
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
                        onChange={(e) => setIssueYear(e?.target?.value)}
                        value={issueYear}
                      >
                        <option value="null" disabled>
                          Certification Issue Year
                        </option>
                        <option value={prevPrevPrevYear}>
                          {prevPrevPrevYear}
                        </option>
                        <option value={prevPrevYear}>{prevPrevYear}</option>
                        <option value={prevYear}>{prevYear}</option>
                        <option value={year}>{year}</option>
                      </Select>
                    </Box>
                  </FormControl>

                  <FormControl>
                    <Flex
                      alignSelf="flex-start"
                      justifySelf="flex-start"
                      gap="20px"
                      height="40px"
                    >
                      <Flex width="500px" align="center" gap="10px">
                        <Text>Certificate Expires?</Text>
                        <Checkbox
                          border="lightgray"
                          colorScheme="green"
                          onChange={(e) => setExpiry(e.target.checked)}
                        />
                      </Flex>

                      {expiry ? (
                        <>
                          <Select
                            onChange={(e) => setExpiryMonth(e?.target?.value)}
                            value={expiryMonth}
                          >
                            <option value="null" disabled>
                              Certification Expiry Month
                            </option>
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
                            onChange={(e) => setExpiryYear(e?.target?.value)}
                            value={expiryYear}
                          >
                            <option
                              value="null"
                              className="disabledOpt"
                              disabled
                            >
                              Certification Expiry Year
                            </option>
                            <option value={year}>{year}</option>
                            <option value={year + 1}>{year + 1}</option>
                            <option value={year + 2}>{year + 2}</option>
                            <option value={year + 3}>{year + 3}</option>
                          </Select>
                        </>
                      ) : null}
                    </Flex>
                  </FormControl>

                  <Box className="flex">
                    <Select
                      placeholder="Select Type"
                      onChange={(e) => setCertificateType(e?.target?.value)}
                      value={certificateType}
                    >
                      <option value="internal">Internal Certification</option>
                      <option value="external">External Certification</option>
                    </Select>

                    <Select
                      placeholder="Select Level"
                      onChange={(e) => setCertificateLevel(e?.target?.value)}
                      value={certificateLevel}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </Box>

                  <Box className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Certification URL"
                        onChange={(e) => setCertificateUrl(e?.target?.value)}
                        value={certificateUrl}
                      />
                    </FormControl>
                    <Text>OR</Text>
                    <FormControl>
                      <Box className="flex">
                        <label htmlFor="upload" className="upload-btn">
                          Upload Certificate
                        </label>
                        <p>{fileName}</p>
                      </Box>
                      <Input
                        type="file"
                        name="upload"
                        placeholder="Upload Certificate"
                        id="upload"
                        accept=".pdf , .jpg , .jpeg , .png, .webp"
                        onChange={(e) => {
                          handleFile(e?.target?.files[0]);
                        }}
                      />
                    </FormControl>
                  </Box>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" onClick={handleUpload} isLoading={btnLoading} >
                  Submit for Approval
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

export default Certificates;
