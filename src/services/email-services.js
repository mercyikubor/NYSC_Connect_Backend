import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email service configuration error:", error);
  } else {
    console.log("Email service is ready to deliver secure messages");
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfuly sent to [${to}]. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email failed to deliver to [${to}]:`, error);
    return { success: false, error: error.message };
  }
};

export const sendOnboardingOtpEmail = async (
  userEmail,
  userName,
  otpCode,
  role,
) => {
  const subject = `${otpCode} is your NYSC Connect Verification Code`;

  let roleSpecificContent = "";

  if (role === "Corps_members") {
    roleSpecificContent = `
        <p>Welcome to the community! As a <strong>Corps Member</strong>, Verifying your email is the first step to unlocking your LGA network, verified roommates, secure accommodation listings, and local business near you.
        </p>`;
  } else if (role === "Business") {
    roleSpecificContent = `
        <p>Welcome to NYSC Connect Marketplace! As a <strong>Business Vendor</strong>, verifying your email lets you list your store profile, manage your opening status, and stream your service on the local map of thousands of deployed corps members.
        </p>`;
  } else if (role === "Landlords") {
    roleSpecificContent = `
        <p>Welcome to NYSC Connect! As a <strong>Property Owner/Landlord</strong>, verifying your email allows you to list your apartments, connect with verified Corps Members looking for flatmates, and securely manage agreements without predatory agent fees.
        </p>`;
  } else {
    roleSpecificContent = `
        <p>Thank you for starting your registration on NYSC Connect. Verify your email with the verification code below
        </p>`;
  }

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius:
    8px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2e7d32; margin: 0;">NYSC Connect</h2>
        </div>
            <h3 style="color: #333333;">Verify Your Email Address</h3>
                <p>Hello ${userName},</p>
                
            <div style="color: #555555; line-height: 1.6; margin-bottom: 20px;">
                ${roleSpecificContent}
            </div>
                
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 25px 0; border-radius: 6px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1b5e20;">${otpCode}</span>
            </div>
                
            <p style="color: #666666; font-size: 14px;">This security code is highly sensitive and will expire in 10 minutes. Do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;">
            <small style="color: #888888; display: block; text-align: center;">Connecting Corps Members with Local Economies.</small>
            </div>
    `;
  return await sendEmail(userEmail, subject, htmlContent);
};

export const sendPasswordResetOtpEmail = async (
  userEmail,
  userName,
  otpCode,
) => {
  const subject = `${otpCode} is your NYSC Connect Password Reset Code`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2e7d32; margin: 0;">NYSC Connect</h2>
        </div>

        <h3 style="color: #333333;">Reset Your Password</h3>

        <p>Hello ${userName},</p>

        <p style="color: #555555; line-height: 1.6;">
            We received a request to reset your NYSC Connect account password.
            Use the verification code below to continue.
        </p>

        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 25px 0; border-radius: 6px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1b5e20;">
                ${otpCode}
            </span>
        </div>
        <p style="color: #666666; font-size: 14px;">
            This code will expire in 10 minutes. If you did not request a password reset,
            please ignore this email and your password will remain unchanged.
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;">
        <small style="color: #888888; display: block; text-align: center;">
            Connecting Corps Members with Local Economies.
        </small>
    </div>
  `;

  return await sendEmail(userEmail, subject, htmlContent);
};

export const sendNyscWelcomeEmail = async (userEmail, userName, lgaName) => {
  const subject = "NYSC Verification Successful! Welcome to NYSC Connect";
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2e7d32;">Hello ${userName},</h2>
            <p>Great news! Your official NYSC Call-Up letter has been parsed and successfully verified by our automated system.</p>
            <div style="background-color: #f1f8e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <strong>Your Verified Deployment Location:</strong><br>
                Local Government Area (LGA): <strong>${lgaName}</strong>
            </div>
            <p>You have now unlocked complete access to our localized platform dashboards:</p>
            <ul>
                <li>Join the verified <strong>#${lgaName}-LGA-Corpers</strong> community chat rooms.</li>
                <li>Browse affordable accommodation and find vetted roommates inside your deployment zone.</li>
                <li>Discover operational local businesses, food hubs, and supermarkets near your PPA.</li>
            </ul>
            <p style="margin-top: 30px;">Stay safe and have an amazing service year!</p>
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <small style="color: #888888;">This is an automated notification from NYSC Connect.</small>
        </div>
    `;

  return await sendEmail(userEmail, subject, htmlContent);
};

export const sendBusinessApprovalEmail = async (vendorEmail, businessName) => {
  const subject = "Your Business Marketplace is Live!";
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1565c0;">Congratulations!</h2>
            <p>Your business store profile, <strong>${businessName}</strong>, has been successfully registered on the NYSC Connect network map.</p>
            <p>Serving Corps Members deployed in your immediate vicinity can now discover your services and shop locations directly from their device.</p>
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <small style="color: #888888;">NYSC Connect Marketplace Support Team.</small>
    </div>
    `;

  return await sendEmail(vendorEmail, subject, htmlContent);
};
