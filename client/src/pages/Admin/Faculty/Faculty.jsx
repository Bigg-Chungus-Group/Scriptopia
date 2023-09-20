import React, { useEffect, useState } from "react";
import "./Faculty.css";
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  AlertDialog,
  useToast,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  ModalCloseButton,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Navbar from "../../../components/admin/Navbar";
import Breadcrumb from "../../../components/Breadcrumb";
import Loader from "../../../components/Loader";

const Faculty = () => {
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaculty, seFilteredFaculty] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [delItem, setDelItem] = useState({});
  const toast = useToast();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelDeleteRef = React.useRef();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty`, {
      // ! CHANGE TO FACULTY
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setFaculty(data.faculty);
      });
  }, [searchQuery]);

  useEffect(() => {
    const filtered = faculty.filter((faculty) =>
      Object.values(faculty).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    seFilteredFaculty(filtered);
  }, [searchQuery, faculty]);

  const deleteCustomer = (id) => {
    setDelItem(id);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mid: delItem,
      }),
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (data.success) {
          onDeleteClose();
          setSearchQuery("");
          toast({
            title: "Success",
            description: "Faculty deleted successfully",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location.reload();
        } else {
          onDeleteClose();
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 2000,
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
          duration: 2000,
          isClosable: true,
        });
      });
  };

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Breadcrumb
          title="Faculty"
          links={[
            { href: "/admin", name: "Admin" },
            { href: "/admin/faculty", name: "Faculty" },
          ]}
          relatedLinks={[{ href: "/admin/faculty/add", name: "Add Faculty" }]}
        />
        <Box className="AdminStudents">
          <Box className="filters">
            <Box className="filters">
              <Box className="ipgroup">
                <FormLabel>Search</FormLabel>
                <Input
                  placeholder="Search By Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr
                  position="sticky"
                  top="0px"
                  className="tabletop"
                  zIndex="sticky"
                  backgroundColor="#F7F6FA"
                >
                  <Th>Moodle ID</Th>
                  <Th>Name</Th>
                  <Th>Branch</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFaculty.map((faculty) => (
                  <Tr key={faculty.mid}>
                    <Td>{faculty.mid}</Td>
                    <Td>{faculty.name}</Td>
                    <Td>{faculty.branch}</Td>
                    <Td>
                      <Box className="actions">
                        <Box
                          className="action"
                          cursor="pointer"
                          onClick={onOpen}
                        >
                          Edit
                        </Box>
                        <Box
                          className="action"
                          cursor="pointer"
                          onClick={() => deleteCustomer(faculty.mid)}
                        >
                          Delete
                        </Box>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody></ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Faculty
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
};

export default Faculty;
