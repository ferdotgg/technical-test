"use client";

import { ProductList } from "./components/ProductList";
import { NewProductForm } from "./components/NewProductForm";
import { WebSocketManager } from "./components/WebSocketManager";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Package, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconColor: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const { products } = useSelector((state: RootState) => state.products);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, product) => sum + product.price, 0) /
          totalProducts
        : 0;
    const totalValue = products.reduce(
      (sum, product) => sum + product.price * (product.stock || 1),
      0
    );

    const statsCards: StatCard[] = [
      {
        id: "total-products",
        title: "Total Products",
        value: totalProducts,
        description: "Products in catalog",
        icon: Package,
        gradient: "from-blue-500 to-blue-600",
        iconColor: "opacity-80",
      },
      {
        id: "average-price",
        title: "Average Price",
        value: `${averagePrice.toFixed(2)}`,
        description: "Average product price",
        icon: TrendingUp,
        gradient: "from-emerald-500 to-emerald-600",
        iconColor: "opacity-80",
      },
      {
        id: "total-value",
        title: "Total Value",
        value: `${totalValue.toLocaleString()}`,
        description: "Inventory value",
        icon: DollarSign,
        gradient: "from-purple-500 to-purple-600",
        iconColor: "opacity-80",
      },
    ];

    return statsCards;
  }, [products]);

  const StatCard = ({ stat }: { stat: StatCard }) => {
    const IconComponent = stat.icon;

    return (
      <Card
        className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            {stat.title}
          </CardTitle>
          <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stat.value}</div>
          <p className="text-xs opacity-80 mt-1">{stat.description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container py-8 mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Products Dashboard
              </h1>
              {user && (
                <p className="text-lg text-gray-600">
                  Welcome back,{" "}
                  <span className="font-semibold text-blue-600">
                    {user.firstName} {user.lastName}
                  </span>
                </p>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Live Dashboard
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <WebSocketManager />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <NewProductForm />
            </div>
          </div>

          <div className="xl:col-span-3">
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}
