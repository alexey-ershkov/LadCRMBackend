import Client from "./client";
import subType from "./subType";

export default interface Journal {
    client: Client,
    visitInfo: {
        visitName: string,
        cost: number
    },
    isSub: boolean,
    subInfo: {
        client: Client,
        subInfo: subType,
        uuid: number
        dateFrom: Date,
        dateTo: Date,
        isInfinite: boolean,
        visitsLeft?: number
    },
    visitTime: Date
}
