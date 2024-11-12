
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';


@Controller('webhook')
export class StripeController {
    constructor(private stripeService: StripeService) { }

    @Post()
    async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
        const event = await this.stripeService.constructEvent(body, signature);
        const paymentIntent = event.data.object;
        switch (event.type) {
            case 'checkout.session.completed':
                // Contains payment data
                await this.stripeService.handlePaymentSuccess(paymentIntent);
                break;
            // Handle other events if necessary
            default:
                await this.stripeService.handlePaymentRejected(paymentIntent);
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}
