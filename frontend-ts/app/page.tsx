import { getHumeAccessToken } from "@/lib/getHumeAccessToken";
import Products from "./components/Products";
import supabaseServerClient from "@/db/supabaseServerClient";
import { getAllToys, getToyById } from "@/db/toys";
import { defaultToyId } from "@/lib/data";
import { getUserById } from "@/db/users";
import Preorder from "./components/Preorder";
import PlaceOrder from "./components/PlaceOrder";
import LandingPageSection from "./components/LandingPageSection";

const Sections = [
    {
        title: "A companion for your child",
        description:
            "Our toys are designed to be thoughtful and engaging companions for your child.",
        imageSrc: "/companion.png",
    },
    {
        title: "Fostering a growth mindset",
        description:
            "Our toys are designed to foster a growth mindset in your child.",
        imageSrc: "/fostering.png",
        isImageRight: true,
    },
    {
        title: "Supplementing learning",
        description:
            "Our toys are designed to supplement learning for your child.",
        imageSrc: "/tumble2.png",
    },
    {
        title: "Reduce screen time",
        description:
            "We aim to reduce screen time for your child and provide a more engaging experience.",
        imageSrc: "/coco2.png",
        isImageRight: true,
    },
    {
        title: "AI-driven insights for parents",
        description:
            "Our toys provide insights to parents on their child's learning and emotional growth.",
        imageSrc: "/whisker2.png",
    },
    {
        title: "Privacy first",
        description:
            "We take privacy seriously and all personal data is encrypted.",
        imageSrc: "/tumble2.png",
        isImageRight: true,
    },
];

export default async function Home() {
    const accessToken = await getHumeAccessToken();

    if (!accessToken) {
        throw new Error();
    }
    const supabase = supabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // console.log(user);

    const dbUser = user ? await getUserById(supabase, user.id) : undefined;
    const allToys = await getAllToys(supabase);
    const toy = await getToyById(supabase, dbUser?.toy_id ?? defaultToyId);

    return (
        <main className="font-quicksand mx-auto px-4 md:px-6 mt-6 lg:px-8 h-[calc(100%-4rem)] mb-[4rem]">
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
                <PlaceOrder>
                    <Preorder />
                </PlaceOrder>
                {Sections.map((section, index) => (
                    <LandingPageSection key={index} {...section} />
                ))}
            </div>
        </main>
    );
}
