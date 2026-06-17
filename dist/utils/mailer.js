'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendEmail = void 0;
const common_1 = require('@nestjs/common');
const postmark = require('postmark');
async function sendEmail(data) {
  const serverToken = process.env.POSTMARK_SERVER_TOKEN;
  const client = new postmark.ServerClient(serverToken);
  if (process.env.NODE_ENV === 'development') {
    common_1.Logger.log(
      `Sending email to: ${data.to}#Subject:${data.subject}#Message: ${data.html}`,
    );
    return;
  }
  const emailResponse = await client.sendEmail({
    From: process.env.EMAIL_SENDER,
    To: data.to,
    Subject: data.subject,
    HtmlBody: data.html,
    MessageStream: process.env.POSTMARK_MESSAGE_STREAM,
  });
  common_1.Logger.log(
    `Sending email. Response to: ${emailResponse.To}. Message: ${emailResponse.Message}`,
  );
  return emailResponse.MessageID;
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailer.js.map
