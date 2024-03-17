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
// const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
const BACKEND_API = "https://dg-backend.fly.dev";

interface Permission {
  id: number;
  name: string;
}

interface Props {
  currentUser: string;
  permissions: Permission[],
  userName:string
}


export default function Permissions({ currentUser, permissions, userName }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  type Permission = {
    id: number;
    name: string;
};

  function checkPermissionById(id:number) {
    let found = false;
    permissions.forEach((obj:Permission) => {
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
            <Label htmlFor="currentUser" className="text-right">
              User Id
            </Label>
            <Input
              disabled
              id="currentUser"
              defaultValue={currentUser}
              className="col-span-3"
            />
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              disabled
              id="name"
              defaultValue={userName}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="permission1" disabled={currentUser != 3} onCheckedChange={
              (checked) => setFormData({
                ...formData,
                1: checked,
              }
              )
            }
              defaultChecked={isProductViewable} />
            <label
              htmlFor="permission1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              View product
            </label>
            <Checkbox id="permission2" disabled={currentUser != 3} onCheckedChange={
              (checked) => setFormData({
                ...formData,
                2: checked,
              }
              )
            } 
            defaultChecked={isProductCreatable}/>
            <label
              htmlFor="permission2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Create product
            </label>
            <Checkbox id="permission3" disabled={currentUser != 3} onCheckedChange={
              (checked) => setFormData({
                ...formData,
                3: checked,
              }
              )
            } 
            defaultChecked={isProductEditable}/>
            <label
              htmlFor="permission3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Edit product
            </label>
            <Checkbox id="permission4" disabled={currentUser != 3} onCheckedChange={
              (checked) => setFormData({
                ...formData,
                4: checked,
              }
              )
            } 
            defaultChecked={isProductDeletable}/>
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
            await fetch(`${BACKEND_API}/api/${currentUser}/permissions`, {
              method: "PUT",
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "permissions": permissionBody
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
          }}
          disabled={currentUser != 3}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
