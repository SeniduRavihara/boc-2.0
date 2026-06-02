const BOC_EMAIL_SIGNATURE = `Best regards,
Waruna Udara and Kavindu Nimesha
Co-Chairs — Beauty of Cloud 2.0
Senindu Ravihara
Programming Committee Head
IEEE CS Chapter USJ`;

export const FLYER_CAMPAIGN_SUBJECT =
  "Create your Beauty of Cloud 2.0 flyer";

const DEFAULT_SITE_URL = "https://www.beautyofcloud.com";

export const UNCUT_SANS_FONT_FAMILY = "'Uncut Sans', Arial, Helvetica, sans-serif";

export const FLYER_EMAIL_FONT_FAMILY = UNCUT_SANS_FONT_FAMILY;

function getUncutSansFontFace(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
  return `
    @font-face {
      font-family: 'Uncut Sans';
      src: url('${base}/UncutSans-Variable.ttf') format('truetype');
      font-weight: 100 900;
      font-style: normal;
    }
  `;
}

function usesUncutSans(fontFamily: string): boolean {
  return fontFamily.includes("Uncut Sans");
}

/** Inner content for flyer campaign emails (wrapped by getBaseTemplate in sendMail). */
export const getFlyerCampaignTemplate = (
  name: string,
  teamName: string,
  flyerUrl: string
) => {
  const safeName = name || "Participant";
  const safeTeam = teamName || "your team";

  return `Dear ${safeName},

Your team "${safeTeam}" is registered for Beauty of Cloud 2.0. Create and download your personalized event flyer using the link below — your team and name will already be selected when you open it.

<div class="cta-wrap">
  <a href="${flyerUrl}" class="button">Open Flyer Generator</a>
</div>

Or copy this link:
${flyerUrl}

${BOC_EMAIL_SIGNATURE}`;
};

