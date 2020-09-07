import equipmentList from '../../data/equipment.json'

/**
 * Identify actions from all equipment effects.
 *
 * @returns {object}
 */
function identifyActionValues () {
  return equipmentList.reduce((actionValues, equip) => {
    const effects = equip.effects
    const equipActions = effects.reduce((equipActions, effect) => {
      if (actionValues[effect.action]) {
        return equipActions
      }

      return {
        ...equipActions,
        [effect.action]: effect.descriptions[0]
          .replace('[el1]', 'fogo')
          .replace('[el2]', 'agua')
          .replace('[el3]', 'terra')
          .replace('[el4]', 'ar')
          .replace(/[0-9]| de/g, '')
          .replace(/\s\s+/g, ' ')
          .trim()
      }
    }, {})
    return { ...actionValues, ...equipActions }
  }, {})
}

/**
 * Identify actions from all equipment effects.
 *
 * @returns {object}
 */
function identifyUseEffectsActionValues () {
  return equipmentList.reduce((actionValues, equip) => {
    const useEffects = equip.useEffects
    const equipActions = useEffects.reduce((equipActions, useEffect) => {
      if (actionValues[useEffect.action]) {
        return equipActions
      }

      return {
        ...equipActions,
        [useEffect.action]: useEffect.descriptions[0]
          .replace('[el1]', 'fogo')
          .replace('[el2]', 'agua')
          .replace('[el3]', 'terra')
          .replace('[el4]', 'ar')
          .replace(/[0-9]| de/g, '')
          .replace(/\s\s+/g, ' ')
          .trim()
      }
    }, {})
    return { ...actionValues, ...equipActions }
  }, {})
}

console.log({
  effectsActions: identifyActionValues(),
  useEffectsActions: identifyUseEffectsActionValues()
})
