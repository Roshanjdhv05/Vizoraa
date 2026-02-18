// @ts-nocheck
// This file runs in the Deno environment on Supabase Edge Functions.
// Local IDE errors about 'Deno' can be ignored or resolved by installing the Deno VS Code extension.
Deno.serve(async (req: Request) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders, status: 200 })
    }

    try {
        const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
        const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            console.error('Missing Razorpay keys in environment variables')
            throw new Error('Server configuration error: Missing payment keys')
        }

        const { amount, currency = 'INR', receipt, notes } = await req.json()

        if (!amount) {
            throw new Error('Amount is required')
        }

        const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                amount, // in paise
                currency,
                receipt,
                notes,
                payment_capture: 1, // Auto-capture
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Razorpay API Error Status:', response.status)
            console.error('Razorpay API Error Body:', data)

            const errorMsg = data.error?.description || data.error?.reason || 'Razorpay order creation failed';

            return new Response(
                JSON.stringify({ error: errorMsg }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400 // Always return 400 for client-side handled errors
                }
            )
        }

        return new Response(
            JSON.stringify(data),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            },
        )
    } catch (error: any) {
        console.error('Edge Function System Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message || 'An unexpected server error occurred' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            },
        )
    }
})
