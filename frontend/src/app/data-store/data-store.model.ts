export interface AppState {
    loginKey: string;
    customerId: number | null;
    groomerId: number | null;
    email: string;
    isAdmin: boolean;
}

export const INITIAL_STATE: AppState = {
    loginKey: '',
    isAdmin: false,
    customerId: null,
    groomerId: null,
    email: ''
}