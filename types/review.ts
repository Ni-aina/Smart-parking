export interface ReviewInterface {
    id: string;
    lotId: number;
    userId: string;
    fullName: string | null;
    urlImage: string | null;
    rating: number;
    feedback: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewCreateInterface {
    lotId: number;
    userId: string;
    rating: number;
    feedback?: string;
}

export interface ReviewUpdateInterface {
    id: string;
    rating: number;
    feedback?: string;
}