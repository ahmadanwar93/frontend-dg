"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const deleteProduct = async function (id) {
        try {
            let api = `http://127.0.0.1:8000/api/delete-inventory/${id}`;
            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            location.reload();
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };

    const [productTitle, setProductTitle] = useState('');
    const [productCategory, setProductCategory] = useState('');

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        {index === columns.length - 1 && (
                                            <>
                                                {/* <Button variant="outline" className="mr-4">Update</Button> */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="mr-4">Edit</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Edit</DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to the product here. Click save when you're done.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <form onSubmit={(event) => console.log('abc')}>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="category" className="text-right">
                                                                        Title
                                                                    </Label>
                                                                    <Input
                                                                        id="category"
                                                                        defaultValue={row.original.title}
                                                                        className="col-span-3"
                                                                        onChange={e => { setProductTitle(e.currentTarget.value); }}
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="category" className="text-right">
                                                                        Category
                                                                    </Label>
                                                                    <Select>
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue placeholder={row.original.category} />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Electronics">Electronics</SelectItem>
                                                                            <SelectItem value="Clothing">Clothing</SelectItem>
                                                                            <SelectItem value="Home Applicances">Home Applicances</SelectItem>
                                                                            <SelectItem value="Books">Books</SelectItem>
                                                                            <SelectItem value="Toys">Toys</SelectItem>
                                                                            <SelectItem value="Furniture">Furniture</SelectItem>
                                                                            <SelectItem value="Sports Equipments">Sports Equipments</SelectItem>
                                                                            <SelectItem value="Beauty Products">Beauty Products</SelectItem>
                                                                            <SelectItem value="Stationery">Stationery</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button type="submit">Save changes</Button>
                                                            </DialogFooter>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="destructive" onClick={() => {
                                                    deleteProduct(row.original.id);
                                                }}>Delete</Button>
                                            </>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
