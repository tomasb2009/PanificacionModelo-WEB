import { Grid } from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description?: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
      gap={6}
      justifyItems="center"
    >
      {products.map((p) => (
        <ProductCard 
          key={p.id} 
          name={p.name} 
          image={p.image_url} 
          price={p.price} 
          description={p.description}
        />
      ))}
    </Grid>
  );
}
