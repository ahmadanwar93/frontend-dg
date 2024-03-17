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

const fetchData = async () => {
    try {
        const res = await fetch(
            `http://127.0.0.1:8000/api/1/permissions`, { cache: 'no-store' }
        );
        const permissionData = await res.json();
        console.log('abc')
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
