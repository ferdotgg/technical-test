"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "@/store/slices/productSlice";
import { RootState, AppDispatch } from "@/store";
import { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, Eye } from "lucide-react";

export const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProducts(token));
    }
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <p className="text-gray-600 font-medium">Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-xl border border-red-200 shadow-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">!</span>
          </div>
          <h3 className="font-semibold">Oops! Something went wrong</h3>
        </div>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{products.length} products</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>Updated now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product: Product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative h-48 w-full overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-700 backdrop-blur-sm"
          >
            {product.category}
          </Badge>
          {product.discountPercentage && product.discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="bg-red-500 text-white animate-pulse"
            >
              -{product.discountPercentage}%
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.title}
          </CardTitle>
          {product.rating && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-gray-600">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <div className="text-sm text-gray-500 line-through">
                $
                {(
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <span>Stock:</span>
          <Badge
            variant={
              product.stock && product.stock > 10 ? "default" : "destructive"
            }
            className="text-xs"
          >
            {product.stock || 0}
          </Badge>
        </div>
        {product.brand && (
          <div className="font-medium text-gray-700">{product.brand}</div>
        )}
      </CardFooter>
    </Card>
  );
};
