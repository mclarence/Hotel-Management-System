import {PriceUnits} from "./enums/PriceUnits";
import {RoomStatuses} from "./enums/RoomStatuses";

export type Room = {
    roomId: Number;
    status: RoomStatuses;
    price: Number;
    priceUnit: PriceUnits;
    metadata: {[key: string]: String | Number};
}