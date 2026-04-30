
export const getBaseTemplate = (content: string) => `
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
        <img src="https://www.beautyofcloud.com/email-and-header/boc.png" alt="Beauty of Cloud 2.0" class="logo">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <div class="footer-logos">
        <img src="https://www.beautyofcloud.com/email-and-header/ieee.png" alt="IEEE USJ" class="footer-logo">
        <img src="https://www.beautyofcloud.com/email-and-header/IEEE-CS.png" alt="IEEE CS USJ" class="footer-logo">
        <img src="https://www.beautyofcloud.com/email-and-header/boc.png" alt="BOC" class="footer-logo">
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
