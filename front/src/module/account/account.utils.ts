import { WorkTypeType } from "../admin/admin-configuration/workType/workTypeTable/workTypeTable.utils"

export type AccountStoreType = {
    workType: null | string
    isLoading: boolean
    getWorkType: (userId: string) => Promise<void>
}