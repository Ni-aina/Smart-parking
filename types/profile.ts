export interface ProfileInterface {
    id: string,
    roles: string[],
    fullName: string,
    emailAddress: string,
    phoneNumber: string,
    urlImage?: string,
    customerId?: string,
    agentCreatorId?: string;
    createdAt?: string
}

export interface ProfileUpdateInterface {
    id: string,
    fullName: string,
    emailAddress: string,
    phoneNumber: string,
    urlImage?: string
}