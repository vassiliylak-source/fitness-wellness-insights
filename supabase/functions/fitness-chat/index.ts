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
    const { messages, fitnessContext } = await req.json();
    console.log("Chat request with fitness context:", fitnessContext);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt with fitness context
    let systemPrompt = `You are a helpful fitness and wellness AI assistant. You provide clear, encouraging, and scientifically-backed advice about fitness, health, and wellness.`;
    
    if (fitnessContext) {
      systemPrompt += `\n\nThe user has uploaded fitness data showing:`;
      if (fitnessContext.steps) systemPrompt += `\n- Steps: ${fitnessContext.steps}`;
      if (fitnessContext.calories) systemPrompt += `\n- Calories burned: ${fitnessContext.calories}`;
      if (fitnessContext.distance) systemPrompt += `\n- Distance: ${fitnessContext.distance}`;
      if (fitnessContext.heartRate) systemPrompt += `\n- Heart rate: ${fitnessContext.heartRate} BPM`;
      if (fitnessContext.pace) systemPrompt += `\n- Pace: ${fitnessContext.pace}`;
      if (fitnessContext.duration) systemPrompt += `\n- Duration: ${fitnessContext.duration}`;
      systemPrompt += `\n\nUse this context when answering questions about their workout or fitness data.`;
    }

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
          ...messages
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
    const reply = data.choices[0].message.content;

    console.log("Chat response generated successfully");

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fitness-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
