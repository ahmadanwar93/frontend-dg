"use client"

import { ColumnDef } from "@tanstack/react-table"

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
        header: "Category",
        enableSorting: false
    },
    {
        accessorKey: "action",
        header: "Action",
    }
]
