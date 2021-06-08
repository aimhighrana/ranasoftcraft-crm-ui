export interface Email {
    subject: string;
    message: string;
    to: string[];
}

export interface EmailTemplate {
    templateName: string
    subject: string;
    message: string;
}