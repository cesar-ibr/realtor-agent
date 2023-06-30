import { NextRequest } from 'next/server'
import cors from '../../lib/cors'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const VERIFY_TOKEN = process.env['VERIFY_TOKEN'] ?? '';
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  console.log('[REQUEST] => ', req.method, 'URL:', req.url);
  

  if (req.method === 'GET') {
    // Handle webhooh verification
    if (mode && token) {
      if (token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      } else {
        new Response(JSON.stringify({ message: 'Forbidden Access' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // `cors` also takes care of handling OPTIONS requests
  const data = await req.json();
  console.log('Payload:', data);
  return cors(
    req,
    new Response(JSON.stringify({ message: `You sent: ${JSON.stringify(data)}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}
