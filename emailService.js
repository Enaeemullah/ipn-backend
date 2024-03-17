const nodemailer = require('nodemailer');
const { TOPIC_OPTIONS } = require('./constants');

async function sendEmail(payload, recipientEmail) {
  try {
    // Create a test account with Ethereal
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter using Ethereal SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Get the display name for the selected topic
    const selectedTopicOption = TOPIC_OPTIONS.find(option => option.value === payload.selectedTopic);
    const selectedTopicDisplayName = selectedTopicOption ? selectedTopicOption.displayName : 'Unknown Topic';

    let assistanceInfoHtml = '';

    if (payload.selectedTopic === 'assistance') {
      assistanceInfoHtml = `
        <ul>
          <li><strong>Industry:</strong> ${payload.assistance.industry}</li>
          <li><strong>Name:</strong> ${payload.assistance.name}</li>
          <li><strong>Email:</strong> ${payload.assistance.email}</li>
          <li><strong>Phone:</strong> ${payload.assistance.phone}</li>
          <li><strong>Comments:</strong> ${payload.assistance.comments}</li>
          <li><strong>Include LinkedIn:</strong> ${payload.assistance.includeLinkedIn ? 'Yes' : 'No'}</li>
          <li><strong>Resume File:</strong> <a href="${payload.assistance.fileUpload}">Download</a></li>
        </ul>
      `;
    } else if (payload.selectedTopic === 'Interviewprep') {
      assistanceInfoHtml = `
        <ul>
          <li><strong>Name:</strong> ${payload.Interviewprep.name}</li>
          <li><strong>Email:</strong> ${payload.Interviewprep.email}</li>
          <li><strong>Phone:</strong> ${payload.Interviewprep.phone}</li>
          <li><strong>Current Role:</strong> ${payload.Interviewprep.currentRole}</li>
          <li><strong>Current Company:</strong> ${payload.Interviewprep.currentCompany}</li>
          <li><strong>Interested Role:</strong> ${payload.Interviewprep.interetedRole}</li>
          <li><strong>Interested Company:</strong> ${payload.Interviewprep.InterestedCompany}</li>
          <li><strong>Interested Industry:</strong> ${payload.Interviewprep.industry}</li>
        </ul>
      `;
    } else if (payload.selectedTopic === 'jobreferral') {
      assistanceInfoHtml = `
        <ul>
          <li><strong>Name:</strong> ${payload.jobreferral.name}</li>
          <li><strong>Email:</strong> ${payload.jobreferral.email}</li>
          <li><strong>Phone:</strong> ${payload.jobreferral.phone}</li>
          <li><strong>Current Role:</strong> ${payload.jobreferral.currentRole}</li>
          <li><strong>Current Company:</strong> ${payload.jobreferral.currentCompany}</li>
          <li><strong>Interested Role:</strong> ${payload.jobreferral.interetedRole}</li>
          <li><strong>Interested Company:</strong> ${payload.jobreferral.InterestedCompany}</li>
          <li><strong>Interested Industry:</strong> ${payload.jobreferral.industry}</li>
        </ul>
      `;
    } else if (payload.selectedTopic === 'mentorship') {
      assistanceInfoHtml = `
        <ul>
          <li><strong>Name:</strong> ${payload.mentorship.name}</li>
          <li><strong>Email:</strong> ${payload.mentorship.email}</li>
          <li><strong>Phone:</strong> ${payload.mentorship.phone}</li>
          <li><strong>Current Role:</strong> ${payload.mentorship.currentRole}</li>
          <li><strong>Current Company:</strong> ${payload.mentorship.currentCompany}</li>
          <li><strong>Interested Role:</strong> ${payload.mentorship.interetedRole}</li>
          <li><strong>Interested Company:</strong> ${payload.mentorship.InterestedCompany}</li>
          <li><strong>Interested Industry:</strong> ${payload.mentorship.industry}</li>
        </ul>
      `;
    }

    let mailOptions = {
      from: recipientEmail,
      to: 'enaeemullah@gmail.com',
      subject: 'Payload Data',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payload Data</title>
        </head>
        <body>
          <p>Dear Marketing Team,</p>
          <p>Thank you for your inquiry regarding IPN services. Below, you'll find the user data selected by <strong>${payload[payload.selectedTopic].name}</strong>. This information has been forwarded from the IPN website to our Marketing team for their attention and further action.</p>

          <h2>${selectedTopicDisplayName}</h2>
          ${assistanceInfoHtml}
          <br>
          <p><b>Best Regards</b>,<br>IPN-Tech Team</p>
        </body>
        </html>
      `
    };

    // if (payload.selectedTopic === 'assistance' && payload.assistance.fileUpload) {
    //   const resumeFileName = payload.assistance.name.replace(/\s+/g, '_') + '_Resume.pdf'; // Adjust filename based on the name field
    //   mailOptions.attachments = [
    //     {
    //       filename: resumeFileName,
    //       path: payload.assistance.fileUpload // Use the correct property name for the file upload
    //     }
    //   ];
    // }
    // Send mail using the transporter
    let info = await transporter.sendMail(mailOptions);

    // Log message details for testing
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { message: 'Email sent successfully', statusCode: 200 };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendEmail
};
