import { useRouter } from "next/router";
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
// const BACKEND_API = "https://dg-backend.fly.dev";
async function getData(): Promise<Payment[]> {
    try {
        const res = await fetch(
            `${BACKEND_API}/api/3/inventory`, {cache: 'no-store'}
        );
        const data = await res.json();
        return data.data.data;
    } catch (err) {
        console.log(err);
    }
}

const fetchData = async () => {
    try {
        const res = await fetch(
            `${BACKEND_API}/api/3/permissions`, { cache: 'no-store' }
        );
        const permissionData = await res.json();
    } catch (err) {
        console.log(err);
    }
};

fetchData();

export default async function Page() {
    const data = await getData()
    const permissionData = await fetchData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} permissionData={permissionData}/>
        </div>
    )
}
