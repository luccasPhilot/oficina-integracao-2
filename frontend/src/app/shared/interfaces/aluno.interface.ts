import { Escola } from "./escola.interface";
import { Turma } from "./turma.interface";

export interface Aluno {
    id: string;
    nome: string;
    idade?: number;
    turma_id: string;
    createdAt?: string;
    turma?: Turma;
    escola_id?: string;
    escola?: Escola

    //client-only
    filtered?: boolean;
}
