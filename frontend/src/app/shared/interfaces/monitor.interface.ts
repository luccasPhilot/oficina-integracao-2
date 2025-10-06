export interface IMonitor {
  id: string;
  group_id?: string | null;
  name: string;
  email: string;
  ra: string;
  phone_number?: string;
  cpf?: string;
  subject?: string;
  period?: number;
  creation_date?: string;
}
