"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  ColumnOrderState,
  useReactTable,
  Table as TanStackTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Header Component
function SortableHeader({
  header,
  children,
}: {
  header: any;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const canSort = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div
        className="flex items-center gap-1 flex-1"
        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
      >
        {children}
        {canSort && (
          <span className="ml-1">
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// Filter Component
function Filter({ column, table }: { column: any; table: TanStackTable<any> }) {
  const columnFilterValue = column.getFilterValue();
  const columnType = column.columnDef.meta?.type || "text";

  if (columnType === "number") {
    const filterValue = columnFilterValue as [number, number] | undefined;
    return (
      <div className="flex gap-1">
        <Input
          type="number"
          value={filterValue?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              e.target.value ? Number(e.target.value) : undefined,
              old?.[1],
            ])
          }
          placeholder="Min"
          className="h-7 w-20 bg-background dark:bg-background"
        />
        <Input
          type="number"
          value={filterValue?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number] | undefined) => [
              old?.[0],
              e.target.value ? Number(e.target.value) : undefined,
            ])
          }
          placeholder="Max"
          className="h-7 w-20 bg-background dark:bg-background"
        />
      </div>
    );
  }

  if (columnType === "date") {
    return (
      <Input
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="Filter..."
        className="h-7 bg-background dark:bg-background"
      />
    );
  }

  return (
    <Input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Filter..."
      className="h-7 bg-background dark:bg-background"
    />
  );
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  initialColumnOrder?: string[];
  initialPageSize?: number;
  enableColumnDnd?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  customFilterFns?: Record<string, any>;
  onRowClick?: (row: TData) => void;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  initialColumnOrder,
  initialPageSize = 10,
  enableColumnDnd = true,
  enableFiltering = true,
  enableSorting = true,
  enablePagination = true,
  customFilterFns,
  onRowClick,
  className = "",
  loadingComponent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    initialColumnOrder ||
      columns.map((col) => (col as any).id || "").filter(Boolean)
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnOrderChange: enableColumnDnd ? setColumnOrder : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnOrder: enableColumnDnd ? columnOrder : undefined,
      pagination: enablePagination ? pagination : undefined,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    filterFns: {
      inNumberRange: (
        row: any,
        columnId: string,
        filterValue: [number, number]
      ) => {
        const value = row.getValue(columnId) as number;
        const [min, max] = filterValue;
        if (min !== undefined && max !== undefined) {
          return value >= min && value <= max;
        }
        if (min !== undefined) {
          return value >= min;
        }
        if (max !== undefined) {
          return value <= max;
        }
        return true;
      },
      ...customFilterFns,
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (!enableColumnDnd) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (isLoading) {
    return loadingComponent || <div>Loading...</div>;
  }

  const tableContent = (
    <div className="overflow-x-auto">
      <Table className="border border-black dark:border-border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {enableColumnDnd ? (
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers
                    .sort((a, b) => {
                      const aIndex = columnOrder.indexOf(a.id);
                      const bIndex = columnOrder.indexOf(b.id);
                      if (aIndex === -1) return 1;
                      if (bIndex === -1) return -1;
                      return aIndex - bIndex;
                    })
                    .map((header) => (
                      <TableHead
                        key={header.id}
                        className="bg-secondary"
                        style={{
                          width:
                            header.id === "title"
                              ? undefined
                              : header.getSize(),
                          minWidth:
                            header.id === "title"
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        <div
                          className={`${
                            header.id === "actions"
                              ? "flex justify-center items-center"
                              : ""
                          } whitespace-nowrap flex flex-col gap-1`}
                        >
                          <SortableHeader header={header}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </SortableHeader>
                          {enableFiltering && header.column.getCanFilter() && (
                            <Filter column={header.column} table={table} />
                          )}
                        </div>
                      </TableHead>
                    ))}
                </SortableContext>
              ) : (
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-secondary"
                    style={{
                      width:
                        header.id === "title" ? undefined : header.getSize(),
                      minWidth:
                        header.id === "title" ? header.getSize() : undefined,
                    }}
                  >
                    <div
                      className={`${
                        header.id === "actions"
                          ? "flex justify-center items-center"
                          : ""
                      } whitespace-nowrap flex flex-col gap-1`}
                    >
                      <div
                        className="flex items-center gap-1"
                        onClick={
                          enableSorting && header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </span>
                        )}
                      </div>
                      {enableFiltering && header.column.getCanFilter() && (
                        <Filter column={header.column} table={table} />
                      )}
                    </div>
                  </TableHead>
                ))
              )}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={`${
                onRowClick ? "cursor-pointer" : ""
              } hover:bg-border/25 dark:hover:bg-ring/40`}
              onClick={() => onRowClick?.(row.original)}
            >
              {row
                .getVisibleCells()
                .sort((a, b) => {
                  if (!enableColumnDnd) return 0;
                  const aIndex = columnOrder.indexOf(a.column.id);
                  const bIndex = columnOrder.indexOf(b.column.id);
                  if (aIndex === -1) return 1;
                  if (bIndex === -1) return -1;
                  return aIndex - bIndex;
                })
                .map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border border-black dark:border-border"
                    style={{
                      width:
                        cell.column.id === "title"
                          ? undefined
                          : cell.column.getSize(),
                      minWidth:
                        cell.column.id === "title"
                          ? cell.column.getSize()
                          : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div
      className={`mt-6 rounded-lg overflow-hidden border border-black dark:border-border ${className}`}
    >
      {enableColumnDnd ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {tableContent}
        </DndContext>
      ) : (
        tableContent
      )}

      {enablePagination && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2 md:px-4 py-3 border-t border-black dark:border-border">
          {/* Page info - hidden on mobile, shown on tablet+ */}
          <div className="flex items-center gap-2 order-3 md:order-1">
            <p className="text-xs md:text-sm text-muted-foreground ">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground ">
              ({table.getFilteredRowModel().rows.length} total rows)
            </p>
            {/* Go to page - hidden on mobile/tablet, shown on desktop */}
            <span className="hidden lg:flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Go to page:</span>
              <Input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="w-16 h-7"
              />
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1 md:gap-2 order-1 md:order-2">
            {/* First Page - hidden on mobile/tablet */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              
            >
              <ChevronsLeft className="h-4 w-4" />
              
              <span className="hidden xl:inline">First</span>
            </Button>
            
            {/* Previous - icon only on mobile/tablet, text + icon on desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 aspect-square lg:p-0 lg:aspect-auto lg:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden lg:inline ml-1">Previous</span>
            </Button>
            
            {/* Next - icon only on mobile/tablet, text + icon on desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 aspect-square lg:p-0 lg:aspect-auto lg:px-3"
            >
              <span className="hidden lg:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Last Page - hidden on mobile/tablet */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            
            >
              <span className="hidden xl:inline">Last</span>
              <ChevronsRight  className="h-4 w-4" />
              
            </Button>
          </div>

          {/* Rows per page - hidden on mobile, shown on tablet+ */}
          <div className="flex items-center gap-2 order-2 md:order-3">
            <span className="text-xs md:text-sm text-muted-foreground hidden md:inline">
              Rows per page:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-7 md:h-8 rounded-md border border-input bg-background px-2 text-xs md:text-sm"
            >
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
