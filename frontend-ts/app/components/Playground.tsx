"use client";

import React, { ComponentRef, useRef, useState } from "react";
import ChildPlayground from "./ChildPlayground";
import Messages from "./Messages";
import { VoiceProvider } from "@humeai/voice-react";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { constructUserPrompt } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { updateUser } from "@/db/users";
import _ from "lodash";

interface PlaygroundProps {
    selectedUser: IUser;
    selectedToy: IToy;
    accessToken: string;
}

const Playground: React.FC<PlaygroundProps> = ({
    selectedUser,
    selectedToy,
    accessToken,
}) => {
    const supabase = createClientComponentClient();
    const [chatGroupId, setChatGroupId] = useState<string | null>(
        selectedUser.most_recent_chat_group_id
    );

    console.log(chatGroupId);

    React.useEffect(() => {
        const userUpdate = async () => {
            if (chatGroupId) {
                await updateUser(
                    supabase,
                    {
                        ..._.omit(selectedUser, "toy"),
                        most_recent_chat_group_id: chatGroupId,
                    },
                    selectedUser.user_id
                );
            }
        };
        userUpdate();
    }, [chatGroupId, selectedUser]);

    const timeout = useRef<number | null>(null);
    const ref: any = useRef<ComponentRef<typeof Messages> | null>(null);

    return (
        <>
            <VoiceProvider
                auth={{ type: "accessToken", value: accessToken }}
                onMessage={(message) => {
                    console.log(message);
                    if (message.type === "chat_metadata") {
                        setChatGroupId(message.chat_group_id);
                        console.log("chatGroupId", message.chat_group_id);
                    }
                    if (timeout.current) {
                        window.clearTimeout(timeout.current);
                    }

                    timeout.current = window.setTimeout(() => {
                        if (ref.current) {
                            const scrollHeight = ref.current.scrollHeight;

                            ref.current.scrollTo({
                                top: scrollHeight,
                                behavior: "smooth",
                            });
                        }
                    }, 200);
                }}
                configId={
                    selectedToy?.hume_ai_config_id ??
                    "6947ac53-5f3b-4499-abc5-f8b368552cb6"
                }
                sessionSettings={{
                    systemPrompt: constructUserPrompt(
                        selectedUser,
                        selectedToy
                    ),
                }}
                resumedChatGroupId={
                    selectedUser.most_recent_chat_group_id ?? ""
                }
            >
                <div className="flex flex-row items-center gap-4">
                    <h1 className="text-4xl font-semibold">Playground</h1>
                    <StartCall
                        chatGroupId={chatGroupId}
                        selectedUser={selectedUser}
                        selectedToy={selectedToy}
                    />
                </div>
                <ChildPlayground
                    selectedUser={selectedUser}
                    selectedToy={selectedToy}
                >
                    <Messages
                        ref={ref}
                        selectedUser={selectedUser}
                        selectedToy={selectedToy}
                    />
                    <Controls />
                </ChildPlayground>
            </VoiceProvider>
        </>
    );
};

export default Playground;
