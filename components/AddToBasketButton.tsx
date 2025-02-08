"use client";
import useBasketStore from "@/app/(store)/store";
import { ProductType } from "@/sanity.types";
import React, { useEffect, useState } from "react";

interface AddToBasketButtonProps {
  product: ProductType;
  disable: boolean;
}

function AddToBasketButton({ product, disable }: AddToBasketButtonProps) {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);
  const [isClient, setIsClient] = useState(false);
  // Use useEffect to set isClient to true after the component mounts.
  // This ensures that component only renders on the client-side.
  // prevent hydration error due to server/client mismatch.
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => removeItem(product._id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          itemCount === 0
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        disabled={itemCount === 0 || disable}
      >
        <span
          className={`text-xl font-bold ${itemCount === 0 ? "text-gray-400" : "text-gray-600"}`}
        >
          -
        </span>
      </button>
      <span className="w-8 text-center font-semibold">{itemCount}</span>
      <button
        onClick={() => addItem(product)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          disable
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-500 hover:bg-gray-300"
        }`}
        disabled={disable}
      >
        <span className="text-xl font-bold text-white">+</span>
      </button>
    </div>
  );
}

export default AddToBasketButton;
