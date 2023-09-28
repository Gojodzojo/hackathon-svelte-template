import { UserData } from "$common/models/user";

export interface UserDbEntry {
    userData: UserData;
    hashedPassword: string;
}

export const fakeUserDB: UserDbEntry[] = [];