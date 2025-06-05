import { Product, ProductsResponse } from "@/types/product";

const API_URL = "https://dummyjson.com";

export async function fetchProducts(token: string): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export function validateNewProduct(product: Partial<Product>): boolean {
  if (!product.title || !product.description || !product.price) {
    return false;
  }

  if (typeof product.price !== "number" || product.price <= 0) {
    return false;
  }

  return true;
}
