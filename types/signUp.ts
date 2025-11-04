export type RegisterType = {
    role: "driver" | "owner",
    fullName: string,
    phoneNumber: string,
    emailAddress: string,
    password: string,
    confirmPassword: string
}