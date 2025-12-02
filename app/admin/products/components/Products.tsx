"use client"
import { useProducts } from '@/lib/firestore/products/read';
import React, { Suspense } from 'react'
import ProductsTable from './ProductsTable';
import { Skeleton } from '@/components/ui/skeleton';

export default function Products() {
  // Fetch all products - no pagination needed since ProductsTable has built-in pagination
  const {
    data: products,
    error,
    isLoading,
  } = useProducts({
    pageLimit: undefined, // undefined means fetch all products
    lastSnapDoc: null,
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
     
        <ProductsTable data={products || []} isLoading={isLoading}/>
    
    </>
  )
}
