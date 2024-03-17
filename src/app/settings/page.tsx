"use client"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"


export default function Permissions() {
    const [permissionData, setPermissionData] = useState([])
    const [userId, setUserId] = useState(3);
    const [isLoading, setLoading] = useState(true);
    const [isOpen, setOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/api/${userId}/permissions`, { cache: 'no-store' }
                );
                const data = await res.json();
                console.log(formData);
                setLoading(false);
                setPermissionData(data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <p>Loading the data</p>



    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit permissions</DialogTitle>
                    <DialogDescription>
                        Make changes to the permission here. Only user id 3 are allowed to make changes.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="userId" className="text-right">
                            User Id
                        </Label>
                        <Input
                            disabled
                            id="userId"
                            defaultValue={permissionData.user_id}
                            className="col-span-3"
                        />
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            disabled
                            id="name"
                            defaultValue={permissionData.name}
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="permission1" disabled={userId !== 3} onCheckedChange={
                            (checked) => setFormData({
                                ...formData,
                                1: checked,
                            }
                            )
                        } />
                        <label
                            htmlFor="permission1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            View product
                        </label>
                        <Checkbox id="permission2" disabled={userId !== 3} onCheckedChange={
                            (checked) => setFormData({
                                ...formData,
                                2: checked,
                            }
                            )
                        } />
                        <label
                            htmlFor="permission2"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Create product
                        </label>
                        <Checkbox id="permission3" disabled={userId !== 3} onCheckedChange={
                            (checked) => setFormData({
                                ...formData,
                                3: checked,
                            }
                            )
                        } />
                        <label
                            htmlFor="permission3"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Edit product
                        </label>
                        <Checkbox id="permission4" disabled={userId !== 3} onCheckedChange={
                            (checked) => setFormData({
                                ...formData,
                                4: checked,
                            }
                            )
                        } />
                        <label
                            htmlFor="permission4"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Delete product
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={async () => {
                        let permissionBody = [];
                        for (let key in formData) {
                            if (formData[key] == true) {
                                permissionBody.push(Number(key));
                            }
                        }
                        console.log(formData);
                        console.log(permissionBody);
                        await fetch("http://127.0.0.1:8000/api/3/permissions", {
                            method: "PUT",
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "permissions" : permissionBody
                            }),
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            setOpen(false);
                            setFormData({});
                            return response.json();
                          })
                    }}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
