import { supabase } from "@/lib/supabase";
import { ProfileInterface, ProfileUpdateInterface } from "@/types/profile";
import { isUUID } from "@/utils/isUUID";
import { denormalizeData, normalizeData } from "@/utils/normalizeData";
import { rejectTimeout } from "@/utils/rejectTimeout";
import * as crypto from "expo-crypto";

export async function createProfile(profile: ProfileInterface): Promise<ProfileInterface | null> {
    try {
        const {
            id,
            roles,
            fullName: full_name,
            emailAddress: email_address,
            phoneNumber: phone_number
        } = profile;

        const request = (async () => {
            const { data: newProfile, error } = await supabase.from("profiles")
                .insert([{
                    id,
                    roles,
                    full_name,
                    email_address,
                    phone_number
                }])
                .select()
                .single()

            if (!newProfile || error) throw new Error(`An error occured during profile creation, ${error?.message}`);
            const normalized = normalizeData(newProfile);
            return normalized as ProfileInterface;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(profile: ProfileUpdateInterface): Promise<ProfileInterface | null> {
    try {
        const { id, ...updateData } = profile;

        if (!isUUID(id)) throw new Error("Invalid profile ID");
        const dataToUpdate = denormalizeData(updateData);

        const request = (async () => {
            const { data: updatedProfile, error } = await supabase.from("profiles")
                .update(dataToUpdate)
                .eq("id", id)
                .select()
                .single()

            if (!updatedProfile || error) throw new Error(`An error occured during profile update, ${error?.message}`);
            const normalized = normalizeData(updatedProfile);
            return normalized as ProfileInterface;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function getCurrentProfile(): Promise<ProfileInterface | null> {
    try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return null;

        const request = (async () => {
            const { data: currentProfile, error } = await supabase.from("profiles")
                .select("*")
                .eq("id", currentUser.id)
                .single()

            if (!currentProfile || error) throw new Error(`The profile can't be find, ${error?.message}`);
            const normalized = normalizeData(currentProfile);
            return normalized as ProfileInterface;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

interface UpdateProfilePictureParams {
    profileId: string;
    imageUri: string;
    oldUrl?: string;
}

export const updateProfilePicture = async ({
    profileId,
    imageUri,
    oldUrl
}: UpdateProfilePictureParams) => {

    if (oldUrl) {
        const oldPath = oldUrl.split("/images/")[1];

        if (oldPath) {
            await supabase.storage
                .from("images")
                .remove([oldPath])
        }
    }

    const extension = imageUri.split(".").pop() || "jpg";

    const path = `avatars/${crypto.randomUUID()}.${extension}`;

    const response = await fetch(imageUri)
    const arrayBuffer = await response.arrayBuffer()
    const file = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, {
            contentType: "image/jpeg",
            upsert: false
        })

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from("images")
        .getPublicUrl(path)

    const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update({
            url_image: data.publicUrl
        })
        .eq("id", profileId)
        .select()
        .single()

    if (error) throw error;

    return updatedProfile;
}