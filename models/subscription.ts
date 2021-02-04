import Client from "./client";
import subType from "./subType";

export default interface Subscription {
    _id: string,
    client: Client,
    subInfo: subType,
    isArchived: boolean,
    uuid: number
    dateFrom: Date,
    dateTo: Date,
    isInfinite: boolean,
    visitsLeft?: number,
    lastVisited?: Date
}
