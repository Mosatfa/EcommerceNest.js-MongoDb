
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-objectid.pipe';
import { CustomRequest } from 'src/common/interfaces/custom-request.interface';
import { Response } from 'express';
import { string } from 'joi';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService) { }

    @Post(':orderId')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(302)
    checkOut(@Req() req: CustomRequest, @Res() res: any, @Param('orderId', ParseObjectIdPipe) orderId: string): Promise<Record<string, any>> {
        return this.stripeService.checkOut(req, res, orderId)
    }

    @Get('success')
    async successPayment(@Query('session_id') session_id: string): Promise<{ message: string }> {
        return await this.stripeService.successPayment(session_id)
    }

    @Get('cancel')
    cancelPayment(@Res() res: any): void {
        return this.stripeService.cancelPayment(res)
    }

    @Post()
    async handleStripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
        const event = await this.stripeService.constructEvent(body, signature);
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object; // Contains payment data
                await this.stripeService.handlePaymentSuccess(paymentIntent);
                break;
            // Handle other events if necessary
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}
