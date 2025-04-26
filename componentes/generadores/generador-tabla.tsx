"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/componentes/ui/dropdown-menu";
import { Card, CardContent } from "@/componentes/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/componentes/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterableColumns?: string[];
  onSelectedRowsChange?: (selectedRows: T[]) => void;
}

const createSelectColumn = <T,>() => {
  const columnHelper = createColumnHelper<T>();
  return columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
  });
};

export function GeneradorTabla<T>({
  data,
  columns,
  filterableColumns = [],
  onSelectedRowsChange,
}: CustomTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [selectedFilterColumn, setSelectedFilterColumn] = React.useState<
    string | null
  >(filterableColumns.length > 0 ? filterableColumns[0] : null);

  const isMobile = useIsMobile();

  const table = useReactTable({
    data,
    columns: onSelectedRowsChange
      ? [createSelectColumn<T>(), ...columns]
      : columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    if (onSelectedRowsChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectedRowsChange(selectedRows);
    }
  }, [rowSelection, onSelectedRowsChange, table]);

  const filterColumn = selectedFilterColumn
    ? table.getColumn(selectedFilterColumn)
    : null;
  let filterAlias = selectedFilterColumn;

  if (
    filterColumn?.columnDef.header &&
    typeof filterColumn.columnDef.header === "string"
  ) {
    filterAlias = filterColumn.columnDef.header;
  }

  return (
    <Card>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-center py-4 gap-2">
            {filterableColumns.length > 0 && (
              <div
                className={`flex ${
                  isMobile ? "flex-col" : "flex-row"
                } gap-2 w-full`}
              >
                {/* Menú desplegable para seleccionar la columna */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={isMobile ? "w-full" : "w-auto"}
                    >
                      {filterAlias || "Seleccionar columna"}{" "}
                      <ChevronDown className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {filterableColumns.map((columnKey) => {
                      const column = table.getColumn(columnKey);
                      let columnLabel = columnKey;
                      if (
                        column?.columnDef.header &&
                        typeof column.columnDef.header === "string"
                      ) {
                        columnLabel = column.columnDef.header;
                      }
                      return (
                        <DropdownMenuCheckboxItem
                          key={columnKey}
                          checked={selectedFilterColumn === columnKey}
                          onCheckedChange={() =>
                            setSelectedFilterColumn(columnKey)
                          }
                        >
                          {columnLabel}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Campo de entrada para filtrar */}
                <Input
                  placeholder={`Filtrar por ${filterAlias}...`}
                  value={
                    selectedFilterColumn
                      ? (table
                          .getColumn(selectedFilterColumn)
                          ?.getFilterValue() as string) ?? ""
                      : ""
                  }
                  onChange={(e) =>
                    selectedFilterColumn &&
                    table
                      .getColumn(selectedFilterColumn)
                      ?.setFilterValue(e.target.value)
                  }
                  className={isMobile ? "w-full" : "max-w-sm"}
                />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columnas <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    let columnLabel = column.id;
                    if (typeof column.columnDef.header === "string") {
                      columnLabel = column.columnDef.header;
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnLabel}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isMobile ? (
            <div className="space-y-2">
              {table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id} className="flex flex-col">
                        <div className="font-medium text-neutral-500 truncate">
                          {typeof cell.column.columnDef.header === "string"
                            ? cell.column.columnDef.header
                            : cell.column.id}
                        </div>
                        <div className="truncate">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table className="min-w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={
                          row.getIsSelected() ? "selected" : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No hay resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold">
                {table.getFilteredRowModel().rows.length} registro(s)
                encontrados.
              </span>{" "}
              Página {pagination.pageIndex + 1} de {table.getPageCount()}.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
