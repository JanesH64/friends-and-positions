export interface DvDialogConfig {
    buttons: Button[]
    message: string
    title: string
}

export interface Button {
    text: string;
    action: () => void;
    disabled: boolean;
}