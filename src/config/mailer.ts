import nodemailer from "nodemailer";
import { ENV } from "./env";

const mailerEnabled =
  Boolean(ENV.SMTP_HOST) &&
  Boolean(ENV.SMTP_PORT) &&
  Boolean(ENV.SMTP_USER) &&
  Boolean(ENV.SMTP_PASS);

const transporter = mailerEnabled
  ? nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: Number(ENV.SMTP_PORT),
      secure: Number(ENV.SMTP_PORT) === 465,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    })
  : null;

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!transporter) return;

  await transporter.sendMail({
    from: ENV.SMTP_FROM || ENV.SMTP_USER,
    ...options,
  });
}

export { mailerEnabled };
