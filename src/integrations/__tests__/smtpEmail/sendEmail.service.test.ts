import { sendEmailService } from '../../../integrations/smtpEmail/service/sendEmail.service';
import { Resend } from 'resend';

// Mock do Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

describe('SendEmailService', () => {
  let mockResend: any;
  let mockEmails: any;

  beforeEach(() => {
    clearAllMocks();

    // Mock do serviço de emails
    mockEmails = {
      send: jest.fn(),
    };

    // Mock do cliente Resend
    mockResend = {
      emails: mockEmails,
    };

    (Resend as jest.MockedClass<typeof Resend>).mockImplementation(() => mockResend);
  });

  describe('sendEmailService', () => {
    it('should send email successfully', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = '<h1>Test Content</h1>';
      const mockResponse = {
        id: 'email-123',
        from: 'sender@example.com',
        to: [recipient],
        subject: subject,
        html: content,
      };

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: mockResponse });

      // Act
      const result = await sendEmailService(recipient, subject, content);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
      expect(mockEmails.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: recipient,
        subject: subject,
        html: content,
      });

      // Restore environment
      process.env = originalEnv;
    });

    it('should throw error when RESEND_API_KEY is missing', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      delete process.env.RESEND_API_KEY;
      process.env.EMAIL_SENDER = 'sender@example.com';

      // Act & Assert
      const result = await sendEmailService(recipient, subject, content);
      expect(result).toBe(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });

    it('should throw error when EMAIL_SENDER is missing', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      delete process.env.EMAIL_SENDER;

      // Act & Assert
      const result = await sendEmailService(recipient, subject, content);
      expect(result).toBe(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle email sending errors', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';
      const emailError = new Error('Email sending failed');

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockRejectedValue(emailError);

      // Act
      const result = await sendEmailService(recipient, subject, content);

      // Assert
      expect(result).toBe('Email sending failed');

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle errors without message property', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';
      const emailError = { code: 'SEND_FAILED' };

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockRejectedValue(emailError);

      // Act & Assert
      await expect(sendEmailService(recipient, subject, content)).rejects.toThrow(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle null errors', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockRejectedValue(null);

      // Act & Assert
      await expect(sendEmailService(recipient, subject, content)).rejects.toThrow(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle undefined errors', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@email.com';

      mockEmails.send.mockRejectedValue(undefined);

      // Act & Assert
      await expect(sendEmailService(recipient, subject, content)).rejects.toThrow(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });
  });

  describe('Email content handling', () => {
    it('should handle HTML content correctly', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'HTML Test';
      const htmlContent = '<h1>Hello World</h1><p>This is <strong>HTML</strong> content.</p>';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act
      const result = await sendEmailService(recipient, subject, htmlContent);

      // Assert
      expect(result).toBeDefined();
      expect(mockEmails.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: recipient,
        subject: subject,
        html: htmlContent,
      });

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle plain text content correctly', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Text Test';
      const textContent = 'This is plain text content.';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act
      const result = await sendEmailService(recipient, subject, textContent);

      // Assert
      expect(result).toBeDefined();
      expect(mockEmails.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: recipient,
        subject: subject,
        html: textContent,
      });

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle special characters in content', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Special Chars Test';
      const specialContent = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>? éñçãõ 🚀🌟🎉';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act
      const result = await sendEmailService(recipient, subject, specialContent);

      // Assert
      expect(result).toBeDefined();
      expect(mockEmails.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: recipient,
        subject: subject,
        html: specialContent,
      });

      // Restore environment
      process.env = originalEnv;
    });
  });

  describe('Email parameters', () => {
    it('should handle different recipient formats', async () => {
      // Arrange
      const recipients = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@subdomain.example.com',
      ];
      const subject = 'Recipient Test';
      const content = 'Test content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act & Assert
      for (const recipient of recipients) {
        const result = await sendEmailService(recipient, subject, content);
        expect(result).toBeDefined();
        expect(mockEmails.send).toHaveBeenCalledWith({
          from: 'sender@example.com',
          to: recipient,
          subject: subject,
          html: content,
        });
      }

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle different subject formats', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subjects = [
        'Simple Subject',
        'Subject with Numbers 123',
        'Subject with Special Chars: !@#$%',
        'Subject with Spaces and   Multiple   Spaces',
        'Subject with Unicode: éñçãõ 🚀🌟🎉',
        '', // Empty subject
      ];
      const content = 'Test content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_SENDER = 'sender@example.com';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act & Assert
      for (const subject of subjects) {
        const result = await sendEmailService(recipient, subject, content);
        expect(result).toBeDefined();
        expect(mockEmails.send).toHaveBeenCalledWith({
          from: 'sender@example.com',
          to: recipient,
          subject: subject,
          html: content,
        });
      }

      // Restore environment
      process.env = originalEnv;
    });
  });

  describe('Environment variable handling', () => {
    it('should handle empty environment variables', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = '';
      process.env.EMAIL_SENDER = '';

      // Act & Assert
      const result = await sendEmailService(recipient, subject, content);
      expect(result).toBe(
        'Configurações de envio de email não encontradas. Contacte o administrador do sistema.',
      );

      // Restore environment
      process.env = originalEnv;
    });

    it('should handle whitespace in environment variables', async () => {
      // Arrange
      const recipient = 'test@example.com';
      const subject = 'Test Subject';
      const content = 'Test Content';

      // Mock das variáveis de ambiente
      const originalEnv = process.env;
      process.env.RESEND_API_KEY = '  test-api-key  ';
      process.env.EMAIL_SENDER = '  sender@example.com  ';

      mockEmails.send.mockResolvedValue({ data: { id: 'email-123' } });

      // Act
      const result = await sendEmailService(recipient, subject, content);

      // Assert
      expect(result).toBeDefined();
      expect(mockEmails.send).toHaveBeenCalledWith({
        from: '  sender@example.com  ',
        to: recipient,
        subject: subject,
        html: content,
      });

      // Restore environment
      process.env = originalEnv;
    });
  });
});

function clearAllMocks() {
  jest.clearAllMocks();
}
