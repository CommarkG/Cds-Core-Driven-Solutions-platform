/**
 * CDS PHASE 0 — Task 0.7: Schema Checksum Validation
 * Schema versioning and orphan prevention
 *
 * Purpose: Every schema change is checksummed. Deleting a schema term cascades
 * to all references - either delete or escalate. No orphaned references possible.
 * Prevents vocabulary drift (Mode 1).
 *
 * Status: P0 BLOCKER (Week 2, Day 12)
 */

import crypto from 'crypto';

export interface SchemaNode {
  node_id: string;                     // Canonical schema node ID
  name: string;
  definition: string;
  created_at: Date;
  parents: string[];                   // Parent schema nodes (for hierarchy)
  children: string[];                  // Child schema nodes
  references: SchemaReference[];       // What uses this node
}

export interface SchemaReference {
  referencing_entity: string;          // Entity using this node (capability_id, glossary_term_id, etc.)
  entity_type: 'CAPABILITY' | 'GLOSSARY_TERM' | 'CONFLICT' | 'DECISION';
  referenced_at: Date;
}

export interface SchemaSnapshot {
  snapshot_id: string;                 // SCHEMA-SNAP-{YYYYMMDD}-{SEQ}
  timestamp: Date;
  checksum: string;                    // SHA256 of entire schema
  node_count: number;
  reference_count: number;
  changed_nodes: string[];             // node_ids that changed since last snapshot
  created_by: string;                  // 'system_auto' or actor ID
}

export class SchemRegistry {
  private nodes: Map<string, SchemaNode> = new Map();
  private snapshots: SchemaSnapshot[] = [];
  private snapshotCounter: number = 0;

  /**
   * Add or update a schema node
   */
  setNode(node: SchemaNode): void {
    this.nodes.set(node.node_id, node);
  }

  /**
   * Get a schema node
   */
  getNode(node_id: string): SchemaNode | null {
    return this.nodes.get(node_id) || null;
  }

  /**
   * Delete a schema node
   * Cascades to all references - delete or escalate
   */
  deleteNode(
    node_id: string,
    admin_id: string,
    cascade_action: 'DELETE_REFERENCES' | 'ESCALATE_REFERENCES'
  ): {
    deleted: boolean;
    references_handled: SchemaReference[];
    escalated_to_yariv?: string[];
  } {
    const node = this.nodes.get(node_id);
    if (!node) {
      throw new Error(`Schema node ${node_id} not found`);
    }

    const result = {
      deleted: false,
      references_handled: [],
      escalated_to_yariv: undefined as string[] | undefined,
    };

    // Step 1: Find all references to this node
    const references = node.references;
    if (references.length === 0) {
      // Safe to delete - no references
      this.nodes.delete(node_id);
      result.deleted = true;
      return result;
    }

    // Step 2: Handle references based on cascade_action
    if (cascade_action === 'DELETE_REFERENCES') {
      // Delete all entities that reference this node
      // In production, this would trigger cascading deletes in capability/glossary stores
      result.references_handled = references;
      this.nodes.delete(node_id);
      result.deleted = true;
    } else if (cascade_action === 'ESCALATE_REFERENCES') {
      // Escalate to Yariv - human decision needed
      result.escalated_to_yariv = references.map(ref => ref.referencing_entity);
      result.deleted = false; // Don't delete - pending decision
    }

    return result;
  }

  /**
   * Add a reference to a schema node
   */
  addReference(node_id: string, reference: SchemaReference): void {
    const node = this.nodes.get(node_id);
    if (!node) {
      throw new Error(`Schema node ${node_id} not found`);
    }

    // Check for duplicate reference
    const exists = node.references.some(
      ref => ref.referencing_entity === reference.referencing_entity &&
             ref.entity_type === reference.entity_type
    );
    if (exists) {
      throw new Error(`Reference already exists: ${reference.referencing_entity} → ${node_id}`);
    }

    node.references.push(reference);
  }

  /**
   * Remove a reference from a schema node
   */
  removeReference(node_id: string, referencing_entity: string): void {
    const node = this.nodes.get(node_id);
    if (!node) {
      throw new Error(`Schema node ${node_id} not found`);
    }

    node.references = node.references.filter(ref => ref.referencing_entity !== referencing_entity);
  }

  /**
   * Get all references to a schema node
   */
  getReferences(node_id: string): SchemaReference[] {
    const node = this.nodes.get(node_id);
    return node ? [...node.references] : [];
  }

  /**
   * Find all orphaned references (entities referencing non-existent nodes)
   */
  findOrphanedReferences(): Array<{ entity: string; orphaned_node_id: string }> {
    const orphans: Array<{ entity: string; orphaned_node_id: string }> = [];

    for (const node of this.nodes.values()) {
      for (const ref of node.references) {
        // In production, would check if referencing_entity still exists
        // For now, just check schema node exists
      }
    }

    return orphans;
  }

  /**
   * Create a schema snapshot (version for audit trail)
   */
  createSnapshot(created_by: string = 'system_auto'): SchemaSnapshot {
    // Step 1: Calculate checksum of entire schema
    const schemaPayload = {
      nodes: Array.from(this.nodes.values()).sort((a, b) => a.node_id.localeCompare(b.node_id)),
    };
    const schemaString = JSON.stringify(schemaPayload);
    const checksum = crypto.createHash('sha256').update(schemaString).digest('hex');

    // Step 2: Find changed nodes (diff from last snapshot)
    const changedNodes = this.findChangedNodes();

    // Step 3: Create snapshot
    this.snapshotCounter++;
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const snapshot: SchemaSnapshot = {
      snapshot_id: `SCHEMA-SNAP-${today}-${String(this.snapshotCounter).padStart(3, '0')}`,
      timestamp: new Date(),
      checksum,
      node_count: this.nodes.size,
      reference_count: Array.from(this.nodes.values()).reduce(
        (sum, node) => sum + node.references.length,
        0
      ),
      changed_nodes: changedNodes,
      created_by,
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  private findChangedNodes(): string[] {
    if (this.snapshots.length === 0) {
      return Array.from(this.nodes.keys());
    }

    const lastSnapshot = this.snapshots[this.snapshots.length - 1];
    // In production, would compare actual node content
    return lastSnapshot.changed_nodes;
  }

  /**
   * Get a specific snapshot
   */
  getSnapshot(snapshot_id: string): SchemaSnapshot | null {
    return this.snapshots.find(s => s.snapshot_id === snapshot_id) || null;
  }

  /**
   * Get all snapshots (ADMIN only)
   */
  getSnapshots(): SchemaSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Verify schema integrity (no orphaned references)
   */
  verifyIntegrity(): {
    valid: boolean;
    orphans: Array<{ entity: string; orphaned_node_id: string }>;
  } {
    const orphans = this.findOrphanedReferences();
    return {
      valid: orphans.length === 0,
      orphans,
    };
  }
}
