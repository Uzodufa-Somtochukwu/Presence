import { presenceUnlocks } from '../data/presenceUnlocks.js';
import { addPointsHistory, getPresencePoints } from './points.js';

export function getPresenceUnlock(itemId) {
  return presenceUnlocks.find((item) => item.id === itemId) || null;
}

export function getUnlockCost(itemId) {
  return getPresenceUnlock(itemId)?.cost ?? null;
}

export function isPresenceItemUnlocked(settings, itemId) {
  return Array.isArray(settings?.unlockedPresenceItems) &&
    settings.unlockedPresenceItems.includes(itemId);
}

export function canAffordUnlock(settings, itemId) {
  const cost = getUnlockCost(itemId);
  return cost !== null && getPresencePoints(settings) >= cost;
}

export function unlockPresenceItem(settings, itemId, timestamp = Date.now()) {
  const item = getPresenceUnlock(itemId);

  if (!item) return { success: false, reason: 'not-found' };
  if (!item.available) return { success: false, reason: 'coming-soon' };
  if (isPresenceItemUnlocked(settings, itemId)) {
    return { success: false, reason: 'already-unlocked' };
  }
  if (!canAffordUnlock(settings, itemId)) {
    return { success: false, reason: 'insufficient-points' };
  }

  const unlockedPresenceItems = Array.isArray(settings?.unlockedPresenceItems)
    ? settings.unlockedPresenceItems
    : [];
  const currentPoints = getPresencePoints(settings);

  return {
    success: true,
    updates: {
      points: currentPoints - item.cost,
      unlockedPresenceItems: [...unlockedPresenceItems, itemId],
      pointsHistory: addPointsHistory(
        settings,
        item.name,
        -item.cost,
        timestamp,
        { type: 'spend', item: item.name }
      ),
    },
  };
}
