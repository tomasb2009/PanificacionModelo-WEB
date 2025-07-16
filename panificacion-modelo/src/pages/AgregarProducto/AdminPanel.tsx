import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiImage } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../contexts/AuthContext";

// Tipos para producto y formulario
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  user_id: string;
  created_at: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string | null;
  image_url: string;
  category_id: string;
}

// Utilidad para obtener la lista de productos
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
};

export default function AdminPanel() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    imageFile: null,
    imagePreview: null,
    image_url: "",
    category_id: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Query para obtener productos
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Query para obtener categorías
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Categories")
        .select("*")
        .order("name");
      if (error) throw new Error(error.message);
      return (data ?? []) as Category[];
    },
  });

  // Agrupar productos por categoría
  const groupedProducts = useMemo(() => {
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
          category,
          products: categoryProducts,
        };
      })
      .filter(Boolean); // Eliminar categorías que no existen
  }, [categories, products]);

  // Mutación para agregar/editar producto
  const mutation = useMutation<unknown, Error, ProductForm & { id?: string }>({
    mutationFn: async (values: ProductForm & { id?: string }) => {
      let imageUrl = values.image_url;
      // Si hay imagen nueva, subirla
      if (values.imageFile) {
        const fileExt = values.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${user?.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, values.imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw new Error(uploadError.message);
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || "";
      }
      if (isEdit && values.id) {
        // Editar producto
        const { error } = await supabase
          .from("Products")
          .update({
            name: values.name,
            description: values.description || null,
            price: parseFloat(values.price),
            image_url: imageUrl,
            category_id: values.category_id,
          })
          .eq("id", values.id);
        if (error) throw new Error(error.message);
      } else {
        // Agregar producto
        const { error } = await supabase.from("Products").insert([
          {
            name: values.name,
            description: values.description || null,
            price: parseFloat(values.price),
            user_id: user?.id,
            image_url: imageUrl,
            category_id: values.category_id,
          },
        ]);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: isEdit ? "Producto editado" : "Producto agregado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setForm({
        name: "",
        description: "",
        price: "",
        imageFile: null,
        imagePreview: null,
        image_url: "",
        category_id: "",
      });
      setIsEdit(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Mutación para eliminar producto
  const deleteMutation = useMutation<unknown, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Producto eliminado",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteOpen(false);
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Handlers
  const handleOpenAdd = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      imageFile: null,
      imagePreview: null,
      image_url: "",
      category_id: "",
    });
    setIsEdit(false);
    setSelectedProduct(null);
    onOpen();
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageFile: null,
      imagePreview: product.image_url || null,
      image_url: product.image_url || "",
      category_id: product.category_id || "",
    });
    setIsEdit(true);
    setSelectedProduct(product);
    onOpen();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.image_url || null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que el precio es un número válido
    if (isNaN(Number(form.price)) || form.price.trim() === "") {
      toast({
        title: "Precio inválido",
        description: "Por favor ingresa un precio válido.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    // Validar que la categoría está seleccionada
    if (!form.category_id) {
      toast({
        title: "Categoría requerida",
        description: "Por favor selecciona una categoría.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    // Si es edición, asegurarse de que hay un id
    if (isEdit) {
      if (selectedProduct?.id) {
        mutation.mutate({ ...form, id: selectedProduct.id });
      } else {
        toast({
          title: "Error interno",
          description: "No se encontró el producto a editar.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      mutation.mutate({ ...form });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // Render
  return (
    <Box maxW="6xl" mx="auto" py={10} px={4}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color="brand.800">
          Panel de Productos
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleOpenAdd}
        >
          Agregar Producto
        </Button>
      </Flex>
      {isLoading ? (
        <Center py={20}>
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box
          overflowX="auto"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Table variant="simple" size="md">
            <Thead bg="gray.50">
              <Tr>
                <Th>Imagen</Th>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th isNumeric>Precio</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.isArray(products) && products.length > 0 ? (
                groupedProducts.map((group) => {
                  if (!group) return null;
                  return (
                    <React.Fragment key={group.category.id}>
                      {/* Encabezado de categoría */}
                      <Tr
                        bg="brand.50"
                        borderBottom="2px solid"
                        borderColor="brand.200"
                      >
                        <Td colSpan={5} py={3}>
                          <Flex align="center" justify="space-between">
                            <Heading
                              size="sm"
                              color="brand.700"
                              fontWeight="bold"
                            >
                              {group.category.name}
                            </Heading>
                            <Box
                              px={3}
                              py={1}
                              bg="brand.100"
                              borderRadius="full"
                              fontSize="sm"
                              color="brand.700"
                              fontWeight="medium"
                            >
                              {group.products.length} producto
                              {group.products.length !== 1 ? "s" : ""}
                            </Box>
                          </Flex>
                        </Td>
                      </Tr>
                      {/* Productos de la categoría */}
                      {group.products.map((product: Product) => (
                        <Tr key={product.id} _hover={{ bg: "blue.50" }}>
                          <Td>
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                boxSize="60px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            ) : (
                              <Box
                                boxSize="60px"
                                bg="gray.100"
                                borderRadius="md"
                              />
                            )}
                          </Td>
                          <Td fontWeight="semibold">{product.name}</Td>
                          <Td maxW="300px" whiteSpace="pre-line">
                            {product.description || (
                              <Text color="gray.400" fontStyle="italic">
                                Sin descripción
                              </Text>
                            )}
                          </Td>
                          <Td isNumeric>${product.price.toFixed(2)}</Td>
                          <Td>
                            <Tooltip label="Editar" hasArrow>
                              <IconButton
                                aria-label="Editar"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="yellow"
                                mr={2}
                                onClick={() => handleOpenEdit(product)}
                              />
                            </Tooltip>
                            <Tooltip label="Eliminar" hasArrow>
                              <IconButton
                                aria-label="Eliminar"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDelete(product.id)}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={10}>
                    No hay productos registrados.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modal para agregar/editar producto */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent maxW={"2xl"}>
          <ModalHeader>
            {isEdit ? "Editar Producto" : "Agregar Producto"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={8}
                align="flex-start"
              >
                {/* Imagen y selector de imagen */}
                <Box flex="1" minW={{ base: "100%", md: "220px" }}>
                  <Center>
                    {form.imagePreview ? (
                      <Image
                        src={form.imagePreview}
                        alt="Vista previa"
                        boxSize={{ base: "220px", md: "220px" }}
                        objectFit="cover"
                        borderRadius="lg"
                        border="1px solid #CBD5E0"
                        bg="gray.50"
                      />
                    ) : (
                      <Box
                        boxSize={{ base: "220px", md: "220px" }}
                        borderRadius="lg"
                        border="1px solid #CBD5E0"
                        bg="gray.50"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.300"
                        fontSize="lg"
                      >
                        <FiImage size={48} />
                      </Box>
                    )}
                  </Center>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <Button
                    as="label"
                    htmlFor="file-upload"
                    mt={4}
                    w="100%"
                    leftIcon={<FiImage />}
                    variant="outline"
                    colorScheme="gray"
                    borderRadius="lg"
                    fontWeight="normal"
                    bg="white"
                    borderColor="#E2E8F0"
                    _hover={{ borderColor: "blue.300", bg: "gray.50" }}
                  >
                    Elegir imagen
                  </Button>
                </Box>
                {/* Campos de texto y select */}
                <VStack spacing={4} flex={2} w="100%">
                  <FormControl isRequired>
                    <FormLabel>Categoría</FormLabel>
                    <select
                      name="category_id"
                      value={form.category_id}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #CBD5E0",
                      }}
                      disabled={isLoadingCategories}
                    >
                      <option value="" disabled>
                        {isLoadingCategories
                          ? "Cargando categorías..."
                          : "Selecciona una categoría"}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nombre del producto"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Descripción del producto (opcional)"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Precio</FormLabel>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </FormControl>
                </VStack>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3} variant="ghost">
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={mutation.isPending}
              >
                {isEdit ? "Guardar Cambios" : "Agregar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Confirmación de eliminación */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Producto
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no
              se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (deleteId) deleteMutation.mutate(deleteId);
                }}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
