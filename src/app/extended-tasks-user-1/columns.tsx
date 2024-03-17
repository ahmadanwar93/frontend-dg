"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"


// This type is used to define the shape of our data.
export type Payment = {
    id: string
    title: string,
    category: "Electronics" | "Clothing" | "Home Appliances" | "Books" | "Toys" | "Furniture" | "Sports Equipment" | "Beauty Products" | "Food and Beverages" |  "Stationery"
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
    },
    {
        accessorKey: "action",
        header: "Action",
    }
]
