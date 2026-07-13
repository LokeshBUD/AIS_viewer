import type { PositionSnapshot } from '../ais/types'

// ── Interface ─────────────────────────────────────────────────────────────────
// Swap the in-memory impl for SQLite/InfluxDB later without touching callers.

export interface IHistoryStore {
  /** Append a new position snapshot for a vessel */
  append(mmsi: number, snapshot: PositionSnapshot): void
  /** Return snapshots in [fromTs, toTs] range, oldest-first */
  query(mmsi: number, fromTs: number, toTs: number): PositionSnapshot[]
  /** Remove all snapshots older than cutoff timestamp */
  prune(olderThanTs: number): void
  /** Total number of snapshots stored across all vessels */
  readonly size: number
}

// ── In-memory implementation ──────────────────────────────────────────────────
// Per-vessel deque capped at MAX_PER_VESSEL. Evicts oldest on overflow.

const MAX_PER_VESSEL = 1000

export class InMemoryHistoryStore implements IHistoryStore {
  private store = new Map<number, PositionSnapshot[]>()
  private _size = 0

  append(mmsi: number, snapshot: PositionSnapshot): void {
    let buf = this.store.get(mmsi)
    if (!buf) {
      buf = []
      this.store.set(mmsi, buf)
    }
    buf.push(snapshot)
    this._size++
    if (buf.length > MAX_PER_VESSEL) {
      buf.shift()   // evict oldest
      this._size--
    }
  }

  query(mmsi: number, fromTs: number, toTs: number): PositionSnapshot[] {
    const buf = this.store.get(mmsi)
    if (!buf) return []
    return buf.filter(s => s.timestamp >= fromTs && s.timestamp <= toTs)
  }

  prune(olderThanTs: number): void {
    for (const [mmsi, buf] of this.store) {
      const before = buf.length
      const kept   = buf.filter(s => s.timestamp >= olderThanTs)
      this._size  -= before - kept.length
      if (kept.length === 0) {
        this.store.delete(mmsi)
      } else {
        this.store.set(mmsi, kept)
      }
    }
  }

  get size(): number { return this._size }
}
