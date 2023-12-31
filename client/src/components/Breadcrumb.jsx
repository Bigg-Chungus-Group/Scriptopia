import React from "react";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Box,
  Button,
} from "@chakra-ui/react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";

const Breadcrumb = ({ title, links, relatedLinks }) => {
  return (
    <Box className="Breadcrumb">
      {" "}
      <Box className="left">
        {" "}
        <ChakraBreadcrumb>
          {links.map((link, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={link.href}>{link.name}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </ChakraBreadcrumb>
        <Heading p="0">{title}</Heading>
      </Box>
      <Box className="right">
        {relatedLinks?.map((link, index) => (
          <Link as={Link} to={link.href} key={index}>
            <Button colorScheme="green">{link.name}</Button>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default Breadcrumb;
