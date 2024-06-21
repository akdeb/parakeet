import { type SupabaseClient, type User } from "@supabase/auth-helpers-nextjs";

export const createUser = async (supabase: SupabaseClient, user: User) => {
    const { error } = await supabase.from("users").insert([
        {
            user_id: user.id,
            email: user.email,
            parent_name: "",
            child_name: "",
            child_age: 3,
            child_persona: "",
            toy_id: "2eab6067-5583-47f9-8850-005ceb08935b", // selecting coco
        } as Omit<IUser, "modules">,
    ]);

    if (error) {
        console.log("error", error);
    }
};

export const getUserById = async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*, toy:toy_id(*)")
        .eq("user_id", id)
        .single();

    if (error) {
        console.log("error", error);
    }

    return data as IUser | undefined;
};

export const updateUser = async (
    supabase: SupabaseClient,
    user: Partial<IUser>,
    userId: string
) => {
    const { error } = await supabase
        .from("users")
        .update(user)
        .eq("user_id", userId);

    if (error) {
        console.log("error", error);
    }
};

export const doesUserExist = async (
    supabase: SupabaseClient,
    authUser: User
) => {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single();

    if (error) {
        console.log("error", error);
    }

    return !!user;
};
