import {
  Box,
  Flex,
  HStack,
  IconButton,
  Stack,
  Img,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
} from "@chakra-ui/react";
import { NavLink as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

interface LinkItem {
  uri: string;
  label: string;
}

const mainLinks: LinkItem[] = [
  { uri: "/", label: "Inicio" },
  { uri: "/productos", label: "Productos" },
  { uri: "/informacion", label: "Información" },
];

const NavLink = ({
  uri,
  label,
  fullWidth = false,
  mx, // agregamos prop opcional para margen horizontal
  textAlign, // agregamos prop opcional para alineación de texto
}: LinkItem & {
  fullWidth?: boolean;
  mx?: number | string;
  textAlign?: "left" | "center" | "right";
}) => (
  <Box
    as={RouterLink}
    to={uri}
    px={3}
    py={2}
    mx={mx}
    rounded={fullWidth ? "md" : "full"}
    fontWeight="medium"
    w={
      fullWidth
        ? "calc(100% - 2 * " +
          (typeof mx === "number" ? mx + "px" : mx || "0") +
          ")"
        : "auto"
    }
    textAlign={textAlign || (fullWidth ? "center" : "left")}
    display="block"
    _hover={{ bg: "brand.100", textDecoration: "none" }}
  >
    {label}
  </Box>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="brand.50" px={4} boxShadow="md">
      {/* --- Barra principal --- */}
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Botón hamburguesa móvil */}
        <IconButton
          aria-label="Abrir menú"
          icon={
            isOpen ? (
              <MdClose size="1.5rem" />
            ) : (
              <GiHamburgerMenu size="1.5rem" />
            )
          }
          onClick={isOpen ? onClose : onOpen}
          bg="brand.300"
          color="white"
          _hover={{ bg: "brand.400" }}
          borderRadius="full"
          padding="10px"
          display={{ base: "flex", md: "none" }}
          alignItems="center"
          justifyContent="center"
        />

        {/* Logo + Links desktop */}
        <HStack spacing={6} alignItems="center">
          <Img h="60px" src="/img/Logo.png" alt="Logo de la panadería" />

          {/* Navegación desktop */}
          <HStack as="nav" spacing={2} display={{ base: "none", md: "flex" }}>
            {mainLinks.map((link) => (
              <NavLink key={link.uri} {...link} />
            ))}
          </HStack>
        </HStack>

        {/* Nombre de la panadería */}
        <Text
          fontFamily="heading"
          fontWeight="bold"
          fontSize="lg"
          color="brand.800"
        >
          Panificación Modelo
        </Text>
      </Flex>

      {/* --- Menú móvil desplegable --- */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="brand.50">
          <DrawerCloseButton mt={2} />

          <DrawerHeader fontWeight="bold" color="brand.800">
            Menú
          </DrawerHeader>

          <DrawerBody px={0}>
            <Stack as="nav" spacing={0}>
              {mainLinks.map((link) => (
                <Box key={link.uri} w="100%" onClick={onClose}>
                  <NavLink {...link} fullWidth mx={4} textAlign="left" />
                </Box>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
