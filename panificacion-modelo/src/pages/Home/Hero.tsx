import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  useBreakpointValue,
  StackDirection,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  // Títulos y textos más grandes en móvil, normales en desktop
  const headingSize = useBreakpointValue({
    base: "5xl", // más grande en móvil
    md: "6xl", // tamaño normal en desktop
  });

  const textSize = useBreakpointValue({
    base: "lg", // más grande en móvil
    md: "xl", // normal en desktop
  });

  // Botones siempre en columna en móvil, fila en desktop
  const stackDirection = useBreakpointValue<StackDirection>({
    base: "column",
    md: "row",
  });

  // Tamaño de botones, puedes ajustar si quieres
  const btnSize = useBreakpointValue({
    base: "lg",
    md: "lg",
  });

  return (
    <Flex
      position="relative"
      w="full"
      h="calc(100vh - 64px)"
      align="center"
      justify="center"
      overflow="hidden"
    >
      {/* Fondo */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="full"
        height="full"
        backgroundImage="url('./img/Fondo.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.75)"
        zIndex={-2}
      />

      {/* Overlay transparente */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="full"
        height="full"
        bg="blackAlpha.400"
        zIndex={-1}
      />

      <Container maxW={{ base: "95vw", md: "3xl" }} zIndex={1}>
        <Stack
          as={Box}
          textAlign="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 10, md: 12 }}
          color="white"
        >
          <Heading
            as="h1"
            fontWeight="extrabold"
            fontSize={headingSize}
            lineHeight="1.1"
            letterSpacing="tight"
            userSelect="none"
            textShadow="0 2px 6px rgba(0,0,0,0.5)"
          >
            <Text as="span" display="block">
              Bienvenidos a
            </Text>
            <Text as="span" color="yellow.400" display="inline">
              Panificación
            </Text>{" "}
            <Text as="span" color="blue.400" display="inline">
              Modelo
            </Text>
          </Heading>

          <Text
            fontWeight="semibold"
            fontSize={textSize}
            maxW="600px"
            mx="auto"
            opacity={0.85}
            userSelect="none"
            textShadow="0 1px 3px rgba(0,0,0,0.5)"
          >
            Cada día amasamos con amor y dedicación para llenar tu mesa con el
            sabor y la frescura de nuestras recetas tradicionales. ¡El hogar de
            los mejores panes y dulces de la ciudad!
          </Text>

          <Stack
            direction={stackDirection}
            spacing={4}
            align="center"
            justify="center"
            pt={4}
            w={{ base: "full", md: "auto" }}
          >
            <Button
              bg="yellow.400"
              color="gray.900"
              rounded="full"
              px={{ base: 12, md: 16 }}
              py={{ base: 6, md: 6 }}
              fontSize={btnSize}
              boxShadow="0 4px 12px rgba(237, 202, 111, 0.4)"
              _hover={{
                bg: "yellow.500",
                boxShadow: "0 6px 20px rgba(237, 202, 111, 0.6)",
              }}
              _active={{
                bg: "yellow.500",
                transform: "scale(0.95)",
                boxShadow: "0 3px 10px rgba(237, 202, 111, 0.6)",
              }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={() => navigate("/productos")}
              aria-label="Ver todos los productos"
              userSelect="none"
              w={{ base: "full", md: "auto" }}
              textAlign="center"
            >
              Todos los Productos
            </Button>

            <Button
              variant="link"
              color="yellow.400"
              fontSize={btnSize}
              _hover={{ textDecoration: "underline" }}
              _active={{ color: "yellow.500" }}
              onClick={() => navigate("/informacion")}
              aria-label="Más información"
              userSelect="none"
              w={{ base: "full", md: "auto" }}
              textAlign="center"
            >
              Más información
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}
