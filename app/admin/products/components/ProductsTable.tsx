import { useRouter } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { Timestamp } from "firebase/firestore";
import {
    ColumnDef,
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/firestore/products/write';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { DataTable } from '@/app/admin/components/DataTable';
import TableSkeleton from '@/app/admin/components/TableSkeleton'

export type Product= {
  id: string;
  brandId: string;
  categoryId: string;
  title: string;
  shortDescription: string;
  description: string; // HTML content
  featureImageURL: string;
  imageList: string[];
  price: number;
  salePrice: number;
  stock: number;
  orders?:number;
  isFeatured?:Boolean;
  timestampCreate: Timestamp;
  timestampUpdate?: Timestamp;
}
type Props={
    data:Product[]
    isLoading?: boolean
}

function ActionsCell({ product, router }: { product: Product; router: ReturnType<typeof useRouter> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct({ id: product.id });
      toast.success("Product deleted successfully");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete product");
    }
    setIsDeleting(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/products/form?id=${product.id}`);
  };

  return (
    <div className="flex gap-2 items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <Button
        onClick={handleEdit}
        disabled={isDeleting}
        variant="ghost"
        size="icon"
        isIconOnly
        className="h-8 w-8"
      >
        <Edit2 size={16} />
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            isIconOnly
            className="h-8 w-8"
            disabled={isDeleting}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product{" "}
              <strong>&quot;{product.title}&quot;</strong> from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProductsTable({data, isLoading = false}:Props) {
    const router=useRouter()

    const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorFn: () => null,
        id: 'id',
        header: () => 'ID',
        size: 150,
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => (
          <div className='w-6'>
            {info.row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: 'featureImageURL',
        header: () => <span>Image</span>,
        id: 'featureImageURL',
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="relative w-8 h-8">
              <Image
                src={row.featureImageURL}
                alt={row.title}
                fill
                className="object-cover rounded"
                sizes="64px"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'title',
        header: () => 'Title',
        id: 'title',
        size: 400,
        minSize: 220,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'text' },
        cell: (info) => (
          <div className="whitespace-nowrap" title={info.getValue() as string}>
            {info.getValue() as string}{" "}
            {info.row.original.isFeatured === true && (
              <span className="ml-2 bg-linear-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1">
                Featured
              </span>
            )}
          </div>
        ),
      },
     
      // {
      //   accessorKey:"featureImageURL",
      //   header: () => <span>Image</span>,
      //   id: 'featureImageURL',
      //   size: 120,
      // },
      {
        accessorKey: 'price',
        header: 'Price',
        id: 'price',
        size: 150,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'number' },
        filterFn: 'inNumberRange',
      },
      {
        accessorKey: 'salePrice',
        header: () => 'Sale Price',
        id: 'salePrice',
        size: 220,
        minSize: 220,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'number' },
        filterFn: 'inNumberRange',
        cell: info => (
          <div>{info.getValue() as number}</div>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        id: 'stock',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'number' },
        filterFn: 'inNumberRange',
      },
      {
        accessorKey: 'orders',
        header: 'Orders',
        id: 'orders',
        size: 180,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'number' },
        filterFn: 'inNumberRange',
         cell: info => (
          <div>{(info.getValue() ?? 0) as number}</div>
        ),
      },

       {
        accessorFn: () => null,
        header: () => <span>Status</span>,
        id: 'sh',
        size: 150,
        enableSorting: false,
        enableColumnFilter: false,
        cell: info => {
          const row=info.row.original
          return(
            <div className="flex">
          {row.stock - (row?.orders ?? 0) > 0 && (
            <div className="px-2 py-1 text-xs text-green-500 bg-green-100 font-bold rounded-md">
              Available
            </div>
          )}
          {row?.stock - (row?.orders ?? 0) <= 0 && (
            <div className="px-2 py-1 text-xs text-red-500 bg-red-100 rounded-md">
              Out Of Stock
            </div>
          )}
        </div>
        )
      }
      },
      {
        accessorKey: 'timestampCreate',
        header: 'Created At',
        id: 'timestampCreate',
        size: 200,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'date' },
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
          const a = rowA.getValue(columnId) as Timestamp;
          const b = rowB.getValue(columnId) as Timestamp;
          if (!a || !b) return 0;
          return a.toMillis() - b.toMillis();
        },
        cell: (info) => {
          const timestamp = info.getValue() as Timestamp;
          if (!timestamp) return <div>-</div>;
          const date = timestamp.toDate();
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          return (
            <div className="text-sm whitespace-nowrap">
              {formattedDate} <span className='text-muted-foreground'>{formattedTime}</span>
            </div>
          );
        },
      },

      {
        accessorKey: 'timestampUpdate',
        header: 'Updated At',
        id: 'timestampUpdate',
        size: 200,
        enableSorting: true,
        enableColumnFilter: true,
        meta: { type: 'date' },
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
          const a = rowA.getValue(columnId) as Timestamp | undefined;
          const b = rowB.getValue(columnId) as Timestamp | undefined;
          if (!a || !b) return 0;
          return a.toMillis() - b.toMillis();
        },
        cell: (info) => {
          const timestamp = info.getValue() as Timestamp | undefined;
          if (!timestamp) return <div>-</div>;
          const date = timestamp.toDate();
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          return (
            <div className="text-sm whitespace-nowrap">
              {formattedDate} <span className='text-muted-foreground'>{formattedTime}</span>
            </div>
          );
        },
      },
       {
        accessorFn: () => null,
        header: () => 'Actions',
        id: 'actions',
        size: 150,
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => <ActionsCell product={info.row.original} router={router} />,
      },
    ],
    [router]
  )

 
  return (
    <Suspense fallback={<TableSkeleton/>}>

    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      initialColumnOrder={['id', 'featureImageURL', 'title', 'price', 'salePrice', 'stock', 'orders', 'sh', 'timestampCreate', 'timestampUpdate', 'actions']}
      initialPageSize={10}
      enableColumnDnd={true}
      enableFiltering={true}
      enableSorting={true}
      enablePagination={true}
      loadingComponent={<TableSkeleton />}
      />
      </Suspense>
  )
}
