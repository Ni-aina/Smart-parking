import { supabase } from "@/lib/supabase";
import { ReviewCreateInterface, ReviewInterface } from "@/types/review";

export const getReviewsByLot = async (lotId: number): Promise<ReviewInterface[]> => {
    const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, url_image)")
        .eq("lot_id", lotId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((r) => ({
        id: r.id,
        lotId: r.lot_id,
        userId: r.user_id,
        fullName: r.profiles?.full_name ?? null,
        urlImage: r.profiles?.url_image ?? null,
        rating: r.rating,
        feedback: r.feedback,
        createdAt: r.created_at,
        updatedAt: r.updated_at
    }))
}

export const getMyReview = async (lotId: number): Promise<ReviewInterface | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, url_image)")
        .eq("lot_id", lotId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
        id: data.id,
        lotId: data.lot_id,
        userId: data.user_id,
        fullName: data.profiles?.full_name ?? null,
        urlImage: data.profiles?.url_image ?? null,
        rating: data.rating,
        feedback: data.feedback,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    }
}

export const upsertReview = async (payload: ReviewCreateInterface): Promise<ReviewInterface> => {
    const { data, error } = await supabase
        .from("reviews")
        .upsert(
            {
                lot_id: payload.lotId,
                user_id: payload.userId,
                rating: payload.rating,
                feedback: payload.feedback ?? null
            },
            { onConflict: "lot_id,user_id" }
        )
        .select("*, profiles(full_name, url_image)")
        .single();

    if (error) throw new Error(error.message);

    return {
        id: data.id,
        lotId: data.lot_id,
        userId: data.user_id,
        fullName: data.profiles?.full_name ?? null,
        urlImage: data.profiles?.url_image ?? null,
        rating: data.rating,
        feedback: data.feedback,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    }
}

export const deleteReview = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}