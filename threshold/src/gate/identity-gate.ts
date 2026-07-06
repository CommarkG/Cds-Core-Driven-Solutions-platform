/**
 * CDS PHASE 0 — Task 0.1: Identity-First Trust Layer
 * Identity verification gate with cryptographic signatures
 *
 * Purpose: All downstream authority checks require verified identity.
 * No submission bypasses identity verification.
 *
 * Status: P0 Implementation (Week 1, Day 1)
 */

import crypto from 'crypto';

export interface PublicKeyEntry {
  actor_id: string;                    // unique identifier (developer ID, platform name, etc.)
  public_key: string;                  // PEM-encoded public key
  registered_at: Date;
  tier: 'ADMIN' | 'TRUSTED' | 'EXTERNAL';
  active: boolean;
}

export interface SignedSubmission {
  actor_id: string;
  payload: Record<string, any>;        // The actual submission data
  signature: string;                   // base64-encoded signature
  timestamp: number;                   // Unix timestamp (prevents backdating)
  nonce: string;                       // Random nonce (prevents replay attacks)
}

export class IdentityGate {
  private keyRegistry: Map<string, PublicKeyEntry> = new Map();
  private nonceCache: Set<string> = new Set();
  private readonly NONCE_EXPIRY_MS = 3600000; // 1 hour

  /**
   * Register a new actor with their public key
   * Only ADMIN can register (bootstrapped initially)
   */
  registerActor(entry: PublicKeyEntry): void {
    if (this.keyRegistry.has(entry.actor_id)) {
      throw new Error(`Actor ${entry.actor_id} already registered`);
    }
    this.keyRegistry.set(entry.actor_id, entry);
  }

  /**
   * Verify a signed submission
   * Returns the verified actor ID if successful, throws on failure
   */
  verifySubmission(submission: SignedSubmission): string {
    // Step 1: Check nonce (replay prevention)
    if (this.nonceCache.has(submission.nonce)) {
      throw new Error('IDENTITY_INVALID: Nonce already used (replay attack detected)');
    }

    // Step 2: Find actor's public key
    const keyEntry = this.keyRegistry.get(submission.actor_id);
    if (!keyEntry) {
      throw new Error(`IDENTITY_UNREGISTERED: Actor ${submission.actor_id} not found in registry`);
    }

    if (!keyEntry.active) {
      throw new Error(`IDENTITY_INACTIVE: Actor ${submission.actor_id} is inactive`);
    }

    // Step 3: Verify timestamp (prevent backdating)
    const now = Date.now();
    const submissionAge = now - submission.timestamp;
    if (submissionAge < 0) {
      throw new Error('IDENTITY_INVALID: Submission timestamp is in the future');
    }
    if (submissionAge > 300000) { // 5 minutes
      throw new Error('IDENTITY_INVALID: Submission timestamp too old (> 5 minutes)');
    }

    // Step 4: Verify cryptographic signature
    const payloadString = JSON.stringify(submission.payload);
    const verifier = crypto.createVerify('sha256');
    verifier.update(payloadString);

    let isValid = false;
    try {
      isValid = verifier.verify(keyEntry.public_key, submission.signature, 'base64');
    } catch (err) {
      throw new Error(`IDENTITY_INVALID: Signature verification failed: ${err}`);
    }

    if (!isValid) {
      throw new Error('IDENTITY_INVALID: Signature does not match payload');
    }

    // Step 5: Mark nonce as used (with auto-expiry)
    this.nonceCache.add(submission.nonce);
    setTimeout(() => this.nonceCache.delete(submission.nonce), this.NONCE_EXPIRY_MS);

    return submission.actor_id;
  }

  /**
   * Get the tier of a verified actor
   */
  getActorTier(actor_id: string): 'ADMIN' | 'TRUSTED' | 'EXTERNAL' | null {
    const entry = this.keyRegistry.get(actor_id);
    return entry ? entry.tier : null;
  }

  /**
   * Deactivate an actor (used for trust tier downgrade)
   * Only ADMIN can deactivate
   */
  deactivateActor(actor_id: string, admin_id: string): void {
    const admin = this.keyRegistry.get(admin_id);
    if (!admin || admin.tier !== 'ADMIN') {
      throw new Error('AUTHORITY_INSUFFICIENT: Only ADMIN can deactivate actors');
    }

    const target = this.keyRegistry.get(actor_id);
    if (!target) {
      throw new Error(`Actor ${actor_id} not found`);
    }

    target.active = false;
  }

  /**
   * List all registered actors (ADMIN only)
   */
  listActors(admin_id: string): PublicKeyEntry[] {
    const admin = this.keyRegistry.get(admin_id);
    if (!admin || admin.tier !== 'ADMIN') {
      throw new Error('AUTHORITY_INSUFFICIENT: Only ADMIN can list actors');
    }

    return Array.from(this.keyRegistry.values());
  }
}

/**
 * Test Helper: Generate RSA key pair for testing
 */
export function generateTestKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  return {
    publicKey: publicKey.export({ type: 'spki', format: 'pem' }) as string,
    privateKey: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string,
  };
}

/**
 * Test Helper: Sign a submission with a private key
 */
export function signSubmission(
  payload: Record<string, any>,
  privateKey: string,
  actor_id: string,
  nonce?: string
): SignedSubmission {
  const payloadString = JSON.stringify(payload);
  const signer = crypto.createSign('sha256');
  signer.update(payloadString);
  const signature = signer.sign(privateKey, 'base64');

  return {
    actor_id,
    payload,
    signature,
    timestamp: Date.now(),
    nonce: nonce || crypto.randomBytes(16).toString('hex'),
  };
}
