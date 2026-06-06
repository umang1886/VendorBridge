import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations (write to ai_analysis table)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateSummary(scored: any[]): string {
  if (!scored || scored.length === 0) return 'No quotations available for analysis.';

  const best = scored[0];
  const second = scored[1];

  let summary = `Best overall vendor is ${best.vendor_name} with a composite score of ${best.composite_score}/100 `;
  summary += `(Price: ${best.price_score}/100, Delivery: ${best.delivery_score}/100, Rating: ${best.rating_score}/100). `;

  if (second) {
    const priceDiff = ((best.total_amount - second.total_amount) / second.total_amount * 100).toFixed(1);
    if (best.total_amount > second.total_amount) {
      summary += `${second.vendor_name} offers a lower price (${Math.abs(Number(priceDiff))}% cheaper) but scores lower overall. `;
    } else {
      summary += `Compared to ${second.vendor_name}, this vendor also offers a more competitive price. `;
    }
  }

  if (best.delivery_days <= 7) {
    summary += `Fast delivery within ${best.delivery_days} days is a key advantage.`;
  } else if (best.delivery_days <= 14) {
    summary += `Standard delivery in ${best.delivery_days} days is acceptable for most procurement timelines.`;
  } else {
    summary += `Note: Delivery time of ${best.delivery_days} days may be a risk if the project timeline is tight.`;
  }

  return summary;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rfqId: string = body.rfq_id;

    if (!rfqId) {
      return NextResponse.json({ error: 'rfq_id is required' }, { status: 400 });
    }

    // 1. Fetch all submitted quotations for this RFQ with vendor details
    const { data: quotations, error: fetchError } = await supabase
      .from('quotations')
      .select('*, vendors(id, company_name, rating)')
      .eq('rfq_id', rfqId)
      .eq('status', 'submitted');

    if (fetchError) throw fetchError;

    if (!quotations || quotations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No submitted quotations found for this RFQ.' 
      }, { status: 404 });
    }

    // 2. Calculate composite scores (Price 40%, Delivery 25%, Rating 35%)
    const validPrices = quotations.map(q => Number(q.total_amount)).filter(p => p > 0);
    const validDeliveries = quotations.map(q => Number(q.delivery_days)).filter(d => d > 0);
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 1;
    const minDelivery = validDeliveries.length > 0 ? Math.min(...validDeliveries) : 1;

    const scored = quotations.map(q => {
      const price = Number(q.total_amount) || 0;
      const days = Number(q.delivery_days) || 0;
      const rating = Number(q.vendors?.rating) || 3;

      const priceScore = price > 0 ? Math.round((minPrice / price) * 100 * 100) / 100 : 0;
      const deliveryScore = days > 0 ? Math.round((minDelivery / days) * 100 * 100) / 100 : 0;
      const ratingScore = Math.round((rating / 5) * 100 * 100) / 100;
      const composite = Math.round(((priceScore * 0.40) + (deliveryScore * 0.25) + (ratingScore * 0.35)) * 100) / 100;

      return {
        vendor_id: q.vendor_id,
        vendor_name: q.vendors?.company_name || 'Unknown',
        total_amount: price,
        delivery_days: days,
        rating,
        price_score: priceScore,
        delivery_score: deliveryScore,
        rating_score: ratingScore,
        composite_score: composite,
      };
    }).sort((a, b) => b.composite_score - a.composite_score);

    // 3. Generate a rule-based summary (no AI API needed)
    const aiSummary = generateSummary(scored);
    const bestVendorId = scored[0]?.vendor_id;
    const confidenceScore = scored.length === 1 ? 70 : 
      Math.min(95, Math.round(60 + (scored[0].composite_score - (scored[1]?.composite_score || 0)) / 2));

    // 4. Upsert analysis into ai_analysis table (replace if already exists for this RFQ)
    const { error: deleteError } = await supabase
      .from('ai_analysis')
      .delete()
      .eq('rfq_id', rfqId);

    if (deleteError) console.warn('Could not delete old analysis:', deleteError.message);

    const { data: saved, error: saveError } = await supabase
      .from('ai_analysis')
      .insert({
        rfq_id: rfqId,
        ranked_quotations: JSON.stringify(scored),
        ai_summary: aiSummary,
        recommended_vendor_id: bestVendorId,
        confidence_score: confidenceScore,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      rfq_id: rfqId,
      total_quotations: scored.length,
      recommended_vendor: scored[0]?.vendor_name,
      confidence_score: confidenceScore,
      ai_summary: aiSummary,
      ranked_quotations: scored,
    });

  } catch (err: any) {
    console.error('analyze-quotations error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
