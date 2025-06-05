"use client";

import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebSocketMessage } from "@/types/websocket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wifi,
  WifiOff,
  Activity,
  CheckCircle2,
  Zap,
  Globe,
  MessageSquare,
  Copy,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const WebSocketManager = () => {
  const { isConnected, lastMessage } = useWebSocket();
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState<WebSocketMessage | null>(null);
  const [formattedMessage, setFormattedMessage] = useState<string>("");
  const [messageCount, setMessageCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      console.log("WebSocketManager received message:", lastMessage);
      setMessageCount((prev) => prev + 1);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.event === "new_product" &&
      lastMessage.product
    ) {
      setFormattedMessage(JSON.stringify(lastMessage, null, 2));
      setMessage(lastMessage);
      setShowDialog(true);
    }
  }, [lastMessage]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Card
          className={`transition-all duration-500 border-0 shadow-lg ${
            isConnected
              ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200"
              : "bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-amber-200"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`relative p-3 rounded-xl ${
                    isConnected
                      ? "bg-emerald-500 shadow-emerald-200"
                      : "bg-amber-500 shadow-amber-200"
                  } shadow-lg`}
                >
                  {isConnected ? (
                    <Wifi className="w-6 h-6 text-white" />
                  ) : (
                    <WifiOff className="w-6 h-6 text-white" />
                  )}
                  {isConnected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      WebSocket Connection
                    </h3>
                    <Badge
                      variant={isConnected ? "default" : "secondary"}
                      className={`px-3 py-1 ${
                        isConnected
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      {isConnected ? "Live" : "Connecting..."}
                    </Badge>
                  </div>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      isConnected ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {isConnected
                      ? "Real-time communication active with echo.websocket.org"
                      : "Attempting to establish connection..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{messageCount}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Messages</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Status</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader className="space-y-3 pr-8">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent break-words">
                  Product Added Successfully!
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1 break-words">
                  Your new product has been broadcast via WebSocket and
                  synchronized across all tabs
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {message?.product && (
            <div className="space-y-6 px-1">
              <Card className="bg-gradient-to-br from-white to-green-50/30 border border-green-100 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl text-gray-900">
                      Product Details
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      New Product
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                      {message.product.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed break-words">
                      {message.product.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Price
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">
                          ${message.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          Category
                        </p>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {message.product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500 font-medium">ID</p>
                      <p className="font-mono text-lg text-gray-700 break-all">
                        {message.product.id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-green-200 bg-green-50/50">
                <Sparkles className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">
                  Synchronized Successfully
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  This product has been added to your catalog and is now visible
                  across all open browser tabs.
                </AlertDescription>
              </Alert>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span>WebSocket Message</span>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-60 font-mono text-sm">
                    <pre className="whitespace-pre-wrap break-all overflow-wrap-anywhere">
                      {formattedMessage}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Zap className="w-4 h-4" />
              <span>Delivered in real-time</span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
