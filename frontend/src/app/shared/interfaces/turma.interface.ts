import { Aluno } from "./aluno.interface";
import { Escola } from "./escola.interface";

export interface Turma {
    id: string;
    identificacao: string;
    escola_id: string;
    createdAt?: string;
    alunos?: Aluno[];
    escola?: Escola;

    //client-only
    filtered?: boolean;
}
