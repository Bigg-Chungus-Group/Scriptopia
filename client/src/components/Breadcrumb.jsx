import React from "react";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Box,
  Link as ChakraLink,
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
        <Heading>{title}</Heading>
      </Box>
      <Box className="right">
        {relatedLinks?.map((link, index) => (
          <ChakraLink as={Link} to={link.href} key={index}>
            {link.name}
          </ChakraLink>
        ))}
      </Box>
    </Box>
  );
};

export default Breadcrumb;
