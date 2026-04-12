import nodemailer from 'nodemailer';

const createTransport = () => {
  const user = process.env.BREVO_USER;
  const pass = process.env.BREVO_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host:   'smtp-relay.brevo.com',
    port:   587,
    secure: false,
    auth:   { user, pass },
    connectionTimeout: 10000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });
};

let _transporter = null;
const getTransport = () => {
  if (!_transporter) _transporter = createTransport();
  return _transporter;
};

const FROM = process.env.BREVO_FROM || '"FinSight" <' + process.env.BREVO_USER + '>';

export const sendOtp = async (to, name, otp, mode) => {
  const t = getTransport();
  if (!t) {
    console.log('[OTP DEV] ' + to + ' code: ' + otp);
    return;
  }
  const sub  = mode === 'login' ? 'FinSight Login Code' : 'FinSight - Verify Email';
  const body = mode === 'login' ? 'Your one-time login code:' : 'Verify your email with this code:';
  await t.sendMail({
    from: FROM,
    to,
    subject: sub,
    html: `<div style="font-family:Arial;max-width:460px;margin:auto;padding:28px;background:#f9f9f9;border-radius:12px">
<h2 style="color:#0f172a">Hi ${name}!</h2>
<p style="color:#475569">${body}</p>
<div style="font-size:36px;font-weight:900;letter-spacing:10px;color:#22c55e;text-align:center;background:#f0fdf4;border-radius:8px;padding:18px;margin:16px 0">${otp}</div>
<p style="color:#94a3b8;font-size:12px">Expires in 10 minutes. Do not share this code.</p>
</div>`,
  });
};

export const sendResetEmail = async (to, name, token) => {
  const t = getTransport();
  const url = (process.env.CLIENT_URL || 'http://localhost:5173') + '/reset-password?token=' + token;
  if (!t) {
    console.log('[RESET DEV] ' + to + ' url: ' + url);
    return;
  }
  await t.sendMail({
    from: FROM,
    to,
    subject: 'FinSight - Reset Your Password',
    html: `<div style="font-family:Arial;max-width:460px;margin:auto;padding:28px;background:#f9f9f9;border-radius:12px">
<h2 style="color:#0f172a">Hi ${name}!</h2>
<p style="color:#475569">Click the button below to reset your password. This link expires in 1 hour.</p>
<a href="${url}" style="display:block;margin:20px 0;padding:14px 24px;background:#22c55e;color:#fff;text-decoration:none;border-radius:8px;text-align:center;font-weight:700;font-size:15px">Reset Password</a>
<p style="color:#94a3b8;font-size:12px">If you did not request this, ignore this email.</p>
</div>`,
  });
};