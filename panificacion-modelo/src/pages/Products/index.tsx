import {
  Box,
  Heading,
  Center,
  Text,
  VStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useMemo, useState, useEffect } from "react";
import { MdArrowUpward } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import { CategorySelector } from "../../components/CategorySelector";
import { ProductGrid } from "../../components/ProductGrid";

function Products() {
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  // Ocultar loading inicial después de un breve delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 300); // 300ms de skeleton inicial

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Obtener categorías
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Categories")
        .select("*")
        .order("name");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Obtener productos
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  // Agrupar productos por categoría
  const grouped = useMemo(() => {
    // Definir el orden de las categorías como en CategorySelector
    const categoryOrder = [
      "Cafetería",
      "Combos",
      "Panadería",
      "Para Agregar",
      "Sandwich",
      "Bebidas",
    ];

    // Crear un mapa de categorías por nombre para acceso rápido
    const categoriesMap = new Map(categories.map((cat) => [cat.name, cat]));

    // Ordenar según el orden definido en CategorySelector
    return categoryOrder
      .map((categoryName) => {
        const category = categoriesMap.get(categoryName);
        if (!category) return null;

        const categoryProducts = products
          .filter((p) => p.category_id === category.id)
          .sort((a, b) => (a.id > b.id ? 1 : -1)); // Ordenar por ID dentro de cada categoría

        return {
          ...category,
          products: categoryProducts,
        };
      })
      .filter(Boolean); // Eliminar categorías que no existen
  }, [categories, products]);

  // Mostrar skeleton si está cargando O si es la carga inicial
  if (loadingCategories || loadingProducts || showInitialLoading) {
    return (
      <Box pt={4} px={4}>
        {/* Skeleton del CategorySelector */}
        <Box mt={6} mb={8}>
          <Center mb={8}>
            <Skeleton height="40px" width="200px" />
          </Center>
          <Center mb={4}>
            <Skeleton height="20px" width="300px" />
          </Center>
          <Flex justify="center" gap={12}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <VStack key={i} spacing={2}>
                <Skeleton height="60px" width="60px" borderRadius="full" />
                <Skeleton height="16px" width="80px" />
              </VStack>
            ))}
          </Flex>
        </Box>

        {/* Skeleton de categorías */}
        {[1, 2, 3].map((catIndex) => (
          <Box key={catIndex} mb={10}>
            <Center mb={6} mt={8}>
              <Skeleton height="32px" width="150px" />
            </Center>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
              gap={6}
            >
              {[1, 2, 3, 4].map((productIndex) => (
                <Box
                  key={productIndex}
                  bg="white"
                  borderRadius="2xl"
                  p={4}
                  boxShadow="md"
                >
                  <Skeleton height="200px" borderRadius="lg" mb={4} />
                  <SkeletonText noOfLines={2} spacing={2} mb={2} />
                  <Skeleton height="20px" width="60px" />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box pt={4} px={4} position="relative">
      <CategorySelector categoryRefs={categoryRefs} />

      {grouped.map((cat) => (
        <Box
          key={cat.id}
          mb={10}
          ref={(el) => {
            // Crear un ID basado en el nombre de la categoría para el scroll
            const categoryId = cat.name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
            categoryRefs.current[categoryId] = el;
          }}
        >
          <Center mb={6} mt={8}>
            <Heading
              size="lg"
              color="brand.700"
              textAlign="center"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "3px",
                background: "linear-gradient(90deg, #DEA757, #C99247)",
                borderRadius: "2px",
              }}
              fontWeight="700"
              letterSpacing="wide"
              textTransform="uppercase"
              fontSize={{ base: "xl", md: "2xl" }}
              mt={3}
              mb={3}
            >
              {cat.name}
            </Heading>
          </Center>
          {cat.products.length > 0 ? (
            <ProductGrid products={cat.products} />
          ) : (
            <Center
              py={12}
              px={6}
              bg="gray.50"
              borderRadius="xl"
              border="2px dashed"
              borderColor="gray.200"
            >
              <VStack spacing={3}>
                <Text fontSize="lg" color="gray.600" textAlign="center">
                  No hay productos en esta categoría
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Los productos aparecerán aquí cuando sean agregados
                </Text>
              </VStack>
            </Center>
          )}
        </Box>
      ))}

      {/* Botón flotante para subir arriba */}
      <IconButton
        aria-label="Subir arriba"
        icon={<MdArrowUpward />}
        size="lg"
        bg="brand.300"
        color="white"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        zIndex={1000}
        boxShadow="lg"
        _hover={{
          bg: "brand.400",
          transform: "translateY(-2px)",
          boxShadow: "xl",
        }}
        _active={{
          bg: "brand.400",
        }}
        transition="all 0.2s"
        onClick={scrollToTop}
      />
    </Box>
  );
}

export default Products;
