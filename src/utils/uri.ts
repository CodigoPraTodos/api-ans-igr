export const addWildcard = (string: string, wildcard: string) => {
    return wildcard + decodeURI(string) + wildcard;
};
