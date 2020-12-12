import { parseEffect } from './parseEffect'

/**
 * Mock an effect.
 *
 * @param {number} actionId
 * @param {number[]} params
 * @param {object} description
 * @returns {object}
 */
function mockEffect (actionId, params, description) {
  const effect = {
    definition: {
      id: 219518,
      actionId,
      params
    }
  }
  if (description) {
    effect.description = description
  }
  return effect
}

describe('parseEffect', () => {
  describe('Elemental Gain on a variable number of elements (action 1068)', () => {
    it('with one elemental gain ', () => {
      const effect = mockEffect(1068, [15, 0, 1, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '15 Mastery of 1 random elements', // Theres a bug on actions.json: element{[=2]?:s}}
        es: '15 Dominio de 1 elemento aleatorio',
        fr: '15 Maîtrise sur 1 élément aléatoire',
        pt: '15 Domínio sobre 1 elemento aleatório'
      })
    })

    it('with two elemental gain', () => {
      const effect = mockEffect(1068, [15, 0, 2, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '15 Mastery of 2 random element', // Theres a bug on actions.json: element{[=2]?:s}}
        es: '15 Dominio de 2 elementos aleatorios',
        fr: '15 Maîtrise sur 2 éléments aléatoires',
        pt: '15 Domínio sobre 2 elementos aleatórios'
      })
    })

    it('with three elemental gain', () => {
      const effect = mockEffect(1068, [15, 0, 3, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '15 Mastery of 3 random elements',
        es: '15 Dominio de 3 elementos aleatorios',
        fr: '15 Maîtrise sur 3 éléments aléatoires',
        pt: '15 Domínio sobre 3 elementos aleatórios'
      })
    })

    // This case is never used
    it('with three parameters', () => {
      const effect = mockEffect(1068, [15, 0, 1, 0, 1, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '15 Mastery 1',
        es: '15 Dominio1',
        fr: '15 Maîtrise 1',
        pt: '15 Domínio1'
      })
    })
  })

  describe('Light Damage (action 1083)', () => {
    it('with only 1 parameter', () => {
      const effect = mockEffect(1083, [3, 0.262])
      const parsedEffect = parseEffect(effect, 30)
      expect(parsedEffect.description).toEqual({
        en: '[el6] Damage: 10',
        es: 'Daño [el6]: 10',
        fr: 'Dommage [el6] : 10',
        pt: 'Dano [el6]: 10'
      })
    })

    // This case is never used
    it('hp max of the caster', () => {
      const effect = mockEffect(1083, [3, 0.262, 0, 0, 1, 0, 1, 0])
      const parsedEffect = parseEffect(effect, 30)
      expect(parsedEffect.description).toEqual({
        en: '[el6] Damage: 10% of HP max of the caster',
        es: 'Daño [el6]: 10% de los PdV máx. del lanzador',
        fr: 'Dommage [el6] : 10% des PV max du lanceur',
        pt: 'Dano [el6]: 10% dos PV máx. do lançador'
      })
    })

    // This case is never used
    it('hp current of the target', () => {
      const effect = mockEffect(1083, [3, 0.262, 0, 0, 5, 0, 1, 0])
      const parsedEffect = parseEffect(effect, 30)
      expect(parsedEffect.description).toEqual({
        en: '[el6] Damage: 10% of HP current of the target',
        es: 'Daño [el6]: 10% de los PdV actuales del objetivo',
        fr: 'Dommage [el6] : 10% des PV courants de la cible',
        pt: 'Dano [el6]: 10% dos PV atuais do alvo'
      })
    })
  })

  describe('States (action 304)', () => {
    it('with "Legwhat" equipment', () => {
      const effect = mockEffect(304, [1348, 0, 1, 0, -1, 0])
      const parsedEffect = parseEffect(effect, 75)
      expect(parsedEffect.description).toEqual({
        en: 'Legwhat? ',
        es: 'Ytudondeta ',
        fr: 'Etoi Eskeutula ',
        pt: 'Pernoquê? '
      })
    })

    // This case is never used
    it('with a percent chance parameter', () => {
      const effect = mockEffect(304, [5080, 0, 1, 0, 50, 0])
      const parsedEffect = parseEffect(effect, 75)
      expect(parsedEffect.description).toEqual({
        en: 'Trust (50%)',
        es: 'Confianza (50%)',
        fr: 'Confiance (50%)',
        pt: 'Confiança (50%)'
      })
    })

    it('with state without title', () => {
      const effect = mockEffect(304, [3192, 0, 1, 0, -1, 0])
      const parsedEffect = parseEffect(effect, 75)
      expect(parsedEffect.description).toEqual({
        en: 'Unknown effect ',
        es: 'Unknown effect ',
        fr: 'Unknown effect ',
        pt: 'Unknown effect '
      })
    })
  })

  describe('Spell Level Gain (action 832)', () => {
    it('on air spells', () => {
      const effect = mockEffect(832, [4, 0, 3, 0])
      const parsedEffect = parseEffect(effect, 125)
      expect(parsedEffect.description).toEqual({
        en: '3 Lvl. to Air spells',
        es: '3 niv. a hechizos Aire',
        fr: '3 Niv. aux sorts Air',
        pt: '3 nv. aos feitiços Ar'
      })
    })
  })

  describe('Harvest Quantity Gain (action 2001)', () => {
    it('on Snoofle pet', () => {
      const effect = mockEffect(2001, [10, 0.8, 73, 0])
      const parsedEffect = parseEffect(effect, 50)
      expect(parsedEffect.description).toEqual({
        en: '50% Harvesting Quantity in Miner',
        es: '50% cantidad de recolección en Minero',
        fr: '50% Quantité Récolte en Mineur',
        pt: '50% de quantidade de colheita para Mineiro'
      })
    })
  })

  describe('Characteristic Id', () => {
    it('armor received (action 39)', () => {
      const effect = mockEffect(39, [10, 0, 0, 0, 121, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '10% Armor given',
        es: '10% Armadura dada',
        fr: '10% Armure donnée',
        pt: '10% de Armadura concedida'
      })
    })

    it('armor received (action 40)', () => {
      const effect = mockEffect(40, [40, 0, 0, 0, 121, 0])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: '-40% Armor given',
        es: '-40% Armadura dada',
        fr: '-40% Armure donnée',
        pt: '-40% de Armadura concedida'
      })
    })
  })

  describe('Null Effect (action 400)', () => {
    it('ignores parsing', () => {
      const effect = mockEffect(400, [])
      const parsedEffect = parseEffect(effect, 50)
      expect(parsedEffect).toEqual(effect)
    })
  })

  describe('Makabrakfire hardcoding (action 1020)', () => {
    it('2hard4me', () => {
      const effect = mockEffect(1020, [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0.001])
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        en: 'Reflects 10% of damage',
        es: 'Devuelve un 10% de los daños',
        fr: 'Renvoie 10% des dégâts',
        pt: 'Reenvia 10% dos danos'
      })
    })
  })

  describe('Use custom description', () => {
    it('for action id 40', () => {
      const effect = mockEffect(40, [40, 0, 0, 0, 121, 0])
      effect.description = {
        fr: '[#1]% Armure reçue',
        en: '[#1]% Armor received',
        es: '[#1]% armadura recibida',
        pt: '[#1]% de Armadura recebida'
      }
      const parsedEffect = parseEffect(effect, 100)
      expect(parsedEffect.description).toEqual({
        fr: '40% Armure reçue',
        en: '40% Armor received',
        es: '40% armadura recibida',
        pt: '40% de Armadura recebida'
      })
    })
  })
})
