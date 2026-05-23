import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TelegramUpdate {
  update_id: number;
  message?: {
    text?: string;
    chat?: {
      id?: number | string;
    };
  };
}

interface TelegramUpdatesResponse {
  ok: boolean;
  result?: TelegramUpdate[];
}

@Injectable()
export class TelegramService {
  private readonly apiHost = 'https://api.telegram.org';

  constructor(private readonly configService: ConfigService) {}

  async sendMessage(message: string): Promise<{ enabled: boolean; sent: boolean }> {
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    return this.sendMessageToChat(chatId, message);
  }

  async sendMessageToChat(chatId: string | number | undefined, message: string): Promise<{ enabled: boolean; sent: boolean }> {
    const enabled = this.configService.get<string>('TELEGRAM_ENABLED', 'false') === 'true';
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (!enabled) {
      return { enabled: false, sent: false };
    }

    if (!token || !chatId) {
      throw new Error('Telegram configuration is missing');
    }

    const response = await fetch(`${this.apiHost}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!response.ok) {
      throw new Error(`Telegram request failed with status ${response.status}`);
    }

    return { enabled: true, sent: true };
  }

  async getUpdates(offset: number | null, timeoutSeconds: number): Promise<TelegramUpdate[]> {
    const enabled = this.configService.get<string>('TELEGRAM_ENABLED', 'false') === 'true';
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (!enabled || !token) {
      return [];
    }

    const url = new URL(`${this.apiHost}/bot${token}/getUpdates`);
    url.searchParams.set('timeout', String(timeoutSeconds));

    if (offset !== null) {
      url.searchParams.set('offset', String(offset));
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Telegram getUpdates failed with status ${response.status}`);
    }

    const data = (await response.json()) as TelegramUpdatesResponse;
    return data.result ?? [];
  }
}
