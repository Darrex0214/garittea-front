export interface Person {
    id: string;
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