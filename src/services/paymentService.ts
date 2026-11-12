/**
 * GUDBAZAAR CISO SECURITY ARCHITECTURE: PAYMENT SERVICE MODULE (FUTURE INTEGRATION)
 * 
 * SECURITY DIRECTIVE:
 * - This application is currently in development mode.
 * - NO live payment gateway (Razorpay / Cashfree / Stripe) is integrated.
 * - Per CISO protocol: Never mark orders as 'paid' or simulate client-side fake approvals.
 * - In production, payment verification MUST occur strictly on the backend via HMAC-SHA256
 *   webhook signature verification (e.g., X-Razorpay-Signature) or server-to-server inquiry.
 * - This module defines the decoupled contract and defensive interfaces ready for future backend integration.
 */

import { Order, PaymentStatus } from '../types';

export interface PaymentIntentRequest {
  orderId: string;
  amountInPaise: number;
  currency: 'INR';
  customerEmail: string;
  customerMobile: string;
}

export interface PaymentIntentResponse {
  isConfigured: boolean;
  gatewayOrderId?: string;
  paymentSessionId?: string;
  keyId?: string;
  error?: string;
}

export interface WebhookVerificationPayload {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

class PaymentService {
  private isDevelopmentMode: boolean = true;

  /**
   * Status check for payment gateway integration readiness.
   */
  public isGatewayConfigured(): boolean {
    // In current dev stage, no live gateway credentials are bound
    return false;
  }

  /**
   * Prepares the order payment record in development mode without faking payment confirmation.
   * Online payment orders are safely tagged as 'pending_payment'.
   */
  public registerOrderForPayment(
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD'
  ): { paymentStatus: PaymentStatus; note: string } {
    if (paymentMethod === 'COD') {
      return {
        paymentStatus: 'awaiting_cod_verification',
        note: 'Cash on Delivery selected. Payment will be collected in cash upon doorstep delivery.',
      };
    }

    // For online methods in development stage:
    return {
      paymentStatus: 'pending_payment',
      note: 'Payment gateway integration pending. Order registered as a pending draft. No live funds charged.',
    };
  }

  /**
   * Future Backend Payment Intent Creation Contract.
   * When backend is connected, this dispatches to POST /api/payments/create-order
   */
  public async createPaymentIntent(
    payload: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    if (!this.isGatewayConfigured()) {
      return {
        isConfigured: false,
        error: 'Payment Gateway is in development stage. Online live payment collection is disabled.',
      };
    }

    // Future implementation:
    // const res = await fetch('/api/payments/create-order', { method: 'POST', body: JSON.stringify(payload) });
    // return await res.json();
    return { isConfigured: false };
  }

  /**
   * Future Server-Authoritative Webhook Verification Contract.
   * NEVER verify signatures on the client!
   */
  public verifyServerSignature(): boolean {
    throw new Error('SECURITY VIOLATION: Payment webhook verification must be executed exclusively on backend server.');
  }
}

export const paymentService = new PaymentService();