const DEFAULT_EMAIL_FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const getBaseTemplate = (
  content: string,
  baseUrl: string = 'https://www.beautyofcloud.com',
  options?: { fontFamily?: string }
) => {
  const fontFamily = options?.fontFamily ?? DEFAULT_EMAIL_FONT_FAMILY;
  const isBocCampaign = usesUncutSans(fontFamily);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beauty of Cloud 2.0</title>
  <style>
    ${usesUncutSans(fontFamily) ? getUncutSansFontFace() : ""}
    body {
      font-family: ${fontFamily};
      line-height: 1.8;
      color: #94a3b8;
      margin: 0;
      padding: 0;
      background-color: #020617;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #0f172a;
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 50px 100px rgba(0,0,0,0.8);
    }
    .header {
      background: radial-gradient(circle at top right, #1e40af 0%, #020617 80%);
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .logo {
      max-width: 140px;
      height: auto;
    }
    .content {
      padding: 35px 40px;
      text-align: left;
      color: #f1f5f9;
      font-size: 16px;
      white-space: pre-line;
    }
    .footer {
      background: #020617;
      padding: 40px 30px;
      text-align: center;
      color: #475569;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-logos {
      margin-bottom: 35px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-logo {
      height: 32px;
      width: auto;
      margin: 0 18px;
      vertical-align: middle;
      opacity: 0.5;
      filter: grayscale(100%);
    }
    .social-links {
      margin-bottom: 30px;
    }
    .social-icon {
      width: 28px;
      height: 28px;
      margin: 0 12px;
      vertical-align: middle;
      opacity: 0.6;
    }
    .footer-text {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-weight: 800;
      color: #334155;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    .voucher-code {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      color: #60a5fa;
      font-family: monospace;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    .cta-wrap {
      text-align: center;
      margin: 28px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 36px;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
        <img src="${baseUrl}/email-and-header/boc.png" alt="Beauty of Cloud 2.0" class="logo">
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <div class="footer-logos">
        <img src="${baseUrl}/email-and-header/ieee.png" alt="IEEE USJ" class="footer-logo">
        <img src="${baseUrl}/email-and-header/IEEE-CS.png" alt="IEEE CS USJ" class="footer-logo">
        ${isBocCampaign ? `<img src="${baseUrl}/email-and-header/boc.png" alt="BOC" class="footer-logo">` : ""}
      </div>
      
      <div class="social-links">
        ${isBocCampaign ? `
          <a href="https://www.facebook.com/beautyofcloud/"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" class="social-icon" alt="Facebook"></a>
          <a href="https://www.linkedin.com/company/beautyofcloud/"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" class="social-icon" alt="LinkedIn"></a>
          <a href="https://www.instagram.com/beautyofcloud/"><img src="https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg" class="social-icon" alt="Instagram"></a>
        ` : `
          <a href="https://web.facebook.com/profile.php?id=61568293116395"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" class="social-icon" alt="Facebook"></a>
          <a href="https://www.linkedin.com/company/ieee-cs-student-branch-chapter-university-of-sri-jayewardenepura/"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" class="social-icon" alt="LinkedIn"></a>
          <a href="https://www.instagram.com/ieee_usj_cs/"><img src="https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg" class="social-icon" alt="Instagram"></a>
        `}
      </div>

      <div class="footer-text">
        <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Beauty of Cloud 2.0</p>
        <p style="margin: 0;">Organizing Committee · University of Sri Jayewardenepura</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

export interface MemberInfo {
  role: string;
  email: string;
  phone: string;
  privateEmail: string;
}

export const MEMBER_SIGNATURES: Record<string, MemberInfo> = {
  "Shanki Tharusha": {
    role: "Industry Relations Committee Head",
    email: "shanki.tharusha@beautyofcloud.com",
    phone: "+94 76 346 9070",
    privateEmail: "shankitharu@gmail.com"
  },
  "Chanupa Diwyanjala": {
    role: "Industry Relations Committee",
    email: "chanupa.diwyanjala@beautyofcloud.com",
    phone: "+94 71 791 6464",
    privateEmail: "chanupadiw@gmail.com"
  },
  "Senumi Waidyalankara": {
    role: "Industry Relations Committee",
    email: "senumi.waidyalankara@beautyofcloud.com",
    phone: "+94 70 512 5759",
    privateEmail: "amayawaid@gmail.com"
  },
  "Kaushan Munasingha": {
    role: "Industry Relations Committee",
    email: "kaushan.munasingha@beautyofcloud.com",
    phone: "+94 77 067 4146",
    privateEmail: "k.h.s.ucoders03@gmail.com"
  },
  "Kavinya Peiris": {
    role: "Industry Relations Committee",
    email: "kavinya.peiris@beautyofcloud.com",
    phone: "+94 70 140 1144",
    privateEmail: "kavinyapeiris99@gmail.com"
  },
  "Bakeerathan Karthigan": {
    role: "Industry Relations Committee",
    email: "bakeerathan.karthigan@beautyofcloud.com",
    phone: "+94 74 077 8329",
    privateEmail: "bakeekarthigan@gmail.com"
  },
  "Wiraji Wijewardana": {
    role: "Industry Relations Committee",
    email: "wiraji.wijewardana@beautyofcloud.com",
    phone: "+94 76 169 5635",
    privateEmail: "wirajiwijewardana@gmail.com"
  },
  "Amasha Malindi": {
    role: "Industry Relations Committee",
    email: "amasha.malindi@beautyofcloud.com",
    phone: "+94 71 419 9177",
    privateEmail: "malindiamasha@gmail.com"
  },
  "Himasha Ranasooriya": {
    role: "Industry Relations Committee",
    email: "himasha.ranasooriya@beautyofcloud.com",
    phone: "+94 77 929 3054",
    privateEmail: "himasharanasooriya@gmail.com"
  },
  "Inuka Karunasiri": {
    role: "Industry Relations Committee",
    email: "inuka.karunasiri@beautyofcloud.com",
    phone: "+94 74 042 3126",
    privateEmail: "vimuthinuka@gmail.com"
  },
  "Charutha Palihawadana": {
    role: "Industry Relations Committee",
    email: "charutha.palihawadana@beautyofcloud.com",
    phone: "+94 71 398 7924",
    privateEmail: "palihawadanacharutha@gmail.com"
  }
};

export const getLightTemplate = (
  content: string,
  senderName?: string,
  baseUrl: string = 'https://www.beautyofcloud.com'
) => {
  let signatureHtml = '';
  if (senderName && MEMBER_SIGNATURES[senderName]) {
    const sig = MEMBER_SIGNATURES[senderName];

    signatureHtml = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Uncut Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; white-space: normal;"><tr><td style="vertical-align: middle; width: 90px; text-align: center; padding-right: 15px;"><img src="${baseUrl}/email-and-header/boc.png" alt="Beauty of Cloud 2.0" style="width: 75px; height: auto; display: block; margin: 0 auto 4px;" /></td><td style="width: 2px; background-color: #000000; padding: 0; margin: 0; vertical-align: middle;"><div style="width: 2px; height: 68px; background-color: #000000; display: block;"></div></td><td style="vertical-align: middle; padding-left: 15px; text-align: left;"><div style="font-family: 'Uncut Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 700; color: #1e293b; line-height: 1.2; text-transform: uppercase; margin: 0 0 2px 0; letter-spacing: 0.05em; white-space: nowrap;">${senderName}</div><div style="font-size: 10px; font-weight: 700; font-style: italic; color: #2563eb; margin-bottom: 6px;">${sig.role}</div><table cellpadding="0" cellspacing="0" border="0"><tr style="margin-bottom: 2px;"><td style="vertical-align: middle; padding-right: 5px;"><img src="https://img.icons8.com/ios-filled/50/000000/mail.png" style="width: 10px; height: 10px; display: block;" /></td><td style="vertical-align: middle; font-size: 10px; color: #000000; font-weight: 600; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><a href="mailto:${sig.email}" style="color: #000000; text-decoration: none;">${sig.email}</a></td></tr><tr><td style="vertical-align: middle; padding-right: 5px; padding-top: 2px;"><img src="https://img.icons8.com/ios-filled/50/000000/phone.png" style="width: 10px; height: 10px; display: block;" /></td><td style="vertical-align: middle; font-size: 10px; color: #000000; font-weight: 600; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding-top: 2px;"><a href="tel:${sig.phone.replace(/\s+/g, '')}" style="color: #000000; text-decoration: none;">${sig.phone}</a></td></tr></table></td></tr></table>`;
  }

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <!--[if !mso]>-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--<![endif]-->
  <meta name="x-apple-disable-message-reformatting" content="" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <style type="text/css">
    table {
      border-collapse: separate;
      table-layout: fixed;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt
    }
    table td {
      border-collapse: collapse
    }
    body, a, li, p, h1, h2, h3 {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    body {
      min-width: 100%;
      Margin: 0px;
      padding: 0px;
    }
    img {
      Margin: 0;
      padding: 0;
      -ms-interpolation-mode: bicubic
    }
    h1, h2, h3, p, a {
      line-height: inherit;
      overflow-wrap: normal;
      white-space: normal;
      word-break: break-word
    }
    a {
      text-decoration: none;
      color: #2563eb;
    }
    .content {
      padding: 35px 50px 15px 50px;
      text-align: left;
      color: #333333;
      font-size: 14px;
      font-family: 'Roboto', 'Inter', sans-serif;
      line-height: 22px;
      white-space: pre-line;
    }
    .voucher-code {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(37, 99, 235, 0.1);
      border: 1px solid rgba(37, 99, 235, 0.2);
      border-radius: 12px;
      color: #2563eb;
      font-family: monospace;
      font-weight: bold;
      font-size: 18px;
      margin: 20px 0;
    }
    @media (max-width: 480px) {
      .t140 { padding-left: 30px !important; padding-right: 30px !important; }
      .content { padding-left: 30px !important; padding-right: 30px !important; }
    }
  </style>
  <!--[if !mso]>-->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;0,800;1,400&display=swap" rel="stylesheet" type="text/css" />
  <!--<![endif]-->
</head>
<body id="body" style="min-width:100%;Margin:0px;padding:0px;background-color:#f8fafc;">
  <div style="background-color:#f8fafc; padding: 45px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td valign="top" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; Margin-left:auto; Margin-right:auto; border: 1px solid #cbd5e1; border-radius: 8px; border-collapse: separate;">
            <tr>
              <td class="t140" style="background: radial-gradient(circle at 0% -10%, #0b3c8f 0%, #000000 42%); padding: 30px 20px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #cbd5e1;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
                  <tr>
                    <td style="padding: 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tr>
                          <!-- Logo 1: BOC (Left) -->
                          <td width="120" valign="middle" style="width: 120px; text-align: left; vertical-align: middle;">
                            <img src="${baseUrl}/email-and-header/boc.png" width="120" alt="BOC 2.0" style="display:block; border:0; height:auto; max-width:120px;" />
                          </td>
                          <!-- Logo 2: IEEE USJ (Middle) -->
                          <td valign="middle" style="text-align: center; vertical-align: middle; padding: 0 10px;">
                            <img src="${baseUrl}/email-and-header/ieee.png" width="250" alt="IEEE USJ" style="display:inline-block; border:0; height:auto; max-width:250px; vertical-align: middle;" />
                          </td>
                          <!-- Logo 3: IEEE CS USJ (Right) -->
                          <td width="115" valign="middle" style="width: 115px; text-align: right; vertical-align: middle;">
                            <img src="${baseUrl}/email-and-header/IEEE-CS.png" width="105" alt="IEEE CS USJ" style="display:block; border:0; height:auto; max-width:105px; margin-left: auto;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Content Block -->
            <tr>
              <td style="background-color:#F8F8F8;">
                <div class="content">${content}</div>
                ${signatureHtml ? `<div style="padding: 20px 50px 30px 50px; background-color:#F8F8F8;">${signatureHtml}</div>` : ''}
              </td>
            </tr>
            <!-- Footer Block -->
            <tr>
              <td style="background-color:#F8F8F8; padding: 40px 50px; border-radius: 0 0 8px 8px; border-top: 1px solid #cbd5e1;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
                  <!-- Contact Us Title -->
                  <tr>
                    <td style="padding: 0 0 8px 0; text-align: center;">
                      <p style="margin:0; font-family: Roboto, sans-serif; line-height:22px; font-weight:800; font-size:18px; color:#333333;">Contact Us</p>
                    </td>
                  </tr>
                  <!-- Contacts Grid -->
                  <tr>
                    <td style="border-bottom:1px solid #cbd5e1; padding: 0 0 30px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                        <tr>
                          <!-- Contact 1 -->
                          <td width="33.33%" valign="top" style="text-align: center; font-family: Roboto, sans-serif; font-size: 12px; color: #333333; line-height: 18px;">
                            <span style="font-weight: 700;">Waruna Udara</span><br/>
                            <span style="font-style: italic; color: #64748b;">Project Co-Chair</span><br/>
                            <span style="font-style: italic; color: #64748b;">+94 70 174 3074</span>
                          </td>
                          <!-- Contact 2 -->
                          <td width="33.33%" valign="top" style="text-align: center; font-family: Roboto, sans-serif; font-size: 12px; color: #333333; line-height: 18px;">
                            <span style="font-weight: 700;">Nimesha Rathnayake</span><br/>
                            <span style="font-style: italic; color: #64748b;">Project Co-Chair</span><br/>
                            <span style="font-style: italic; color: #64748b;">+94 77 488 8701</span>
                          </td>
                          <!-- Contact 3 -->
                          <td width="33.33%" valign="top" style="text-align: center; font-family: Roboto, sans-serif; font-size: 12px; color: #333333; line-height: 18px;">
                            <span style="font-weight: 700;">Shanki Tharusha</span><br/>
                            <span style="font-style: italic; color: #64748b;">Industry Relations Head</span><br/>
                            <span style="font-style: italic; color: #64748b;">+94 76 346 9070</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Social Platform Title -->
                  <tr>
                    <td style="padding: 20px 0 0 0; text-align: center;">
                      <p style="margin:0; font-family: Roboto, sans-serif; line-height:22px; font-weight:800; font-size:16px; color:#64748b;">Reach out through social platforms</p>
                    </td>
                  </tr>
                  <!-- Social Links -->
                  <tr>
                    <td style="padding: 10px 0 30px 0; text-align: center;">
                      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                        <tr>
                          <td style="padding: 0 10px;">
                            <a href="https://www.linkedin.com/company/ieee-cs-student-branch-chapter-university-of-sri-jayewardenepura/" target="_blank">
                              <img src="https://img.icons8.com/color/48/000000/linkedin.png" width="30" height="30" alt="LinkedIn" style="display:block; border:0;" />
                            </a>
                          </td>
                          <td style="padding: 0 10px;">
                            <a href="https://web.facebook.com/profile.php?id=61568293116395" target="_blank">
                              <img src="https://img.icons8.com/color/48/000000/facebook-new.png" width="30" height="30" alt="Facebook" style="display:block; border:0;" />
                            </a>
                          </td>
                          <td style="padding: 0 10px;">
                            <a href="https://www.instagram.com/ieee_usj_cs/" target="_blank">
                              <img src="https://img.icons8.com/color/48/000000/instagram-new.png" width="30" height="30" alt="Instagram" style="display:block; border:0;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Copyright / Organizer text -->
                  <tr>
                    <td style="text-align: center; font-family: Roboto, sans-serif; font-size: 12px; color: #475569; line-height: 18px;">
                      <p style="margin: 0 0 4px 0;">&copy;2026 Beauty of Cloud 2.0</p>
                      <p style="margin: 0 0 2px 0;">IEEE Computer Society Student Branch Chapter</p>
                      <p style="margin: 0;">University of Sri Jayewardenepura</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};
