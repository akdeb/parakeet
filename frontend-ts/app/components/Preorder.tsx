import { Button } from "@/components/ui/button";
import Image from "next/image";

const Preorder = () => {
    return (
        <div className="p-8 flex sm:flex-row rounded-lg flex-col gap-4 max-w-screen-lg mx-auto justify-between bg-amber-100">
            <div className="flex gap-4">
                <Image src="/coco2.png" alt="toy" width={100} height={100} />
                <div>
                    <h2 className="text-2xl font-semibold">Parakeet Toy</h2>
                    <p className="text-sm text-gray-500">
                        Preorder now to get 20% off
                    </p>
                </div>
            </div>
            <Button variant="primary" className="font-bold" size="lg">
                Preorder
            </Button>
        </div>
    );
};

export default Preorder;
