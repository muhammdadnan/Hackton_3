"use client";
import React, { useEffect, useState } from "react";
import useBasketStore from "../store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AddToBasketButton from "@/components/AddToBasketButton";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Loader from "@/components/Loader";
import { createCheckoutSession, Metadata } from "@/action/createCheckoutSession";


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
        <div className="container p-4 mx-auto flex flex-col item-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Basket</h1>
          <p className="text-gray-600 text-lg">Your basket is empty.</p>
        </div>
      </>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    try{
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
    <div className="container p-4 mx-auto sm:w-full ">
      <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
      <div className="flex flex-col gap-8 ">
        <div className="flex-grow">
          {groupedItems?.map((item) => (
            <div
              key={item.product._id}
              className="w-full mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-2-0 "
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
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

                <div className="w-[200] md:w-[450] md:bg-gray-500 lg:bg-green-500 lg:w-[700] min-w-0 xl:bg-blue-500 xl:w-[950] 2xl:bg-red-500 2xl:w-[1200] flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {item.product.name}
                  </h2>
                  <p>
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
        </div>
        <div className="w-full lg:w-80  h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
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
          ):(
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
