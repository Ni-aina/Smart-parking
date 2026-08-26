import {
    createConversation,
    getConversationById,
    getConversationsByUserId,
    normalizeConversation,
    normalizeMessage
} from "@/actions/conversation.action";
import { sendMessagePushNotification } from "@/actions/notification.action";
import { supabase } from "@/lib/supabase";
import {
    MessageCreateInterface,
    MessageInterface
} from "@/types/message";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

export {
    createConversation,
    getConversationById,
    getConversationsByUserId,
    normalizeConversation,
    normalizeMessage
};

export const getNoReadCountByUserId = async (userId: string): Promise<number> => {
    try {
        if (!isUUID(userId)) throw new Error("You have to be authenticated");

        const request = (async () => {
            const { count, error } = await supabase.from("messages")
                .select("*", { count: "exact", head: true })
                .neq("sender_id", userId)
                .eq("is_read", false)

            if (error) throw new Error(`Count fetching error, ${error?.message}`);
            return count || 0;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export const getMessagesByConversationId = async ({
    conversationId,
    page = 1,
    limit = 20
}: {
    conversationId: string
    page?: number
    limit?: number
}): Promise<{
    data: MessageInterface[]
    hasMore: boolean
    nextPage?: number
}> => {
    try {
        if (!conversationId) throw new Error("Conversation id is required")

        const from = (page - 1) * limit
        const to = page * limit - 1

        const request = (async () => {
            const [
                { data: messages, error },
                { count }
            ] = await Promise.all([
                supabase
                    .from("messages")
                    .select(`
                    *,
                    sender: sender_id(*)
                `)
                    .eq("conversation_id", conversationId)
                    .order("created_at", {
                        ascending: false
                    })
                    .range(from, to),
                supabase
                    .from("messages")
                    .select("*", { count: "exact", head: true })
                    .eq("conversation_id", conversationId)
            ])

            if (!messages || error) throw new Error(`Messages fetching error, ${error?.message}`)

            const normalizedData = messages.map(item => normalizeMessage(item))
            const hasMore = count !== null && count > page * limit

            return {
                data: normalizedData,
                hasMore,
                nextPage: hasMore ?
                    page + 1 :
                    undefined
            }
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error
    }
}

export const sendMessage = async (
    message: MessageCreateInterface
): Promise<MessageInterface> => {
    try {
        const payload = denormalizeData({
            ...message,
            contentType: message.contentType ?? "text"
        })

        const request = (async () => {
            const { data: newMessage, error } = await supabase
                .from("messages")
                .insert([payload])
                .select(`
                    *,
                    sender: sender_id(*)
                `)
                .single();

            if (!newMessage || error) throw new Error(`Message sending error, ${error?.message}`);
            const normalized = normalizeMessage(newMessage);

            const { data: conversationData } = await supabase
                .from("conversations")
                .select("sender_id, receiver_id")
                .eq("id", message.conversationId)
                .single();

            if (conversationData) {
                const recipientId = conversationData.sender_id === message.senderId
                    ? conversationData.receiver_id
                    : conversationData.sender_id;

                sendMessagePushNotification({
                    recipientId,
                    senderName: normalized.sender?.fullName || "New Message",
                    messageContent: normalized.content,
                    conversationId: normalized.conversationId
                }).catch(() => null)
            }

            return normalized;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export const markConversationMessagesAsRead = async (
    conversationId: string,
    userId: string
): Promise<boolean> => {
    try {
        if (!conversationId || !isUUID(userId)) return false;

        const request = (async () => {
            const { error } = await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("is_read", false)
                .eq("conversation_id", conversationId)
                .neq("sender_id", userId);

            if (error) throw new Error(`Mark messages as read error, ${error.message}`);
            return true;
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}
