import {
    getConversationById,
    getMessagesByConversationId,
    markConversationMessagesAsRead,
    sendMessage
} from "@/actions/message.action";
import { supabase } from "@/lib/supabase";
import { MessageCreateInterface } from "@/types/message";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useMessages = (conversationId: string) => {
    const { currentProfile } = useCurrentProfile()
    const userId = currentProfile?.id || ""
    const queryClient = useQueryClient()

    const messagesKey = ["messages", conversationId]
    const conversationKey = ["conversation", conversationId]

    const {
        data: conversation,
        isLoading: isConversationLoading,
        error: conversationError,
        refetch: refetchConversation
    } = useQuery({
        queryKey: conversationKey,
        queryFn: () => getConversationById(conversationId),
        enabled: !!conversationId
    })

    const {
        data,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: messagesKey,
        queryFn: async ({ pageParam = 1 }) => {
            return await getMessagesByConversationId({
                conversationId,
                page: pageParam,
                limit: 20
            })
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ?
                lastPage.nextPage :
                undefined
        },
        initialPageParam: 1,
        enabled: !!conversationId
    })

    const messages = (data?.pages.flatMap(page => page.data) || [])
        .slice()
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    const {
        mutate: handleSend,
        mutateAsync: handleSendAsync,
        isPending: isSending,
        error: sendError
    } = useMutation({
        mutationKey: ["send-message", conversationId],
        mutationFn: (message: MessageCreateInterface) => sendMessage(message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messagesKey })
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
        }
    })

    useEffect(() => {
        if (!conversationId || !userId) return
        markConversationMessagesAsRead(conversationId, userId).catch(() => null)
    }, [
        conversationId,
        messages.at(-1)?.id,
        userId
    ])

    useEffect(() => {
        if (!conversationId) return

        const channelName = `messages:${conversationId}`
        const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`)
        if (existingChannel) {
            supabase.removeChannel(existingChannel)
        }

        const messagesChannel = supabase.channel(channelName)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`
                },
                () => refetch()
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations",
                    filter: `id=eq.${conversationId}`
                },
                () => refetchConversation()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(messagesChannel)
        }
    }, [
        conversationId,
        refetch,
        refetchConversation
    ])

    return {
        conversation,
        messages,
        isLoading: isLoading || isConversationLoading,
        error: error || conversationError,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage,
        handleSend,
        handleSendAsync,
        isSending,
        sendError,
        currentProfile
    }
}

export default useMessages
