export interface AppState {
    loginKey: string;
    customerId: number | null;
    groomerId: number | null;
    email: string;
}

export const INITIAL_STATE: AppState = {
    loginKey: '',
    customerId: null,
    groomerId: null,
    email: ''
}