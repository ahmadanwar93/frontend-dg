import { useRouter } from "next/router";
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
// const BACKEND_API = "https://dg-backend.fly.dev";

async function getData() {
    try {
        const res = await fetch(
            `${BACKEND_API}/api/inventory`, {cache: 'no-store'}
        );
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.log(err);
    }
}

export default async function Page() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
