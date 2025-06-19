import { Injectable, InternalServerErrorException } from '@nestjs/common';
import PayOS from '@payos/node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
    private payOS: PayOS;

    constructor(private readonly configService: ConfigService) {
        const clientId = this.configService.get<string>('PAYOS_CLIENT_ID');
        const apiKey = this.configService.get<string>('PAYOS_API_KEY');
        const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');

        if (!clientId || !apiKey || !checksumKey) {
            throw new InternalServerErrorException('Missing PayOS configuration');
        }

        this.payOS = new PayOS(clientId, apiKey, checksumKey);
    }

    async createPaymentLink(
        createPaymentDto
    ): Promise<any> {
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
            return paymentLink;
        } catch (error) {
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
