import { createHmac, timingSafeEqual } from 'node:crypto';
import { config } from '../config.js';

export function verifyTebexSignature(body: string, signature: string): boolean {
  const expected = createHmac('sha256', config.TEBEX_SECRET)
    .update(body)
    .digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
