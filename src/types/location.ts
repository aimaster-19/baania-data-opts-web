export type Province = {
    id: number
    title: {
        title_th: string
        title_en: string
    }
}

export type District = {
    id: number
    title_th: string
    title_en: string
    province_id: number
}

export type Subdistrict = {
    id: number
    title_th: string
    title_en: string
    district_id: number
    province_id: number
}
