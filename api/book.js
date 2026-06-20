// api/book.js — RVP Engineering Services booking handler
// Features: confirmation email to client, notification to RVP, Google Sheets log, .ics calendar invite

import nodemailer from "nodemailer";
import { google } from "googleapis";

// ─── Google Sheets helper ───────────────────────────────────────────────────

async function logToSheet(booking) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const now = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Bookings!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        now,
        booking.name,
        booking.email,
        booking.phone || "",
        booking.service,
        booking.date,
        booking.time,
        booking.message || "",
      ]],
    },
  });
}

// ─── .ics calendar invite builder ──────────────────────────────────────────

function buildICS(booking) {
  const dateStr = booking.date.replace(/-/g, "");

  let hour = 9, minute = 0;
  const timeMatch = booking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
    const meridiem = (timeMatch[3] || "").toUpperCase();
    if (meridiem === "PM" && hour < 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const dtStart = `${dateStr}T${pad(hour)}${pad(minute)}00`;
  const dtEnd   = `${dateStr}T${pad(hour + 1)}${pad(minute)}00`;

  const uid = `rvp-${Date.now()}@rvpengineering.us`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RVP Engineering Services//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=America/Los_Angeles:${dtStart}`,
    `DTEND;TZID=America/Los_Angeles:${dtEnd}`,
    `SUMMARY:Consultation – RVP Engineering Services`,
    `DESCRIPTION:Booking for ${booking.name}\\nService: ${booking.service}\\nContact: ${booking.email}`,
    `ORGANIZER;CN=RVP Engineering Services:mailto:info@rvpengineering.us`,
    `ATTENDEE;CN=${booking.name};RSVP=TRUE:mailto:${booking.email}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// ─── Email templates ────────────────────────────────────────────────────────

function clientEmailHTML(booking) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; color: #1B2A4A; background: #f9f9f9; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-top: 4px solid #2B5797; padding: 36px 40px; }
    h1 { font-size: 22px; margin: 0 0 4px; color: #1B2A4A; }
    .sub { color: #2B5797; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; }
    td:first-child { color: #555; width: 130px; }
    .footer { font-size: 12px; color: #999; margin-top: 32px; }
    a { color: #2B5797; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>Booking Confirmed</h1>
    <div class="sub">RVP Engineering Services</div>
    <p>Hi ${booking.name},</p>
    <p>Thank you for reaching out. Your consultation request has been received and is being reviewed. You'll hear back within 1 business day to confirm timing.</p>
    <table>
      <tr><td>Service</td><td>${booking.service}</td></tr>
      <tr><td>Date Requested</td><td>${booking.date}</td></tr>
      <tr><td>Time Requested</td><td>${booking.time}</td></tr>
      ${booking.message ? `<tr><td>Notes</td><td>${booking.message}</td></tr>` : ""}
    </table>
    <p>A calendar invite is attached — you can add it to your calendar now, and we'll confirm or adjust the time as needed.</p>
    <p>Questions? Reply to this email or reach us at <a href="mailto:info@rvpengineering.us">info@rvpengineering.us</a>.</p>
    <div class="footer">
      RVP Engineering Services &nbsp;·&nbsp; Preconstruction &amp; Estimation &nbsp;·&nbsp; <a href="https://book.rvpengineering.us">book.rvpengineering.us</a>
    </div>
  </div>
</body>
</html>`;
}

function notifyEmailHTML(booking) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1B2A4A; background: #f4f4f4; margin: 0; padding: 0; }
    .wrapper { max-width: 500px; margin: 32px auto; background: #fff; border-top: 4px solid #1B2A4A; padding: 28px 32px; }
    h2 { margin: 0 0 20px; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 9px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    td:first-child { color: #666; width: 120px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>New Booking — RVP Engineering</h2>
    <table>
      <tr><td>Name</td><td>${booking.name}</td></tr>
      <tr><td>Email</td><td>${booking.email}</td></tr>
      <tr><td>Phone</td><td>${booking.phone || "—"}</td></tr>
      <tr><td>Service</td><td>${booking.service}</td></tr>
      <tr><td>Date</td><td>${booking.date}</td></tr>
      <tr><td>Time</td><td>${booking.time}</td></tr>
      ${booking.message ? `<tr><td>Notes</td><td>${booking.message}</td></tr>` : ""}
    </table>
  </div>
</body>
</html>`;
}

// ─── Main handler ───────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const booking = req.body;
  const required = ["name", "email", "service", "date", "time"];
  for (const field of required) {
    if (!booking[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  const results = { email: false, sheet: false };

  // ── 1. Send emails ──────────────────────────────────────────────────────
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const icsContent = buildICS(booking);
    const icsAttachment = {
      filename: "consultation.ics",
      content: icsContent,
      contentType: "text/calendar; charset=utf-8; method=REQUEST",
    };

    // Confirmation to client
    await transporter.sendMail({
      from: `"RVP Engineering Services" <${process.env.GMAIL_USER}>`,
      to: booking.email,
      subject: `Booking Received – ${booking.service} on ${booking.date}`,
      html: clientEmailHTML(booking),
      attachments: [icsAttachment],
    });

    // Notification to RVP
    await transporter.sendMail({
      from: `"RVP Booking System" <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFY_TO || "info@rvpengineering.us",
      subject: `New Booking: ${booking.name} – ${booking.service}`,
      html: notifyEmailHTML(booking),
      attachments: [icsAttachment],
    });

    results.email = true;
  } catch (err) {
    console.error("Email error:", err.message);
  }

  // ── 2. Log to Google Sheets ─────────────────────────────────────────────
  try {
    if (
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
    ) {
      await logToSheet(booking);
      results.sheet = true;
    } else {
      console.warn("Google Sheets env vars not set — skipping log.");
    }
  } catch (err) {
    console.error("Sheets error:", err.message);
  }

  // Always return 200 so the client UI confirms the booking
  return res.status(200).json({
    success: true,
    emailSent: results.email,
    sheetLogged: results.sheet,
  });
}
