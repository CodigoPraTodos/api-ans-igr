export interface ResponseLinks {
    self: string;
    first: string;
    prev: string;
    next: string;
    last: string;
}

export interface ApiEntity<T> {
    type: string;
    id: number;
    attributes: T;
    links: ResponseLinks;
}

export interface ApiResponse<T> {
    data: ApiEntity<T>[];
}

export const createLink = (self: string, first = "", prev = "", next = "", last = "") => ({
    self,
    first,
    prev,
    next,
    last,
});
