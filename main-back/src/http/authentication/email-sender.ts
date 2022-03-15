export type EmailSender = {
  sendEmail: (message: string, email: string) => Promise<void>;
};
