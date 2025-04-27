const { Vonage } = require('@vonage/server-sdk');
const { Sms } = require('@vonage/messages'); // Required for SMS messaging

const vonage = new Vonage({
  apiKey: "779144b1",
  apiSecret: "g8yPXCPLzc7gXZt8"
});

const sms = new Sms(vonage); // Create SMS instance

const from = "Vonage APIs";
const to = "94719926700"; // Must be E.164 format (Sri Lanka = 94 + number)
const text = "A text message sent using the Vonage SMS API";

async function sendSMS() {
  try {
    const response = await sms.send({
      to: to,
      from: from,
      text: text,
    });
    console.log("Message sent successfully");
    console.log(response);
  } catch (error) {
    console.error("There was an error sending the message.");
    console.error(error);
  }
}

sendSMS();
