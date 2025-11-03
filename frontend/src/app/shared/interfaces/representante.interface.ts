import { Escola } from "./escola.interface";

export interface Representante {
    id: string;
    nome: string;
    cargo?: string;
    telefone?: string;
    escola_id: string;
    createdAt?: string;
    escola?: Escola;

    //client-only
    filtered?: boolean;
}
