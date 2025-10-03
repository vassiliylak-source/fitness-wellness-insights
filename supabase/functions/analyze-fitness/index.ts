import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fitnessData, extractedText } = await req.json();
    console.log("Received fitness data:", fitnessData);
    console.log("Extracted text:", extractedText);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context about the fitness data
    let dataContext = "Fitness data extracted from screenshot:\n";
    if (fitnessData.steps) dataContext += `- Steps: ${fitnessData.steps}\n`;
    if (fitnessData.calories) dataContext += `- Calories: ${fitnessData.calories}\n`;
    if (fitnessData.distance) dataContext += `- Distance: ${fitnessData.distance}\n`;
    if (fitnessData.heartRate) dataContext += `- Heart Rate: ${fitnessData.heartRate} BPM\n`;
    if (fitnessData.pace) dataContext += `- Pace: ${fitnessData.pace}\n`;
    if (fitnessData.duration) dataContext += `- Duration: ${fitnessData.duration}\n`;
    if (extractedText) dataContext += `\nAdditional context from screenshot: ${extractedText}\n`;

    const systemPrompt = `You are a fitness and wellness expert AI. Analyze the provided fitness data and give personalized, actionable insights. 
    
Format your response with these sections:
1. **Quick Summary** - A brief overview of the workout/activity
2. **Key Highlights** - 3-4 bullet points of notable achievements or metrics
3. **Recommendations** - 2-3 specific, actionable suggestions for improvement
4. **Motivation** - Encouraging words based on their progress

Keep the tone positive, supportive, and motivating. Be specific with recommendations based on the actual data provided.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: dataContext }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. Please add credits to your workspace." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiInsights = data.choices[0].message.content;

    console.log("AI analysis completed successfully");

    return new Response(JSON.stringify({ insights: aiInsights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-fitness function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
