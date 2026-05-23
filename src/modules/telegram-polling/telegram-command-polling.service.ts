import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SummaryService } from '../summary/summary.service';
import { TelegramService, TelegramUpdate } from '../telegram/telegram.service';
import { DailySummary } from '../../types';

@Injectable()
export class TelegramCommandPollingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramCommandPollingService.name);
  private nextOffset: number | null = null;
  private stopped = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
    private readonly summaryService: SummaryService,
  ) {}

  onModuleInit() {
    if (this.configService.get<string>('TELEGRAM_POLLING_ENABLED', 'false') !== 'true') {
      this.logger.log('Telegram command polling is disabled.');
      return;
    }

    this.logger.log('Telegram command polling started.');
    void this.pollLoop();
  }

  onModuleDestroy() {
    this.stopped = true;
  }

  private async pollLoop() {
    while (!this.stopped) {
      try {
        const updates = await this.telegramService.getUpdates(this.nextOffset, this.getNumberConfig('TELEGRAM_POLLING_TIMEOUT_SECONDS', 30));

        for (const update of updates) {
          this.nextOffset = update.update_id + 1;
          await this.handleUpdate(update);
        }
      } catch (error) {
        this.logger.error(error instanceof Error ? error.message : String(error));
      }

      await this.sleep(this.getNumberConfig('TELEGRAM_POLLING_INTERVAL_MS', 30000));
    }
  }

  private async handleUpdate(update: TelegramUpdate) {
    const chatId = update.message?.chat?.id;
    const text = update.message?.text?.trim();

    if (!chatId || !text) {
      return;
    }

    if (String(chatId) !== String(this.configService.get<string>('TELEGRAM_CHAT_ID'))) {
      this.logger.warn(`Ignoring Telegram command from unauthorized chat: ${chatId}`);
      return;
    }

    const command = text.split(/\s+/)[0].toLowerCase();
    const summary = command === '/help' || command === '/start' ? null : await this.summaryService.getTodaySummary();
    const reply = this.buildReply(command, summary);

    await this.telegramService.sendMessageToChat(chatId, reply);
  }

  private buildReply(command: string, summary: DailySummary | null): string {
    if (command === '/help' || command === '/start') {
      return this.helpText();
    }

    if (!summary) {
      return this.helpText();
    }

    if (command === '/summary') {
      return this.summaryText(summary);
    }

    if (command === '/weather') {
      return this.weatherText(summary);
    }

    if (command === '/usage') {
      return this.usageText(summary);
    }

    if (command === '/alerts') {
      return this.alertsText(summary);
    }

    return `Unknown command: ${command}\n\n${this.helpText()}`;
  }

  private summaryText(summary: DailySummary): string {
    const alertText = summary.alerts.hasAlerts ? summary.alerts.alerts.map((alert) => `- [${alert.severity}] ${alert.title}`).join('\n') : '- No alerts for now.';

    return [
      'PowerCast Summary',
      '',
      `Location: ${summary.weather.location}`,
      `Current Temp: ${this.formatValue(summary.weather.currentTempC, 'C')}`,
      `Max Temp: ${this.formatValue(summary.weather.maxTempC, 'C')}`,
      `Grid: ${this.formatValue(summary.power.gridUnits, 'units')}`,
      `DG: ${this.formatValue(summary.power.dgUnits, 'units')}`,
      `Total: ${this.formatValue(summary.power.totalUnits, 'units')}`,
      `Date: ${summary.power.date ?? 'unknown'}`,
      '',
      'Alerts:',
      alertText,
    ].join('\n');
  }

  private weatherText(summary: DailySummary): string {
    return [
      'PowerCast Weather',
      '',
      `Location: ${summary.weather.location}`,
      `Current Temp: ${this.formatValue(summary.weather.currentTempC, 'C')}`,
      `Max Temp: ${this.formatValue(summary.weather.maxTempC, 'C')}`,
      `Min Temp: ${this.formatValue(summary.weather.minTempC, 'C')}`,
      `Humidity: ${this.formatValue(summary.weather.humidity, '%')}`,
      `Condition: ${summary.weather.condition}`,
    ].join('\n');
  }

  private usageText(summary: DailySummary): string {
    return [
      'PowerCast Usage',
      '',
      `Date: ${summary.power.date ?? 'unknown'}`,
      `Flat: ${summary.power.flatNumber}`,
      `Grid: ${this.formatValue(summary.power.gridUnits, 'units')}`,
      `DG: ${this.formatValue(summary.power.dgUnits, 'units')}`,
      `Total: ${this.formatValue(summary.power.totalUnits, 'units')}`,
    ].join('\n');
  }

  private alertsText(summary: DailySummary): string {
    if (!summary.alerts.hasAlerts) {
      return `PowerCast Alerts\n\nDate: ${summary.alerts.date ?? 'unknown'}\nNo alerts for now.`;
    }

    return ['PowerCast Alerts', '', `Date: ${summary.alerts.date ?? 'unknown'}`, ...summary.alerts.alerts.map((alert) => `- [${alert.severity}] ${alert.title}: ${alert.message}`)].join('\n');
  }

  private helpText(): string {
    return ['PowerCast Commands', '', '/summary - Today summary', '/weather - Today weather', '/usage - Today Grid/DG usage', '/alerts - Today alerts', '/help - Show commands'].join('\n');
  }

  private formatValue(value: number | null, suffix: string): string {
    return value === null ? 'unknown' : `${value} ${suffix}`;
  }

  private getNumberConfig(key: string, fallback: number): number {
    const parsed = Number(this.configService.get<string>(key));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
