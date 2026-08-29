import "server-only";

/**
 * Optional outbound notification for new form submissions. No-ops silently
 * when SMTP isn't configured — the Submission row in Postgres is always the
 * source of truth, so a missing/failing mail step never loses a lead.
 */
export async function sendSubmissionNotification(params: {
  type: string;
  name: string;
  email: string;
  message?: string | null;
}): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.NOTIFY_EMAIL_TO) return;

  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    await transport.sendMail({
      from: process.env.SMTP_USER || "no-reply@retouchafrica.org",
      to: process.env.NOTIFY_EMAIL_TO,
      subject: `New ${params.type} submission — ${params.name}`,
      text: `Name: ${params.name}\nEmail: ${params.email}\n\n${params.message ?? ""}`,
    });
  } catch (error) {
    console.error("Failed to send submission notification email:", error);
  }
}
