// Mock dependencies
jest.mock('nodemailer');
jest.mock('@vonage/server-sdk');

// Import the mocked modules
const nodemailer = require('nodemailer');
const { Vonage } = require('@vonage/server-sdk');

// Setup Nodemailer mock
const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

// Setup Vonage mock
const sendMock = {
  send: jest.fn((_, callback) => callback(null, { messages: [{ status: '0' }] }))
};
Vonage.mockImplementation(() => ({
  sms: sendMock
}));

// Import the service AFTER mocks are configured
const notificationService = require('../services/notificationService');

describe('Notification Service', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    process.env.FROM_EMAIL = 'thyagaalwis@gmail.com';
    process.env.GMAIL_APP_PASSWORD = 'esdg anyj kkng rkpf';
    process.env.VONAGE_API_KEY = '779144b1';
    process.env.VONAGE_API_SECRET = 'g8yPXCPLzc7gXZt8';
    process.env.VONAGE_TO = '94719926700';
  });

  test('sendEmail should call Nodemailer with correct parameters', async () => {
    await notificationService.sendEmail('test@example.com', 'Test Subject', 'Hello World');

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.FROM_EMAIL,
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Hello World'
    });
  });

  test('sendSMS should call Vonage API with correct parameters', async () => {
    await notificationService.sendSMS(process.env.VONAGE_TO, 'Test SMS');

    expect(Vonage).toHaveBeenCalledWith({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET
    });

    expect(sendMock.send).toHaveBeenCalled();
  });
});
