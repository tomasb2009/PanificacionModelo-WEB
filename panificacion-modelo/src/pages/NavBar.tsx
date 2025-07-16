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
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { NavLink as RouterLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { useAuth } from "./contexts/AuthContext";

interface LinkItem {
  uri: string;
  label: string;
  requiresAuth?: boolean;
}

const mainLinks: LinkItem[] = [
  { uri: "/", label: "Inicio" },
  { uri: "/productos", label: "Menú" },
  { uri: "/informacion", label: "Información" },
  { uri: "/agregarProductos", label: "Agregar Producto", requiresAuth: true },
];

const NavLink = ({
  uri,
  label,
  fullWidth = false,
  mx,
  textAlign,
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
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filtrar enlaces según autenticación
  const visibleLinks = mainLinks.filter((link) => !link.requiresAuth || user);

  return (
    <Box bg="brand.50" px={4} boxShadow="md">
      {/* --- Barra principal --- */}
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Zona izquierda: Botón hamburguesa (solo mobile) */}
        <Box display={{ base: "flex", md: "none" }}>
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
          />
        </Box>

        {/* Zona central: Logo único (centrado solo en mobile) */}
        <Box
          flex="1"
          display="flex"
          justifyContent={{ base: "center", md: "flex-start" }}
          alignItems="center"
        >
          <HStack spacing={6}>
            <Img h="60px" src="/img/Logo.png" alt="Logo de la panadería" />

            {/* Links pegados al logo en desktop */}
            <HStack as="nav" spacing={2} display={{ base: "none", md: "flex" }}>
              {visibleLinks.map((link) => (
                <NavLink key={link.uri} {...link} />
              ))}
            </HStack>
          </HStack>
        </Box>

        {/* Zona derecha: Usuario logueado o texto (solo desktop) */}
        <Box display={{ base: "none", md: "flex" }} alignItems="center" gap={4}>
          <Text
            fontFamily="heading"
            fontWeight="bold"
            fontSize="lg"
            color="brand.800"
            whiteSpace="nowrap"
          >
            Panificación Modelo
          </Text>

          {user && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={3}
                py={5}
                borderRadius="full"
                _hover={{ bg: "brand.100" }}
              >
                <HStack spacing={2}>
                  <Avatar size="sm" name={user.email} />
                  <Text fontSize="sm" color="brand.800">
                    {user.email}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
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
              {visibleLinks.map((link) => (
                <Box key={link.uri} w="92%" onClick={onClose}>
                  <NavLink {...link} fullWidth mx={4} textAlign="left" />
                </Box>
              ))}

              {/* Botón de logout en móvil (solo si está logueado) */}
              {user && (
                <Box w="92%" mx={4} mt={4}>
                  <Button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    colorScheme="red"
                    variant="outline"
                    width="100%"
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
