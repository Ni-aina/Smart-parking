import { supabase } from "@/lib/supabase";
import {
    ConversationCreateInterface,
    ConversationInterface,
    MessageCreateInterface,
    MessageInterface
} from "@/types/message";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";

const normalizeConversation = (conversation: Record<string, unknown>) =>
    normalizeData(conversation) as ConversationInterface;

const normalizeMessage = (message: Record<string, unknown>) =>
    normalizeData(message) as MessageInterface;

export async function getNoReadCountByUserId(userId: string): Promise<number> {
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

export async function getConversationsByUserId(userId: string): Promise<ConversationInterface[]> {
    try {
        if (!isUUID(userId)) throw new Error("You have to be authenticated");

        const request = (async () => {
            const { data: conversations, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    sender: sender_id(*),
                    receiver: receiver_id(*)
                `)
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                .order("created_at", { ascending: false });

            if (!conversations || error) throw new Error(`Conversations fetching error, ${error?.message}`);

            const conversationIds = conversations.map(item => item.id);
            const { data: messages, error: messageError } = conversationIds.length
                ? await supabase
                    .from("messages")
                    .select("*")
                    .in("conversation_id", conversationIds)
                    .order("created_at", { ascending: false })
                : { data: [], error: null }

            if (messageError) throw new Error(`Messages fetching error, ${messageError.message}`);

            const lastMessagesByConversation = (messages ?? []).reduce<Record<number, MessageInterface>>((acc, item) => {
                const normalized = normalizeMessage(item);
                if (!acc[normalized.conversationId]) {
                    acc[normalized.conversationId] = normalized;
                }
                return acc;
            }, {})

            return conversations
                .map(item => {
                    const normalized = normalizeConversation(item);
                    return {
                        ...normalized,
                        lastMessage: lastMessagesByConversation[normalized.id],
                        isNotReadCount: messages?.filter(m =>
                            m.conversation_id === normalized.id &&
                            m.is_read === false &&
                            m.sender_id !== userId
                        ).length
                    }
                })
                .sort((a, b) => {
                    const aTime = a.lastMessage?.createdAt ?? a.createdAt;
                    const bTime = b.lastMessage?.createdAt ?? b.createdAt;
                    return new Date(bTime).getTime() - new Date(aTime).getTime();
                })
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getConversationById(conversationId: string): Promise<ConversationInterface> {
    try {
        if (!conversationId) throw new Error("Conversation id is required");

        const request = (async () => {
            const { data: conversation, error } = await supabase
                .from("conversations")
                .select(`
                    *,
                    sender: sender_id(*),
                    receiver: receiver_id(*)
                `)
                .eq("id", conversationId)
                .single();

            if (!conversation || error) throw new Error(`Conversation fetching error, ${error?.message}`);
            return normalizeConversation(conversation);
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function createConversation(
    conversation: ConversationCreateInterface
): Promise<ConversationInterface> {
    try {
        const { senderId, receiverId } = conversation;

        if (!isUUID(senderId) || !isUUID(receiverId)) throw new Error("Invalid user");
        if (senderId === receiverId) throw new Error("You cannot create a conversation with yourself");

        const request = (async () => {
            const { data: existingConversation, error: existingError } = await supabase
                .from("conversations")
                .select(`
                    *,
                    sender: sender_id(*),
                    receiver: receiver_id(*)
                `)
                .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
                .maybeSingle();

            if (existingError) throw new Error(`Conversation lookup error, ${existingError.message}`);
            if (existingConversation) return normalizeConversation(existingConversation);

            const { data: newConversation, error } = await supabase
                .from("conversations")
                .insert([denormalizeData(conversation)])
                .select(`
                    *,
                    sender: sender_id(*),
                    receiver: receiver_id(*)
                `)
                .single();

            if (!newConversation || error) throw new Error(`Conversation creation error, ${error?.message}`);
            return normalizeConversation(newConversation);
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getMessagesByConversationId(conversationId: string): Promise<MessageInterface[]> {
    try {
        if (!conversationId) throw new Error("Conversation id is required");

        const request = (async () => {
            const { data: messages, error } = await supabase
                .from("messages")
                .select(`
                    *,
                    sender: sender_id(*)
                `)
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (!messages || error) throw new Error(`Messages fetching error, ${error?.message}`);
            return messages.map(item => normalizeMessage(item));
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function sendMessage(message: MessageCreateInterface): Promise<MessageInterface> {
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
            return normalizeMessage(newMessage);
        })()

        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function markConversationMessagesAsRead(
    conversationId: string,
    userId: string
): Promise<boolean> {
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