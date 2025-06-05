"use client";

import { useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newProductSchema, NewProductFormValues } from "@/schemas/product";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Send, Loader2, CheckCircle } from "lucide-react";

const CATEGORIES = [
  {
    id: 1,
    name: "beauty",
    label: "Beauty",
    icon: "✨",
    color: "from-pink-400 to-rose-400",
  },
  {
    id: 2,
    name: "fragrances",
    label: "Fragrances",
    icon: "🌸",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 3,
    name: "furniture",
    label: "Furniture",
    icon: "🪑",
    color: "from-amber-400 to-orange-400",
  },
  {
    id: 4,
    name: "groceries",
    label: "Groceries",
    icon: "🛒",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 5,
    name: "electronics",
    label: "Electronics",
    icon: "📱",
    color: "from-blue-400 to-indigo-400",
  },
  {
    id: 6,
    name: "clothing",
    label: "Clothing",
    icon: "👕",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 7,
    name: "home-decoration",
    label: "Home Decoration",
    icon: "🏠",
    color: "from-teal-400 to-cyan-400",
  },
  {
    id: 8,
    name: "skincare",
    label: "Skincare",
    icon: "🧴",
    color: "from-rose-400 to-pink-400",
  },
  {
    id: 9,
    name: "automotive",
    label: "Automotive",
    icon: "🚗",
    color: "from-gray-400 to-slate-400",
  },
  {
    id: 10,
    name: "sports",
    label: "Sports",
    icon: "⚽",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 11,
    name: "books",
    label: "Books",
    icon: "📚",
    color: "from-yellow-400 to-amber-400",
  },
  {
    id: 12,
    name: "toys",
    label: "Toys",
    icon: "🧸",
    color: "from-pink-400 to-purple-400",
  },
  {
    id: 13,
    name: "pet-supplies",
    label: "Pet Supplies",
    icon: "🐾",
    color: "from-emerald-400 to-teal-400",
  },
  {
    id: 14,
    name: "jewelry",
    label: "Jewelry",
    icon: "💎",
    color: "from-yellow-400 to-gold-400",
  },
  {
    id: 15,
    name: "shoes",
    label: "Shoes",
    icon: "👟",
    color: "from-slate-400 to-gray-400",
  },
];

export const NewProductForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { sendNewProduct } = useWebSocket();

  const form = useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "beauty",
    },
  });

  const onSubmit = async (values: NewProductFormValues) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const newProduct: Product = {
        id: Date.now(),
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category || "other",
        rating: Math.floor(Math.random() * 5) + 1,
        stock: Math.floor(Math.random() * 100) + 1,
        discountPercentage: Math.floor(Math.random() * 20),
        thumbnail: "https://placehold.co/300x200.png",
        images: ["https://placehold.co/300x200.png"],
      };

      sendNewProduct(newProduct);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      form.reset({
        title: "",
        description: "",
        price: undefined,
        category: "beauty",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to send product. Please try again.");
      console.error("Error sending product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Add New Product
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Create and broadcast a new product
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50/50"
              >
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50/50 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Product created successfully! 🎉
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Product Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name..."
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/70 transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your amazing product..."
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/70 min-h-[80px] transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Price (USD)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium z-10">
                        $
                      </span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 pr-3 py-2 w-full rounded-md border border-gray-200 bg-white/70 text-sm transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : parseFloat(value)
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/70 transition-all duration-200">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {CATEGORIES.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.name}
                          className="flex items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Product...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Create Product</span>
              <Sparkles className="w-4 h-4" />
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
