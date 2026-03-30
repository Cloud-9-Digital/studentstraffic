export function emailBase({
  previewText,
  body,
}: {
  previewText: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <title>Students Traffic</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      -webkit-font-smoothing: antialiased;
      color: #1e293b;
    }

    a { color: #c2410c; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .email-wrapper { width: 100%; background-color: #f1f5f9; padding: 40px 16px; }

    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.06);
    }

    /* ── Header ── */
    .email-header {
      background-color: #c2410c;
      padding: 28px 40px;
      text-align: center;
    }

    /* ── Body ── */
    .email-body { padding: 40px 40px 32px; }

    /* ── Icon circle ── */
    .email-icon {
      width: 56px; height: 56px; border-radius: 50%;
      margin: 0 auto 24px; text-align: center;
      display: table-cell; vertical-align: middle;
    }
    .email-icon-success { background-color: #dcfce7; color: #16a34a; }
    .email-icon-pending { background-color: #fef3c7; color: #d97706; }
    .email-icon-error   { background-color: #fee2e2; color: #dc2626; }
    .email-icon-info    { background-color: #dbeafe; color: #2563eb; }
    .email-icon-brand   { background-color: #fff1ec; color: #c2410c; }

    /* ── Typography ── */
    h1.email-heading {
      font-size: 22px; font-weight: 700; color: #0f172a;
      text-align: center; margin-bottom: 10px;
      letter-spacing: -0.3px; line-height: 1.3;
    }
    p.email-subheading {
      font-size: 15px; color: #64748b; text-align: center;
      line-height: 1.6; margin-bottom: 28px;
    }

    /* ── Info card ── */
    .info-card {
      background-color: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;
    }
    .info-card-title {
      font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: #94a3b8; margin-bottom: 14px;
    }
    .info-label { font-size: 13px; color: #94a3b8; }
    .info-value { font-size: 13px; font-weight: 500; color: #1e293b; }

    /* ── Step ── */
    .step-icon {
      width: 32px; height: 32px; border-radius: 50%;
      background-color: #fff1ec; flex-shrink: 0;
      text-align: center; line-height: 32px;
      display: table-cell; vertical-align: middle;
      color: #c2410c;
    }
    .step-title { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
    .step-desc  { font-size: 13px; color: #64748b; line-height: 1.5; }

    /* ── Buttons ── */
    .btn-primary {
      display: block; width: 100%; padding: 14px 24px;
      background-color: #c2410c; color: #ffffff !important;
      font-size: 15px; font-weight: 600; text-align: center;
      border-radius: 10px; text-decoration: none !important;
      margin-bottom: 12px; letter-spacing: -0.1px;
    }
    .btn-whatsapp {
      display: block; width: 100%; padding: 14px 24px;
      background-color: #25d366; color: #ffffff !important;
      font-size: 15px; font-weight: 600; text-align: center;
      border-radius: 10px; text-decoration: none !important;
      margin-bottom: 12px;
    }
    .btn-secondary {
      display: block; width: 100%; padding: 13px 24px;
      background-color: #ffffff; color: #374151 !important;
      font-size: 14px; font-weight: 500; text-align: center;
      border-radius: 10px; border: 1px solid #e2e8f0;
      text-decoration: none !important;
    }

    /* ── Note box ── */
    .note-box { border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
    .note-box-info  { background-color: #fff1ec; border: 1px solid #fed7aa; color: #9a3412; }
    .note-box-warn  { background-color: #fffbeb; border: 1px solid #fde68a; color: #78350f; }
    .note-box-error { background-color: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; }

    /* ── Divider ── */
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 28px 0; }

    /* ── Footer ── */
    .email-footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center; }
    .email-footer p { font-size: 12px; color: #94a3b8; line-height: 1.7; }
    .email-footer a { color: #64748b; text-decoration: underline; }

    /* ── Mobile ── */
    @media only screen and (max-width: 600px) {
      .email-wrapper  { padding: 20px 12px; }
      .email-header   { padding: 24px 24px; }
      .email-body     { padding: 28px 24px 24px; }
      .email-footer   { padding: 20px 24px; }
      .info-card      { padding: 16px 18px; }
    }

    /* ── Dark mode ── */
    @media (prefers-color-scheme: dark) {
      body,
      .email-wrapper              { background-color: #0f172a !important; }
      .email-container            { background-color: #1e293b !important; box-shadow: none !important; }
      .email-body                 { background-color: #1e293b !important; }
      h1.email-heading            { color: #f1f5f9 !important; }
      p.email-subheading          { color: #94a3b8 !important; }
      .info-card                  { background-color: #0f172a !important; border-color: #334155 !important; }
      .info-card-title            { color: #64748b !important; }
      .info-value                 { color: #e2e8f0 !important; }
      .info-label                 { color: #64748b !important; }
      .step-title                 { color: #f1f5f9 !important; }
      .step-desc                  { color: #94a3b8 !important; }
      .divider                    { border-color: #334155 !important; }
      .email-footer               { background-color: #0f172a !important; border-color: #334155 !important; }
      .email-footer p             { color: #475569 !important; }
      .btn-secondary              { background-color: #1e293b !important; color: #e2e8f0 !important; border-color: #334155 !important; }
      .note-box-info              { background-color: #431407 !important; border-color: #7c2d12 !important; color: #fed7aa !important; }
      .note-box-warn              { background-color: #1c1408 !important; border-color: #78350f !important; color: #fde68a !important; }
      p[style*="color:#475569"],
      p[style*="color: #475569"]  { color: #94a3b8 !important; }
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${previewText}&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;&nbsp;&#8203;&zwnj;
  </div>

  <div class="email-wrapper">
    <div class="email-container">

      <!-- Header -->
      <div class="email-header">
        <img src="https://studentstraffic.com/logo-white.png" alt="Students Traffic" height="36" style="display:block;margin:0 auto;max-height:36px;border:0;" />
      </div>

      <!-- Body -->
      <div class="email-body">
        ${body}
      </div>

      <!-- Footer -->
      <div class="email-footer">
        <p>Students Traffic &mdash; Helping students find the right university guide</p>
        <p style="margin-top:8px;">&copy; ${new Date().getFullYear()} Students Traffic. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

/* ── Reusable SVG icon snippets ─────────────────────────────────────────── */

export const icons = {
  clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  bell: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  user: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
};

/** Renders a centered icon circle */
export function iconCircle(icon: keyof typeof icons, variant: "success" | "pending" | "error" | "info" | "brand" = "brand"): string {
  return `<table width="56" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr><td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;border-radius:50%;" class="email-icon email-icon-${variant}">${icons[icon]}</td></tr></table>`;
}

/** Renders a step row with a small icon circle */
export function stepRow(icon: keyof typeof icons, title: string, desc: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td width="32" valign="top" style="padding-right:14px;">
          <table cellpadding="0" cellspacing="0"><tr><td width="32" height="32" align="center" valign="middle" style="width:32px;height:32px;border-radius:50%;background-color:#fff1ec;color:#c2410c;" class="step-icon">${icons[icon]}</td></tr></table>
        </td>
        <td valign="top">
          <div class="step-title">${title}</div>
          <div class="step-desc">${desc}</div>
        </td>
      </tr>
    </table>`;
}
