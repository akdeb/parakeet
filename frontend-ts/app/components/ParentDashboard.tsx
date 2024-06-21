"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import ToyPicker from "./ToyPicker";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { updateUser } from "@/db/users";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

interface ParentDashboardProps {
    selectedUser: IUser | null;
    // chooseUser: (user: IUser) => void;
    selectedToy: IToy;
    // chooseToy: (toy: IToy) => void;
    allToys: IToy[];
}

export const parentDashboardSchema = z.object({
    child_name: z.string().min(1).max(50),
    child_persona: z.string().max(500).optional(),
    modules: z
        .array(z.enum(["math", "science", "spelling", "general_trivia"]))
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
});

const learningModules = [
    {
        id: "math",
        label: "Math",
    },
    {
        id: "science",
        label: "Science",
    },
    {
        id: "spelling",
        label: "Spelling",
    },
    {
        id: "general_trivia",
        label: "General trivia",
    },
] as { id: Module; label: string }[];

export type ParentFormInput = z.infer<typeof parentDashboardSchema>;

const ParentDashboard: React.FC<ParentDashboardProps> = ({
    selectedUser,
    selectedToy,
    allToys,
}) => {
    const supabase = createClientComponentClient();
    const { toast } = useToast();
    const form = useForm<ParentFormInput>({
        defaultValues: {
            child_name: selectedUser?.child_name ?? "",
            child_persona: selectedUser?.child_persona ?? "",
            modules: selectedUser?.modules ?? [],
        },
    });

    async function onSubmit(values: z.infer<typeof parentDashboardSchema>) {
        await updateUser(supabase, values, selectedUser!.user_id);
        toast({
            description: "Your prefereces have been saved.",
        });
    }

    const pickToy = async (toy: IToy) => {
        // chooseToy(toy);
        await updateUser(
            supabase,
            { toy_id: toy.toy_id },
            selectedUser!.user_id
        );
        toast({
            description: "Your plushie has been saved.",
        });
    };

    return (
        <div className="overflow-hidden w-full flex-auto flex flex-col font-quicksand pl-1">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 mb-4"
                >
                    <div className="flex flex-row gap-4 items-center font-baloo2">
                        <h1 className="text-4xl font-semibold">
                            Parent controls
                        </h1>
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <Button variant="default" size="sm" type="submit">
                                Save
                            </Button>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="child_name"
                        render={({ field }) => (
                            <FormItem className="w-full rounded-md">
                                <FormLabel className="flex flex-row gap-4 items-center">
                                    Child name
                                </FormLabel>
                                {/* <FormDescription>
                            Give your newsletter a name that describes its
                            content.
                        </FormDescription> */}
                                <FormControl>
                                    <Input
                                        // autoFocus
                                        required
                                        placeholder="e.g. Cosmo"
                                        {...field}
                                        className="max-w-screen-sm h-10 bg-white"
                                        autoComplete="on"
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="child_persona"
                        render={({ field }) => (
                            <FormItem className="w-full rounded-md">
                                <FormLabel className="flex flex-row gap-4 items-center">
                                    Briefly describe your child&apos;s
                                    interests, personality, and learning style
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={4}
                                        placeholder="e.g. I would like the plushie to be friendly and encouraging, and to use positive reinforcement to help my child learn."
                                        {...field}
                                        className="max-w-screen-sm bg-white"
                                        autoComplete="on"
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="modules"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">
                                        Sidebar
                                    </FormLabel>
                                    <FormDescription>
                                        Select your learning modules
                                    </FormDescription>
                                </div>
                                {learningModules.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="modules"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(
                                                                item.id
                                                            )}
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                return checked
                                                                    ? field.onChange(
                                                                          [
                                                                              ...field.value,
                                                                              item.id,
                                                                          ]
                                                                      )
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (
                                                                                  value
                                                                              ) =>
                                                                                  value !==
                                                                                  item.id
                                                                          )
                                                                      );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <Separator />
            <Label className="text-md mt-4 font-semibold">
                Pick your plushie
            </Label>
            <ToyPicker
                allToys={allToys}
                currentToy={selectedToy}
                buttonText={"Pick"}
                imageSize={200}
                chooseToy={pickToy}
                showCurrent={true}
            />
        </div>
    );
};

export default ParentDashboard;
