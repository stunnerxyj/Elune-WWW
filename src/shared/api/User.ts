import WebApi from "api/WebApi";
import { PublicUserInfo } from "model/User";
import Pagination from "model/Pagination";
import UserProfileSetting from "interface/UserProfileSetting";
import Topic from "model/Topic";

export interface FetchUserReq {
    username: string;
}

export interface FetchUserFavoritesReq {
    page: number;
    pageSize: number;
}

export function FetchNamedUser(payload: FetchUserReq) {
    return WebApi.Post<PublicUserInfo>("users/name", payload);
}

export function FetchUserFavorites(payload: FetchUserFavoritesReq) {
    return WebApi.Get<Pagination<Topic>>("usermetas/favorites", payload);
}

export function UpdateUserProfile(payload: UserProfileSetting) {
    return WebApi.Post<Boolean>("users/profile", payload);
}

export default {
    FetchNamedUser,
    FetchUserFavorites,
    UpdateUserProfile
};
