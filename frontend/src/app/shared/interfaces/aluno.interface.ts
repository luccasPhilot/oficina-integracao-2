import { Turma } from "./turma.interface";

export interface Aluno {
    id: string;
    nome: string;
    idade?: number;
    turma_id: string;
    createdAt?: string;
    turma?: Turma;

    //client-only
    filtered?: boolean;
}
