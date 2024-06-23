import Charts from "@/app/components/Insights/Charts";
import { Badge } from "@/components/ui/badge";
import { getHumeAccessToken } from "@/lib/getHumeAccessToken";

export default async function Home() {
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
        throw new Error();
    }

    return (
        <div className="flex flex-col gap-2 font-baloo2">
            <div className="flex flex-row items-center gap-4">
                <h1 className="text-4xl font-semibold">Insights</h1>
                <Badge variant="default">Coming soon</Badge>
            </div>

            <div className="">
                <Charts selectedUser={null} selectedToy={null} filter="days" />
            </div>
        </div>
    );
}
