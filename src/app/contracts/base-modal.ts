export interface ModleBase {
    isActive: boolean;
    isDeleted: boolean;
    createdById?: string;
    updatedById?: string;
    deletedById?: string;
    // timestaps
    createdAtDateTime: Date;
    updatedAtDateTime: Date;
}