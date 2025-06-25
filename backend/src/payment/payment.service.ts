import { Injectable, InternalServerErrorException, Logger, } from '@nestjs/common';
import PayOS from '@payos/node';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private payOS: PayOS;

    constructor(private readonly configService: ConfigService) {
        const clientId = this.configService.get<string>('PAYOS_CLIENT_ID');
        const apiKey = this.configService.get<string>('PAYOS_API_KEY');
        const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');
        const webhookUrl = this.configService.get<string>('PAYOS_WEBHOOK_URL');

        if (!clientId || !apiKey || !checksumKey) {
            throw new InternalServerErrorException('Missing PayOS configuration');
        }

        this.payOS = new PayOS(clientId, apiKey, checksumKey);

        // Confirm webhook URL with PayOS
        if (webhookUrl) {
            this.payOS.confirmWebhook(webhookUrl)
                .then(() => {
                    this.logger.log(`Webhook URL confirmed with PayOS: ${webhookUrl}`);
                })
                .catch((err) => {
                    this.logger.error('Failed to confirm webhook URL with PayOS', err);
                });
        } else {
            this.logger.warn('PAYOS_WEBHOOK_URL is not set. Webhook confirmation skipped.');
        }
    }

    async createPaymentLink(
        createPaymentDto
    ): Promise<any> {
        this.logger.log(`Attempting to create payment link for order code: ${createPaymentDto.orderCode}`,);
        try {
            const paymentData: any = {
                orderCode: createPaymentDto.orderCode,
                amount: createPaymentDto.amount,
                description: createPaymentDto.description,
                items: createPaymentDto.items.map(item => ({
                    name: item.name, // Use correct property for name
                    price: item.price,
                    quantity: item.quantity
                })),
                returnUrl: createPaymentDto.returnUrl,
                cancelUrl: createPaymentDto.cancelUrl,
            };

            if (createPaymentDto.buyerName) paymentData.buyerName = createPaymentDto.buyerName;
            if (createPaymentDto.buyerEmail) paymentData.buyerEmail = createPaymentDto.buyerEmail;
            if (createPaymentDto.buyerPhone) paymentData.buyerPhone = createPaymentDto.buyerPhone;
            if (createPaymentDto.buyerAddress) paymentData.buyerAddress = createPaymentDto.buyerAddress;
            if (createPaymentDto.expiredAt) paymentData.expiredAt = createPaymentDto.expiredAt;

            const paymentLink = await this.payOS.createPaymentLink(paymentData);
            this.logger.log(
                `Successfully created payment link for order code: ${createPaymentDto.orderCode}`,
            );
            return paymentLink;
        } catch (error) {
            this.logger.error(
                `Failed to create payment link for order code: ${createPaymentDto.orderCode}`,
                error instanceof Error ? error.stack : JSON.stringify(error),
            );
            throw new InternalServerErrorException(
                'Failed to create payment link',
            );
        }
    }

    async cancelPaymentLink(orderCode: string, reason: string) {
        try {
            const canceledOrder = await this.payOS.cancelPaymentLink(orderCode, reason);
            return canceledOrder;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to cancel payment link',
                error.message
            );
        }
    }

    async verifyWebhook(body: any) {
        try {
            const webhookData = await this.payOS.verifyPaymentWebhookData(body);
            return webhookData;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to verify webhook',
                error.message
            );
        }
    }

    async getPaymentInfo(orderCode: string) {
        try {
            const paymentInfo = await this.payOS.getPaymentLinkInformation(orderCode);
            return paymentInfo;
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to get payment information',
                error.message
            );
        }
    }

}
