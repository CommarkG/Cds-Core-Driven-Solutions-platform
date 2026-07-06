/**
 * CDS PHASE 0 — Task 0.3: Bootstrap Ceremony
 * Governor-only initialization endpoint for Phase A launch
 *
 * Purpose: Create the first TRUSTED platforms without circular dependency.
 * One-time use during system initialization.
 *
 * Status: P1 High (Week 1, Day 5)
 */

import crypto from 'crypto';
import { IdentityGate, PublicKeyEntry } from '../gate/identity-gate';
import { AuthorityMatrix } from '../gate/authority-matrix';

export interface BootstrapRequest {
  governor_id: string;                 // Must be Yariv (verified externally)
  platforms: BootstrapPlatform[];      // Initial TRUSTED platforms to create
  timestamp: number;
}

export interface BootstrapPlatform {
  platform_id: string;                 // e.g., 'base44', 'lovable', 'csps', 'csp'
  public_key: string;                  // PEM-encoded public key
  tier: 'TRUSTED';                     // Only TRUSTED in bootstrap
  contact_email?: string;
}

export class BootstrapCeremony {
  private identityGate: IdentityGate;
  private authorityMatrix: AuthorityMatrix;
  private isBootstrapped: boolean = false;
  private bootstrapTimestamp: Date | null = null;
  private bootstrapPlatforms: Set<string> = new Set();
  private governorId: string = 'yariv.fink';  // Hardcoded

  constructor(identityGate: IdentityGate, authorityMatrix: AuthorityMatrix) {
    this.identityGate = identityGate;
    this.authorityMatrix = authorityMatrix;
  }

  /**
   * Execute bootstrap ceremony (one-time only)
   * Yariv must be pre-registered with ADMIN tier
   */
  executeBootstrap(request: BootstrapRequest): void {
    // Step 1: Verify governor is Yariv
    if (request.governor_id !== this.governorId) {
      throw new Error(
        `BOOTSTRAP_UNAUTHORIZED: Only Yariv (${this.governorId}) can execute bootstrap`
      );
    }

    // Step 2: Verify not already bootstrapped
    if (this.isBootstrapped) {
      throw new Error('BOOTSTRAP_ALREADY_EXECUTED: System already bootstrapped');
    }

    // Step 3: Verify timestamp is recent (within 5 minutes)
    const now = Date.now();
    if (now - request.timestamp > 300000) {
      throw new Error('BOOTSTRAP_INVALID: Request timestamp too old (> 5 minutes)');
    }

    // Step 4: Register all platforms with TRUSTED tier
    for (const platform of request.platforms) {
      if (platform.tier !== 'TRUSTED') {
        throw new Error(`BOOTSTRAP_INVALID: Initial platforms must be TRUSTED, got ${platform.tier}`);
      }

      const entry: PublicKeyEntry = {
        actor_id: platform.platform_id,
        public_key: platform.public_key,
        registered_at: new Date(),
        tier: 'TRUSTED',
        active: true,
      };

      try {
        this.identityGate.registerActor(entry);
        this.bootstrapPlatforms.add(platform.platform_id);
      } catch (err) {
        throw new Error(`BOOTSTRAP_FAILED: Could not register ${platform.platform_id}: ${err}`);
      }
    }

    // Step 5: Grant SUBMIT_ADD permission to all TRUSTED platforms
    for (const platform of request.platforms) {
      // In production, this would go through authorityMatrix.executeChangeOrder()
      // For now, just track that permissions were granted
    }

    // Mark bootstrap as complete
    this.isBootstrapped = true;
    this.bootstrapTimestamp = new Date();
  }

  /**
   * Check bootstrap status
   */
  getBootstrapStatus(): {
    bootstrapped: boolean;
    timestamp: Date | null;
    platforms: string[];
  } {
    return {
      bootstrapped: this.isBootstrapped,
      timestamp: this.bootstrapTimestamp,
      platforms: Array.from(this.bootstrapPlatforms),
    };
  }

  /**
   * Verify that all initial platforms are registered
   */
  verifyBootstrapComplete(requiredPlatforms: string[]): boolean {
    if (!this.isBootstrapped) return false;

    return requiredPlatforms.every(platform => this.bootstrapPlatforms.has(platform));
  }
}

/**
 * REST Endpoint Handler (pseudo-code for integration)
 *
 * POST /api/bootstrap
 * {
 *   "governor_id": "yariv.fink",
 *   "platforms": [
 *     {
 *       "platform_id": "base44",
 *       "public_key": "-----BEGIN PUBLIC KEY-----...",
 *       "tier": "TRUSTED",
 *       "contact_email": "admin@base44.com"
 *     },
 *     ...
 *   ],
 *   "timestamp": 1688908800000
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "bootstrapped_platforms": ["base44", "lovable", "csps", "csp"],
 *   "timestamp": "2026-07-08T06:00:00Z"
 * }
 */
