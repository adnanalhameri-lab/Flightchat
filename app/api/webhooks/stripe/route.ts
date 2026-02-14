// API Route: Stripe Webhooks
// POST /api/webhooks/stripe - Handle Stripe events

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

// Lazy initialization of Stripe client
let stripe: Stripe | null = null
function getStripe(): Stripe | null {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return stripe
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const stripeClient = getStripe()
    if (!stripeClient) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }
    
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('📨 Stripe webhook received:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('  Updating subscription:', subscription.id, 'status:', subscription.status)

        // Update user subscription in database
        await supabaseAdmin
          .from('users')
          .update({
            subscription_status: subscription.status,
            subscription_tier: 'weekly',
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer as string)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('  Subscription cancelled:', subscription.id)

        // Mark subscription as inactive
        await supabaseAdmin
          .from('users')
          .update({
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer as string)

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any

        console.log('  Payment succeeded for customer:', invoice.customer)

        // Ensure subscription is active
        if (invoice.subscription) {
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any

        console.error('  Payment failed for customer:', invoice.customer)

        // Mark subscription as past_due
        if (invoice.subscription) {
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }

        // TODO: Send email notification to user

        break
      }

      default:
        console.log('  Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 500 }
    )
  }
}
