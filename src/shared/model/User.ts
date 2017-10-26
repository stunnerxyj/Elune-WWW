import { EntityStatus } from "enum/EntityStatus";

export default class UserInfo {
    public id: number;
    public username: string;
    public email: string;
    public nickname: string;
    public unreadCount: number;
    public joinTime: number;
    public avatar: string;
    public status: EntityStatus;
    public bio: string;
    public url: string;
    public favoriteTopicIds: number[];
}

export class PublicUserInfo {
    public id: number;
    public username: string;
    public nickname: string;
    public joinTime: number;
    public avatar: string;
    public bio: string;
    public url: string;
    public lastSeen: number;
    public postsCount: number;
    public topicsCount: number;
    public favoritesCount?: number;
}
