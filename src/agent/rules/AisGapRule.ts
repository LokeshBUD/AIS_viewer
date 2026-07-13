import type { VesselState } from '../../ais/types'
import type { AnomalyAlert } from '../AlertManager'
import { AIS_GAP_WARNING_MS, AIS_GAP_CRITICAL_MS } from '../../utils/constants'

export function checkAisGap(vessel: VesselState): AnomalyAlert | null {
  // Must have been genuinely active — not just a snapshot stub
  if (vessel.history.length < 5) return null

  const gap = Date.now() - vessel.lastUpdate
  if (gap < AIS_GAP_WARNING_MS) return null

  const severity = gap >= AIS_GAP_CRITICAL_MS ? 'critical' : 'warning'
  const gapMin   = Math.round(gap / 60_000)
  const lastUtc  = new Date(vessel.lastUpdate).toISOString().slice(11, 16) + ' UTC'

  return {
    id:        `${vessel.mmsi}-AIS_GAP-${Math.floor(Date.now() / AIS_GAP_WARNING_MS)}`,
    mmsi:      vessel.mmsi,
    name:      vessel.name,
    type:      'AIS_GAP',
    severity,
    message:   `No AIS signal for ${gapMin} min (last seen ${lastUtc})`,
    lat:       vessel.lat,
    lon:       vessel.lon,
    timestamp: Date.now(),
  }
}
