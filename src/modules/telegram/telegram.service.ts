import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  constructor(private readonly configService: ConfigService) {}

  async sendMessage(message: string): Promise<{ enabled: boolean; sent: boolean }> {
    const enabled = this.configService.get<string>('TELEGRAM_ENABLED', 'false') === 'true';
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    if (!enabled) {
      return { enabled: false, sent: false };
    }

    if (!token || !chatId) {
      throw new Error('Telegram configuration is missing');
    }

    const apiHost = 'https://api.telegram.org';
    const response = await fetch(`${apiHost}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!response.ok) {
      throw new Error(`Telegram request failed with status ${response.status}`);
    }

    return { enabled: true, sent: true };
  }
}
