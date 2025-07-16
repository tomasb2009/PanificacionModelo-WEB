import { Box, VStack, Flex, Heading, Text } from "@chakra-ui/react";
import {
  MdCoffee,
  MdBakeryDining,
  MdLocalDrink,
  MdAddCircle,
} from "react-icons/md";
import { GiSandwich, GiCoffeeCup } from "react-icons/gi";
import { useState, RefObject } from "react";

const categories = [
  { icon: MdCoffee, label: "Cafetería", id: "cafeteria" },
  { icon: GiCoffeeCup, label: "Combos", id: "combos" },
  { icon: MdBakeryDining, label: "Panadería", id: "panaderia" },
  { icon: GiSandwich, label: "Sandwich", id: "sandwich" },
  { icon: MdLocalDrink, label: "Bebidas", id: "bebidas" },
  { icon: MdAddCircle, label: "Para Agregar", id: "para-agregar" },
];

interface CategorySelectorProps {
  categoryRefs: RefObject<{ [key: string]: HTMLDivElement | null }>;
}

export function CategorySelector({ categoryRefs }: CategorySelectorProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current?.[categoryId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const handleCategoryClick = (idx: number, categoryId: string) => {
    setActiveIdx(idx);
    scrollToCategory(categoryId);
  };

  return (
    <Box mt={6}>
      <Box
        textAlign="center"
        mb={8}
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #DEA757, transparent)",
          borderRadius: "1px",
        }}
      >
        <Heading
          size="xl"
          color="brand.800"
          fontWeight="800"
          letterSpacing="wider"
          textTransform="uppercase"
          fontSize={{ base: "2xl", md: "3xl" }}
          textShadow="0 2px 4px rgba(0,0,0,0.1)"
        >
          Categorías
        </Heading>
        <Text
          fontSize="sm"
          color="brand.500"
          mt={2}
          fontWeight="medium"
          letterSpacing="wide"
        >
          Explora nuestros productos
        </Text>
      </Box>
      <Flex
        justify={{ base: "flex-start", md: "center" }}
        textAlign="center"
        overflowX={{ base: "auto", md: "visible" }}
        gap={{ base: 6, md: 12 }}
        px={{ base: 2, md: 1 }}
        py={{ base: 2, md: 0 }}
        sx={{
          "::-webkit-scrollbar": { display: "none" },
        }}
      >
        {categories.map((cat, idx) => {
          const isActive = activeIdx === idx;
          return (
            <VStack
              key={idx}
              minW={{ base: "80px", md: "90px" }}
              cursor="pointer"
              onClick={() => handleCategoryClick(idx, cat.id)}
              spacing={2}
              position="relative"
              role="button"
              tabIndex={0}
              _focus={{ outline: "none" }}
            >
              <Box
                fontSize={{ base: "2.7rem", md: "2.5rem" }}
                color={isActive ? "brand.400" : "gray.400"}
                transition="color 0.2s"
                _hover={{ color: "brand.400" }}
                lineHeight={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="none"
                p={0}
              >
                <cat.icon />
              </Box>
              <Text
                fontSize={{ base: "sm", md: "sm" }}
                fontWeight={isActive ? "semibold" : "normal"}
                color={isActive ? "brand.400" : "gray.500"}
                transition="color 0.2s"
                letterSpacing={0.2}
                whiteSpace="nowrap"
              >
                {cat.label}
              </Text>
              {isActive && (
                <Box
                  position="absolute"
                  bottom={-2}
                  left="50%"
                  transform="translateX(-50%)"
                  w="22px"
                  h="3px"
                  borderRadius="full"
                  bg="brand.400"
                />
              )}
            </VStack>
          );
        })}
      </Flex>
    </Box>
  );
}
