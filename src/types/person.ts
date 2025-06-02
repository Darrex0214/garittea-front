export interface Person {
    id: number; // Cambiamos de string a number
    firstname: string;
    lastname: string;
    cellphone: string;
    email: string;
    faculty: Array<{
        id: number;
        name: string;
        phone: string;
    }>;
}