
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
      line-height: 1.6;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
      background-color: #050812;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #09090b;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .header {
      background: linear-gradient(to bottom, #0c1120, #09090b);
      padding: 40px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .logo {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 40px 30px;
      text-align: left;
    }
    .footer {
      background: #0c1120;
      padding: 30px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .button {
      display: inline-block;
      padding: 16px 36px;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 800;
      margin-top: 25px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
    }
    h1 {
      margin-top: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    p {
      font-size: 15px;
      color: #94a3b8;
    }
    .accent {
      color: #3b82f6;
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
      <p>&copy; ${new Date().getFullYear()} Beauty of Cloud 2.0. Digital Multiverse Architecture.</p>
      <p>Organizing Committee · University of Sri Jayewardenepura</p>
    </div>
  </div>
</body>
</html>
`;
