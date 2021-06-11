export interface Email {
    subject: string;
    message: string;
    to: string[];
}

export interface EmailTemplate {
    _id: string
    desc: string
}

export interface EmailTemplateBody {
  emailSub: string,
  subType: string,
  emailText: string
}