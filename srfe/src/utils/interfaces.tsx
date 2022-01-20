export interface IAuthor {
    id: number,
    first_name: string,
    last_name: string,
}

export interface IArticleAuthor extends IAuthor {
    addedToFav: boolean,
    standOut?: boolean
}

export interface IAuthorProfile {
    id: number,
    displayName: string,
    academicStatus: string,
    disciplines: Array<string>,
    photo: string,
    addedToFav: boolean
}

export interface ICatalog {
    id: string,
    title: string,
    type: string,
    authors: Array<IArticleAuthor>,
    year: number,
    source: string,
    link: string
}

export interface IRequestOptions {
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    data?: Object
}

export interface IUser {
    first_name: string,
    last_name: string,
    email: string
}
