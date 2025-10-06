export interface INewsFilterCriteria {
    title?: string;
    draft?: boolean | null;
    startDate?: string;
    endDate?: string;
    categoryId?: string | null;
    orderBy?: 'title' | 'creation_date_desc' | 'creation_date_asc';
    draftPriority?: 'first' | 'last' | null;
}
