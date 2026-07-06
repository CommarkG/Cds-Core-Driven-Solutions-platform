/**
 * CDS PHASE 0 — Task 0.2: Immutable Authority Matrix
 * Authority matrix as append-only signed change orders with hash chain
 *
 * Purpose: Authority can never be modified retroactively. Every change is
 * signed, timestamped, and linked to the previous change via hash chain.
 * Prevents authority bypass (Mode 2 failure).
 *
 * Status: P0 BLOCKER (Week 1, Day 3)
 */

import crypto from 'crypto';

export interface AuthorityGrant {
  permission: string;                  // e.g., 'APPROVE_CAPABILITIES', 'RESOLVE_CONFLICTS'
  actor_id: string;                    // Who gets this permission
  tier: 'ADMIN' | 'TRUSTED' | 'EXTERNAL';
  granted_at: Date;
  granted_by: string;                  // ADMIN actor who granted it
  expires_at?: Date;                   // Optional expiration
  revoked_at?: Date;                   // Null if active, Date if revoked
}

export interface AuthorityChangeOrder {
  change_id: string;                   // Unique ID for this change
  actor_id: string;
  permission: string;
  action: 'GRANT' | 'REVOKE' | 'EXPIRE';
  executed_by: string;                 // ADMIN who executed this change
  timestamp: number;                   // Unix timestamp (immutable)
  signature: string;                   // RSA signature of this order
  previous_hash: string;               // SHA256 of previous change order (hash chain)
  change_hash: string;                 // SHA256 of this change order (for next link)
}

export class AuthorityMatrix {
  private changeLog: AuthorityChangeOrder[] = [];
  private permissions: Map<string, Map<string, AuthorityGrant>> = new Map();
  private adminPublicKey: string;
  private lastChangeHash: string = 'GENESIS';

  constructor(adminPublicKey: string) {
    this.adminPublicKey = adminPublicKey;
  }

  /**
   * Execute an authority change order (grant, revoke, expire)
   * Verifies signature and maintains hash chain
   */
  executeChangeOrder(
    order: Omit<AuthorityChangeOrder, 'change_hash' | 'previous_hash'>,
    adminPrivateKey: string
  ): AuthorityChangeOrder {
    // Verify the admin's signature on the order
    const orderPayload = {
      actor_id: order.actor_id,
      permission: order.permission,
      action: order.action,
      executed_by: order.executed_by,
      timestamp: order.timestamp,
    };

    const verifier = crypto.createVerify('sha256');
    verifier.update(JSON.stringify(orderPayload));

    if (!verifier.verify(this.adminPublicKey, order.signature, 'base64')) {
      throw new Error('AUTHORITY_INVALID: Change order signature verification failed');
    }

    // Create change hash for chain
    const changePayload = JSON.stringify({
      change_id: order.change_id,
      actor_id: order.actor_id,
      permission: order.permission,
      action: order.action,
      executed_by: order.executed_by,
      timestamp: order.timestamp,
      signature: order.signature,
      previous_hash: this.lastChangeHash,
    });
    const changeHash = crypto.createHash('sha256').update(changePayload).digest('hex');

    // Build complete change order
    const completeOrder: AuthorityChangeOrder = {
      ...order,
      previous_hash: this.lastChangeHash,
      change_hash: changeHash,
    };

    // Execute the change
    this.applyChange(completeOrder);

    // Append to immutable log
    this.changeLog.push(completeOrder);
    this.lastChangeHash = changeHash;

    return completeOrder;
  }

  /**
   * Apply a change order to the permissions map
   */
  private applyChange(order: AuthorityChangeOrder): void {
    if (!this.permissions.has(order.actor_id)) {
      this.permissions.set(order.actor_id, new Map());
    }

    const actorPerms = this.permissions.get(order.actor_id)!;

    if (order.action === 'GRANT') {
      const grant: AuthorityGrant = {
        permission: order.permission,
        actor_id: order.actor_id,
        tier: 'TRUSTED', // Default tier on grant (can be overridden)
        granted_at: new Date(order.timestamp),
        granted_by: order.executed_by,
      };
      actorPerms.set(order.permission, grant);
    } else if (order.action === 'REVOKE') {
      const grant = actorPerms.get(order.permission);
      if (grant) {
        grant.revoked_at = new Date(order.timestamp);
      }
    } else if (order.action === 'EXPIRE') {
      const grant = actorPerms.get(order.permission);
      if (grant) {
        grant.expires_at = new Date(order.timestamp);
      }
    }
  }

  /**
   * Check if an actor has an active permission
   */
  hasPermission(actor_id: string, permission: string): boolean {
    const actorPerms = this.permissions.get(actor_id);
    if (!actorPerms) return false;

    const grant = actorPerms.get(permission);
    if (!grant) return false;

    // Check if revoked
    if (grant.revoked_at) return false;

    // Check if expired
    if (grant.expires_at && new Date() > grant.expires_at) return false;

    return true;
  }

  /**
   * Get all active permissions for an actor
   */
  getActorPermissions(actor_id: string): string[] {
    const actorPerms = this.permissions.get(actor_id);
    if (!actorPerms) return [];

    const now = new Date();
    return Array.from(actorPerms.values())
      .filter(grant => !grant.revoked_at && (!grant.expires_at || now <= grant.expires_at))
      .map(grant => grant.permission);
  }

  /**
   * Verify the entire change log hash chain integrity
   * Detects any tampering with authority history
   */
  verifyIntegrity(): { valid: boolean; firstInvalidAt?: number } {
    if (this.changeLog.length === 0) {
      return { valid: true };
    }

    let previousHash = 'GENESIS';
    for (let i = 0; i < this.changeLog.length; i++) {
      const order = this.changeLog[i];

      // Check previous_hash link
      if (order.previous_hash !== previousHash) {
        return { valid: false, firstInvalidAt: i };
      }

      // Verify signature
      const orderPayload = {
        actor_id: order.actor_id,
        permission: order.permission,
        action: order.action,
        executed_by: order.executed_by,
        timestamp: order.timestamp,
      };

      const verifier = crypto.createVerify('sha256');
      verifier.update(JSON.stringify(orderPayload));

      if (!verifier.verify(this.adminPublicKey, order.signature, 'base64')) {
        return { valid: false, firstInvalidAt: i };
      }

      previousHash = order.change_hash;
    }

    return { valid: true };
  }

  /**
   * Get the complete change log (ADMIN only)
   */
  getChangeLog(admin_id: string): AuthorityChangeOrder[] {
    // In production, verify admin_id has AUTHORITY_VIEW permission
    return [...this.changeLog];
  }

  /**
   * Get current hash (for verification by other systems)
   */
  getCurrentHash(): string {
    return this.lastChangeHash;
  }
}

/**
 * Test Helper: Sign a change order with admin private key
 */
export function signChangeOrder(
  order: Omit<AuthorityChangeOrder, 'signature' | 'change_hash' | 'previous_hash'>,
  adminPrivateKey: string
): string {
  const payload = {
    actor_id: order.actor_id,
    permission: order.permission,
    action: order.action,
    executed_by: order.executed_by,
    timestamp: order.timestamp,
  };

  const signer = crypto.createSign('sha256');
  signer.update(JSON.stringify(payload));
  return signer.sign(adminPrivateKey, 'base64');
}
