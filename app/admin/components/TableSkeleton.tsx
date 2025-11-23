import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function TableSkeleton() {
  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-border">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-secondary" style={{ width: 150 }}>
              <div className="whitespace-nowrap">ID</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 120 }}>
              <div className="whitespace-nowrap">Image</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ minWidth: 220 }}>
              <div className="whitespace-nowrap">Title</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 150 }}>
              <div className="whitespace-nowrap">Price</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 220 }}>
              <div className="whitespace-nowrap">Sale Price</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 180 }}>
              <div className="whitespace-nowrap">Stock</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 180 }}>
              <div className="whitespace-nowrap">Orders</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 150 }}>
              <div className="whitespace-nowrap">Status</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 200 }}>
              <div className="whitespace-nowrap">Created At</div>
            </TableHead>
            <TableHead className="bg-secondary" style={{ width: 200 }}>
              <div className="whitespace-nowrap">Updated At</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="border"><Skeleton className="h-4 w-6" /></TableCell>
              <TableCell className="border"><Skeleton className="h-8 w-8 rounded" /></TableCell>
              <TableCell className="border"><Skeleton className="h-4 w-[200px]" /></TableCell>
              <TableCell className="border"><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell className="border"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="border"><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell className="border"><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell className="border"><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell className="border">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>
              <TableCell className="border">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

