import {prepare_en_locale} from "./locale/en.ts";

export type StrToken = `${string}`;

let current = prepare_en_locale();

export function str(token: StrToken) {
    return current.get(token) ?? token;
}
