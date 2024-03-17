import { useRouter } from "next/router";
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
    try {
        const res = await fetch(
            `http://127.0.0.1:8000/api/inventory?per-page=15`, {cache: 'no-store'}
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
