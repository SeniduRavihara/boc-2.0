
export const getBaseTemplate = (content: string, baseUrl: string = 'https://www.beautyofcloud.com') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beauty of Cloud 2.0</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
        <img src="${baseUrl}/email-and-header/boc.png" alt="BOC" class="footer-logo">
      </div>
      
      <div class="social-links">
        <a href="https://www.facebook.com/beautyofcloud/"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" class="social-icon" alt="Facebook"></a>
        <a href="https://www.linkedin.com/company/beautyofcloud/"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" class="social-icon" alt="LinkedIn"></a>
        <a href="https://www.instagram.com/beautyofcloud/"><img src="https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg" class="social-icon" alt="Instagram"></a>
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
export const getLightTemplate = (content: string, senderName?: string, baseUrl: string = 'https://www.beautyofcloud.com') => {
  const MEMBER_SIGNATURES: Record<string, { role: string; email: string; phone: string }> = {
    "Shanki Tharusha": {
      role: "Industry Relations Committee",
      email: "shanki.tharusha@beautyofcloud.com",
      phone: "+94 76 346 9070"
    },
    "Chanupa Diwyanjala": {
      role: "Industry Relations Committee",
      email: "chanupa.diwyanjala@beautyofcloud.com",
      phone: "+94 71 791 6464"
    },
    "Senumi Waidyalankara": {
      role: "Industry Relations Committee",
      email: "senumi.waidyalankara@beautyofcloud.com",
      phone: "+94 70 512 5759"
    },
    "Kaushan Munasingha": {
      role: "Industry Relations Committee",
      email: "kaushan.munasingha@beautyofcloud.com",
      phone: "+94 77 067 4146"
    },
    "Kavinya Peiris": {
      role: "Industry Relations Committee",
      email: "kavinya.peiris@beautyofcloud.com",
      phone: "+94 70 140 1144"
    },
    "Bakeerathan Karthigan": {
      role: "Industry Relations Committee",
      email: "bakeerathan.karthigan@beautyofcloud.com",
      phone: "+94 74 077 8329"
    },
    "Wiraji Wijewardana": {
      role: "Industry Relations Committee",
      email: "wiraji.wijewardana@beautyofcloud.com",
      phone: "+94 76 169 5635"
    },
    "Amasha Malindi": {
      role: "Industry Relations Committee",
      email: "amasha.malindi@beautyofcloud.com",
      phone: "+94 71 419 9177"
    },
    "Himasha Ranasooriya": {
      role: "Industry Relations Committee",
      email: "himasha.ranasooriya@beautyofcloud.com",
      phone: "+94 77 929 3054"
    },
    "Inuka Karunasiri": {
      role: "Industry Relations Committee",
      email: "inuka.karunasiri@beautyofcloud.com",
      phone: "+94 74 042 3126"
    },
    "Charutha Palihawadana": {
      role: "Industry Relations Committee",
      email: "charutha.palihawadana@beautyofcloud.com",
      phone: "+94 71 398 7924"
    }
  };

  let signatureHtml = '';
  if (senderName && MEMBER_SIGNATURES[senderName]) {
    const sig = MEMBER_SIGNATURES[senderName];
    const nameParts = senderName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    signatureHtml = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; white-space: normal;"><tr><td style="vertical-align: middle; width: 90px; text-align: center; padding-right: 15px;"><img src="${baseUrl}/email-and-header/boc.png" alt="Beauty of Cloud 2.0" style="width: 75px; height: auto; display: block; margin: 0 auto 4px;" /></td><td style="width: 2px; background-color: #000000; padding: 0; margin: 0; vertical-align: middle;"><div style="width: 2px; height: 68px; background-color: #000000; display: block;"></div></td><td style="vertical-align: middle; padding-left: 15px; text-align: left;"><div style="font-size: 16px; font-weight: 800; color: #2563eb; line-height: 1.1; text-transform: uppercase; margin: 0;">${firstName}</div><div style="font-size: 16px; font-weight: 800; color: #2563eb; line-height: 1.1; text-transform: uppercase; margin: 0 0 2px 0;">${lastName}</div><div style="font-size: 10px; font-weight: 700; font-style: italic; color: #2563eb; margin-bottom: 6px;">${sig.role}</div><table cellpadding="0" cellspacing="0" border="0"><tr style="margin-bottom: 2px;"><td style="vertical-align: middle; padding-right: 5px;"><img src="https://img.icons8.com/ios-filled/50/000000/mail.png" style="width: 10px; height: 10px; display: block;" /></td><td style="vertical-align: middle; font-size: 10px; color: #000000; font-weight: 600; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><a href="mailto:${sig.email}" style="color: #000000; text-decoration: none;">${sig.email}</a></td></tr><tr><td style="vertical-align: middle; padding-right: 5px; padding-top: 2px;"><img src="https://img.icons8.com/ios-filled/50/000000/phone.png" style="width: 10px; height: 10px; display: block;" /></td><td style="vertical-align: middle; font-size: 10px; color: #000000; font-weight: 600; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding-top: 2px;"><a href="tel:${sig.phone.replace(/\s+/g, '')}" style="color: #000000; text-decoration: none;">${sig.phone}</a></td></tr></table></td></tr></table>`;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beauty of Cloud 2.0</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.8;
      color: #334155;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .header {
      background: #ffffff;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 1px solid #000000;
    }
    .logo {
      max-width: 140px;
      height: auto;
    }
    .header-text {
      font-size: 10px;
      font-weight: 800;
      color: #475569;
      margin-top: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .content {
      padding: 35px 40px 15px 40px;
      text-align: left;
      color: #334155;
      font-size: 16px;
      white-space: pre-line;
    }
    .footer {
      background: #ffffff;
      padding: 40px 30px;
      text-align: center;
      color: #475569;
      border-top: 1px solid #000000;
    }
    .footer-logos {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .footer-logo {
      height: 35px;
      width: auto;
      margin: 0 15px;
      vertical-align: middle;
    }
    .social-links {
      margin-bottom: 20px;
    }
    .social-icon {
      width: 28px;
      height: 28px;
      margin: 0 8px;
      vertical-align: middle;
    }
    .footer-text {
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    a {
      color: #2563eb;
      text-decoration: none;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
        <img src="${baseUrl}/email-and-header/boc.png" alt="Beauty of Cloud 2.0" class="logo">
        <div class="header-text">2.0 | Cloud Session | Ideathon</div>
    </div>
    <div class="content">${content}</div>${signatureHtml ? `<div class="signature-container" style="border-top: 1px solid #000000; padding: 20px 40px 15px 40px; background-color: #ffffff;">${signatureHtml}</div>` : ''}
    <div class="footer" style="border-top: 1px solid #000000; padding: 20px 40px; background-color: #ffffff;">
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; white-space: normal;">
        <tr>
          <!-- Left Column: Footer Logos -->
          <td style="vertical-align: middle; text-align: left; width: 65%; white-space: nowrap;">
            <img src="${baseUrl}/email-and-header/ieee-dark.png" alt="IEEE USJ" style="height: 22px; width: auto; margin-right: 12px; vertical-align: middle;" />
            <img src="${baseUrl}/email-and-header/IEEE-CS-dark.png" alt="IEEE CS USJ" style="height: 22px; width: auto; margin-right: 12px; vertical-align: middle;" />
            <img src="${baseUrl}/email-and-header/boc.png" alt="BOC" style="height: 22px; width: auto; vertical-align: middle;" />
          </td>
          
          <!-- Right Column: Reach Us -->
          <td style="vertical-align: middle; text-align: right; width: 35%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="font-size: 14px; font-weight: 700; color: #2563eb; margin-bottom: 8px;">Reach Us</div>
            <div style="margin-bottom: 8px;">
              <a href="https://www.facebook.com/beautyofcloud/" style="margin-left: 8px; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/facebook-new.png" style="width: 24px; height: 24px; vertical-align: middle; border: 0;" alt="Facebook"></a>
              <a href="https://www.tiktok.com/@beautyofcloud" style="margin-left: 8px; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/tiktok--v1.png" style="width: 24px; height: 24px; vertical-align: middle; border: 0;" alt="TikTok"></a>
              <a href="https://www.instagram.com/beautyofcloud/" style="margin-left: 8px; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/instagram-new.png" style="width: 24px; height: 24px; vertical-align: middle; border: 0;" alt="Instagram"></a>
              <a href="https://www.linkedin.com/company/beautyofcloud/" style="margin-left: 8px; text-decoration: none;"><img src="https://img.icons8.com/color/48/000000/linkedin.png" style="width: 24px; height: 24px; vertical-align: middle; border: 0;" alt="LinkedIn"></a>
            </div>
            <div style="font-size: 9px; font-weight: 600; color: #2563eb; line-height: 1.2;">IEEE Computer Society Student Branch Chapter, University of Sri Jayewardenepura</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
`;
};
