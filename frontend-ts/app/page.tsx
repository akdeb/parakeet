import { getHumeAccessToken } from "@/lib/getHumeAccessToken";
import Products from "./components/Products";
import supabaseServerClient from "@/db/supabaseServerClient";
import { getAllToys, getToyById } from "@/db/toys";
import { defaultToyId } from "@/lib/data";
import { getUserById, updateUser } from "@/db/users";
// import { redirect } from "next/navigation";
// import ToyPicker from "./components/ToyPicker";
import Preorder from "./components/Preorder";

export default async function Home() {
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
        throw new Error();
    }
    const supabase = supabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    console.log(user);

    const dbUser = await getUserById(supabase, user!.id);
    const allToys = await getAllToys(supabase);
    const toy = await getToyById(supabase, defaultToyId);

    return (
        <div className="flex-1 font-quicksand">
            {/* height 4rem */}

            <main className="mx-auto px-4 md:px-6 mt-6 lg:px-8 h-[calc(100%-4rem)] -mb-[4rem]">
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex flex-col items-center gap-2 justify-center">
                        <h1 className="text-4xl font-bold text-center ">
                            Welcome to Parakeet toys :)
                        </h1>
                        <p className="text-center text-lg font-quicksand">
                            We make AI-enabled toys for children that foster
                            learning & growth.
                        </p>
                    </div>
                    <Products allToys={allToys} toy={toy!} user={dbUser} />
                    <Preorder />
                </div>
            </main>
        </div>
    );
}
