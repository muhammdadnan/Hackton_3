"use client";
import React, { useEffect, useState } from "react";
import useBasketStore from "../store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AddToBasketButton from "@/components/AddToBasketButton";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Loader from "@/components/Loader";
import {
  createCheckoutSession,
  Metadata,
} from "@/action/createCheckoutSession";

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // wait for client to mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-lg">Start adding items to your cart!</p>
        </div>
      </>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(), // example: ab3lks-aslks-k5sljs-lksj0f
        customerName: user?.fullName ?? "Unknown User",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown Email",
        clerkUserId: user!.id,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Basket</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedItems?.map((item) => (
          <div
            key={item.product._id}
            className="border rounded-lg flex flex-col p-4 shadow-md transition-transform duration-300 hover:shadow-lg bg-gray-50"
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                router.push(`/product/${item.product.slug?.current}`)
              }
            >
              <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden mr-4">
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image).url()}
                    alt={item.product.name ?? "Product Image"}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain rounded"
                  />
                )}
              </div>

              <div className="flex-grow relative">
                <h2 className="text-xl font-semibold text-gray-800 absolute bottom-[-70]">
                  {item.product.name}
                </h2>
                <p className="absolute top-24 text-gray-800 font-bold">
                  Price: $
                  {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center ml-4 flex-shrink-0">
              <AddToBasketButton product={item.product} disable={false} />
            </div>
          </div>
        ))}

        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total: </span>
              <span>
                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-600"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Sign in to CheckOut
              </button>
            </SignInButton>
          )}
        </div>

        <div className="h-64 lg:h-0">
          {/* Spacer for fixed checkout on mobile */}
        </div>
      </div>
    </div>
  );
}

export default BasketPage;
