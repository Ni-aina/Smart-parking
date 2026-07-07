import {
    createConversation,
    getConversationsByUserId
} from "@/actions/message.action";
import { supabase } from "@/lib/supabase";
import { ConversationCreateInterface } from "@/types/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useConversations = () => {
    const { currentProfile } = useCurrentProfile();
    const userId = currentProfile?.id || "";
    const queryClient = useQueryClient();
    const router = useRouter();

    const queryKey = ["conversations", userId];

    const {
        data: conversations = [],
        isLoading,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey,
        queryFn: () => getConversationsByUserId(userId),
        enabled: !!userId
    })

    const {
        mutate: handleCreate,
        mutateAsync: handleCreateAsync,
        isPending: isCreating,
        error: creationError
    } = useMutation({
        mutationKey: ["create-conversation", userId],
        mutationFn: (conversation: ConversationCreateInterface) => createConversation(conversation),
        onSuccess: (conversation) => {
            queryClient.invalidateQueries({ queryKey });
            router.push({
                pathname: "/messages/[id]",
                params: { id: String(conversation.id) }
            } as Href);
        }
    })

    useEffect(() => {
        if (!userId) return;

        const channelName = `conversations:${userId}`;
        const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
        if (existingChannel) {
            supabase.removeChannel(existingChannel);
        }

        const conversationsChannel = supabase.channel(channelName)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations"
                },
                () => refetch()
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages"
                },
                () => refetch()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(conversationsChannel);
        }
    }, [
        refetch,
        userId
    ])

    return {
        conversations,
        isLoading,
        error,
        refetch,
        isRefetching,
        handleCreate,
        handleCreateAsync,
        isCreating,
        creationError,
        currentProfile
    }
}

export default useConversations;
