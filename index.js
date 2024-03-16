const express = require('express');
const cors = require('cors');
const { sendEmail } = require('./emailService'); // Import the sendEmail function
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/receive-payload', async (req, res) => {
  const payload = req.body;
  console.log('Received payload:', payload);

  const selectedTopic = payload.selectedTopic;
  
  // Extract the email address from the payload
  let recipientEmail;
  switch (selectedTopic) {
    case 'Interviewprep':
      recipientEmail = payload.Interviewprep?.email;
      break;
    case 'jobreferral':
      recipientEmail = payload.jobreferral?.email;
      break;
    case 'mentorship':
      recipientEmail = payload.mentorship?.email;
      break;
    case 'assistance':
      recipientEmail = payload.assistance?.email;
      break;
    default:
      return res.status(400).send('Invalid selected topic');
  }

  if (!recipientEmail) {
    return res.status(400).send('Recipient email not found in the payload');
  }

  try {
    // Send email with payload data using the sendEmail function
    await sendEmail(payload, recipientEmail);
    
    // Respond to the client
    res.send('Payload received and email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
