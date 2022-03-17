import { Observable } from 'rxjs';

export interface User {
    id: string;
    cpf: string;
    name: string;
    address: string;
}

export interface UserService {
    getUser(id: { id: string }): Observable<User>;
}