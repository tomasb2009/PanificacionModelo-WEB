import { Box, Image, Text, Center } from "@chakra-ui/react";

type ProductCardProps = {
  name: string;
  image: string;
  price?: number;
  description?: string;
};

export function ProductCard({
  name,
  image,
  price,
  description,
}: ProductCardProps) {
  return (
    <Box
      w={{ base: "360px", md: "320px", lg: "320px" }}
      bg="white"
      borderRadius="2xl"
      boxShadow="md"
      overflow="hidden"
      transition="box-shadow 0.15s"
      _hover={{ boxShadow: "lg" }}
      border="1px solid"
      borderColor="gray.100"
      cursor="pointer"
      p={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        w="100%"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box w="100%" aspectRatio={1} maxW="100%" maxH="100%">
          {image ? (
            <Image
              src={image}
              alt={name}
              objectFit="cover"
              w="100%"
              h="100%"
              borderRadius="lg"
            />
          ) : (
            <Center
              w="100%"
              h="100%"
              bg="gray.100"
              borderRadius="lg"
              border="2px dashed"
              borderColor="gray.300"
            >
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Sin imagen
              </Text>
            </Center>
          )}
        </Box>
      </Box>
      <Box
        w="100%"
        px={3}
        py={3}
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          textAlign="center"
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Text
            fontSize="md"
            fontWeight="bold"
            textAlign="center"
            color="gray.800"
            noOfLines={2}
            mb={2}
          >
            {name}
          </Text>
          {description && description.trim() && (
            <Text
              fontSize="sm"
              color="gray.600"
              textAlign="center"
              lineHeight="1.5"
              mb={2}
              wordBreak="break-word"
              whiteSpace="pre-wrap"
            >
              {description}
            </Text>
          )}
        </Box>
        {typeof price === "number" && (
          <Text fontSize="lg" color="brand.600" fontWeight="bold" mt="auto">
            ${price.toFixed(2)}
          </Text>
        )}
      </Box>
    </Box>
  );
}
