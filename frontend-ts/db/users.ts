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
        } as Omit<IUser, "modules">,
    ]);

    if (error) {
        console.log("error", error);
    }
};

export const getUserById = async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.log("error", error);
    }

    return data as IUser | undefined;
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
