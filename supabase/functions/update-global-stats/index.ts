import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { workoutHash, actualTime } = await req.json();

    // Validate input
    if (!workoutHash || typeof workoutHash !== 'string' || workoutHash.length > 200) {
      console.error('Invalid workoutHash:', workoutHash);
      return new Response(
        JSON.stringify({ error: 'Invalid workout hash' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!actualTime || typeof actualTime !== 'number' || actualTime <= 0 || actualTime > 86400) {
      console.error('Invalid actualTime:', actualTime);
      return new Response(
        JSON.stringify({ error: 'Invalid actual time' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT to verify they're authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user has a valid session
    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Updating global stats for user:', user.id, 'workout:', workoutHash);

    // Check existing stats
    const { data: existing } = await supabase
      .from('workout_global_stats')
      .select('*')
      .eq('workout_hash', workoutHash)
      .maybeSingle();

    if (existing) {
      const newTotal = existing.total_completions + 1;
      const newAvg = Math.round(
        (existing.average_time * existing.total_completions + actualTime) / newTotal
      );
      const newFastest = existing.fastest_time 
        ? Math.min(existing.fastest_time, actualTime)
        : actualTime;

      const { error: updateError } = await supabase
        .from('workout_global_stats')
        .update({
          total_completions: newTotal,
          average_time: newAvg,
          fastest_time: newFastest
        })
        .eq('workout_hash', workoutHash);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Updated stats - total:', newTotal, 'avg:', newAvg, 'fastest:', newFastest);
    } else {
      const { error: insertError } = await supabase
        .from('workout_global_stats')
        .insert({
          workout_hash: workoutHash,
          total_completions: 1,
          average_time: actualTime,
          fastest_time: actualTime
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Inserted new stats for workout:', workoutHash);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating global stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
