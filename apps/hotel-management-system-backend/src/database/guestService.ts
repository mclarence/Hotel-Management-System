import pgPromise, { IDatabase } from "pg-promise";
import { GuestService } from "@hotel-management-system/models";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface IGuestServiceDAO {
  getGuestServices(): Promise<GuestService[]>;

  getGuestServiceById(id: number): Promise<GuestService>;

  addGuestService(guestService: GuestService): Promise<GuestService>;

  updateGuestService(guestService: GuestService): Promise<GuestService>;

  deleteGuestService(serviceId: number): Promise<void>;

  checkGuestServiceExistsById(id: number): Promise<boolean>;

  searchGuestServices(query: string): Promise<GuestService[]>;
}

export const makeGuestServiceDAO = (db: IDatabase<any, any>): IGuestServiceDAO => {
  const getGuestServices = async (): Promise<GuestService[]> => {
    return await db.any(queries.guestService.getGuestServices);
  };

  const getGuestServiceById = async (id: number): Promise<GuestService | null> => {
    try {
          return await db.one(queries.guestService.getGuestServiceById, [id]);
    } catch (e) {
      if (e instanceof QueryResultError && e.code === pgPromise.errors.queryResultErrorCode.noData) {
        return null;
      } else {
        throw e;
      }
    }
  };

  const addGuestService = async (guestService: GuestService): Promise<GuestService> => {
    return await db.one(queries.guestService.addGuestService, [
      guestService.serviceDescription,
      guestService.servicePrice,
      guestService.serviceQuantity,
    ]);
  };

  const updateGuestService = async (guestService: GuestService): Promise<GuestService> => {
    return await db.one(queries.guestService.updateGuestService, [
      guestService.serviceDescription,
      guestService.servicePrice,
      guestService.serviceQuantity,
      guestService.serviceId,
    ]);
  };

  const deleteGuestService = async (serviceId: number): Promise<void> => {
    await db.none(queries.guestService.deleteGuestService, [serviceId]);
  };

  const checkGuestServiceExistsById = async (id: number): Promise<boolean> => {
    const guestService: any = await db.one(queries.guestService.checkGuestServiceExistsById, [id]);
    return guestService.exists;
  };

    const searchGuestServices = async (query: string): Promise<GuestService[]> => {
        return await db.any(queries.guestService.searchGuestService, [query]);
    }

  return {
    getGuestServices,
    getGuestServiceById,
    addGuestService,
    updateGuestService,
    deleteGuestService,
    checkGuestServiceExistsById,
    searchGuestServices,
  };
};
