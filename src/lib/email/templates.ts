
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
      color: #334155;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 50px rgba(0,0,0,0.05);
    }
    .header {
      background: radial-gradient(circle at top, #1e40af 0%, #020617 70%);
      padding: 35px 20px;
      text-align: center;
      border-bottom: 4px solid #1e40af;
    }
    .logo {
      max-width: 200px;
      height: auto;
    }
    .content {
      padding: 40px 35px;
      text-align: left;
      color: #1e293b;
      font-size: 16px;
      white-space: pre-line;
    }
    .footer {
      background: radial-gradient(circle at bottom, #1e40af 0%, #020617 70%);
      padding: 50px 30px;
      text-align: center;
      color: #94a3b8;
      border-top: 4px solid #1e40af;
    }
    .footer-logos {
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-logo {
      height: 35px;
      width: auto;
      margin: 0 15px;
      vertical-align: middle;
      opacity: 0.8;
    }
    .social-links {
      margin-bottom: 25px;
    }
    .social-icon {
      width: 32px;
      height: 32px;
      margin: 0 10px;
      vertical-align: middle;
    }
    .footer-text {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 900;
      color: #64748b;
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
        <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Beauty of Cloud 2.0</p>
        <p style="margin: 0;">Organizing Committee · University of Sri Jayewardenepura</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
