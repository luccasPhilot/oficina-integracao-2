export interface Escola {
    id: string;
    nome: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    telefone?: string;
    email?: string;
    createdAt?: string;

    //client-only
    filtered?: boolean;
}