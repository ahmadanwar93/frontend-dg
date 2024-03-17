"use client"
import * as React from "react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel
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
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Permissions from "@/components/settingsDialogue/SettingsDialogue"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [userName, setUserName] = useState('')
    const [permissionData, setPermissionData] = useState([])
    
    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_API}/api/1/permissions`, { cache: 'no-store' }
                );
                const data = await res.json();
                setUserName(data.data.name)
                setPermissionData(data.data.permissions);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [BACKEND_API]);

    type Permission = {
        id: number;
        name: string;
    };

    function checkPermissionById(id:number) {
        let found = false;
        permissionData.forEach((obj:Permission) => {
            if (obj.hasOwnProperty('id') && obj.id === id) {
                found = true;
            }
        });
        return found;
    }
    let isProductViewable = checkPermissionById(1);
    let isProductCreatable = checkPermissionById(2);
    let isProductEditable = checkPermissionById(3);
    let isProductDeletable = checkPermissionById(4);


    if (!isProductViewable) {
        // If user does not have permission id 1 (view product listing, then will see empty table)
        data = [];
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        },
    })

    const deleteProduct = async function (id: number) {
        try {
            let api = `${BACKEND_API}/api/1/delete-inventory/${id}`;
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
    const [isupdateFormOpen, setUpdateFormOpen] = useState(false);
    const [isCreateFormOpen, setCreateFormOpen] = useState(false);
    const [updateFormData, setupdateFormData] = useState({});
    const [createFormData, setCreateFormData] = useState({});

    return (
        <div className="rounded-md border">
            <div className="flex items-center py-4 mx-3">
                <Input
                    placeholder="Filter category..."
                    value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("category")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm mr-3"
                />
                <Dialog open={isCreateFormOpen} onOpenChange={setCreateFormOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mr-4" disabled={!isProductCreatable}>Add a  product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                            <DialogDescription>
                                Add new product. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    defaultValue={""}
                                    className="col-span-3"
                                    onChange={e =>
                                        setCreateFormData(
                                            {
                                                ...createFormData,
                                                "title": e.currentTarget.value
                                            })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Category
                                </Label>
                                <Select onValueChange={(value) => setCreateFormData(
                                    {
                                        ...createFormData, "category": value
                                    })}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={"Select a category"} />
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
                            <Button type="submit" onClick={async () => {
                                await fetch(`${BACKEND_API}/api/1/add-inventory`, {
                                    method: "POST",
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(createFormData),
                                })
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error("Network response was not ok");
                                        }
                                        setCreateFormOpen(false);
                                        setCreateFormData({});
                                        location.reload();
                                        return response.json();
                                    })
                            }}>Save product</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Permissions currentUser="1" permissions = {permissionData} userName={userName}/>

                <p className="ml-3">User 1</p>
            </div>
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
                                                <Dialog open={isupdateFormOpen} onOpenChange={setUpdateFormOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="mr-4" onClick={() =>
                                                            // assign default value to the form data
                                                            setupdateFormData({
                                                                "id": row.original.id,
                                                                "title": row.original.title,
                                                                "category": row.original.category,
                                                            })

                                                        }
                                                            disabled={!isProductEditable}>Edit/ View</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Edit</DialogTitle>
                                                            <DialogDescription>
                                                                Make changes to the product here. Click save when you're done.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="category" className="text-right">
                                                                    Title
                                                                </Label>
                                                                <Input
                                                                    id="title"
                                                                    defaultValue={updateFormData.title}
                                                                    className="col-span-3"
                                                                    onChange={e =>
                                                                        setupdateFormData(
                                                                            {
                                                                                ...updateFormData,
                                                                                "title": e.currentTarget.value
                                                                            })
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="category" className="text-right">
                                                                    Category
                                                                </Label>
                                                                <Select onValueChange={(value) => setupdateFormData(
                                                                    {
                                                                        ...updateFormData, "category": value
                                                                    })}>
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder={updateFormData.category} />
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
                                                            <Button type="submit" onClick={async () => {
                                                                await fetch(`${BACKEND_API}/api/1/update-inventory/${updateFormData.id}`, {
                                                                    method: "PUT",
                                                                    headers: {
                                                                        "Access-Control-Allow-Origin": "*",
                                                                        "Content-Type": "application/json",
                                                                    },
                                                                    body: JSON.stringify(updateFormData),
                                                                })
                                                                    .then((response) => {
                                                                        if (!response.ok) {
                                                                            throw new Error("Network response was not ok");
                                                                        }
                                                                        setUpdateFormOpen(false);
                                                                        setupdateFormData({});
                                                                        location.reload();
                                                                        return response.json();
                                                                    })
                                                            }}>Save changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="destructive" onClick={() => {
                                                    deleteProduct(row.original.id);
                                                }}
                                                    disabled={!isProductDeletable}>Delete</Button>
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
