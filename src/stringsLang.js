export default {
  /**
   * Capitalizes a string.
   *
   * @param {string} str
   * @returns {string}
   */
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  slots: {
    en: 'slots',
    es: 'ajustes',
    fr: 'châsses',
    pt: 'engastes'
  },
  maxStacks: {
    en: 'max stacking',
    es: 'acumulacion máxima',
    fr: 'cumul max',
    pt: 'acúmulo máximo'
  },
  effects: {
    en: 'effects',
    es: 'efectos',
    fr: 'effets',
    pt: 'efeitos'
  },
  acquiring: {
    en: 'acquiring',
    es: 'obtención',
    fr: 'obtention',
    pt: 'obtenção'
  },
  sublimations: {
    en: 'sublimations',
    es: 'sublimaciones',
    fr: 'sublimations',
    pt: 'sublimações'
  },
  sublimationsFound: {
    en: 'sublimations found',
    es: 'sublimaciones encontradas',
    fr: 'sublimations trouvées',
    pt: 'sublimações encontradas'
  },
  query: {
    en: 'query',
    es: 'consulta',
    fr: 'requête',
    pt: 'busca'
  },
  results: {
    en: 'results',
    es: 'resultados',
    fr: 'résultats',
    pt: 'resultados'
  },
  inAnyOrder: {
    en: 'in any order',
    es: 'en cualquier orden',
    fr: "dans n'importe quel ordre",
    pt: 'em qualquer ordem'
  },
  andOther: {
    en: 'and other',
    es: 'y otros',
    fr: 'et autres',
    pt: 'e outros'
  },
  level: {
    en: 'level',
    es: 'nivel',
    fr: 'niveau',
    pt: 'nível'
  },
  type: {
    en: 'type',
    es: 'tipo',
    fr: 'type',
    pt: 'tipo'
  },
  rarity: {
    en: 'rarity',
    es: 'rareza',
    fr: 'rareté',
    pt: 'raridade'
  },
  equipped: {
    en: 'equipped',
    es: 'equipado',
    fr: 'équipé',
    pt: 'equipado'
  },
  inUse: {
    en: 'in use',
    es: 'en uso',
    fr: 'utilisé',
    pt: 'em uso'
  },
  conditions: {
    en: 'conditions',
    es: 'condiciones',
    fr: 'conditions',
    pt: 'condições'
  },
  equipmentFound: {
    en: 'equipment found',
    es: 'equipo encontrado',
    fr: 'équipement trouvé',
    pt: 'equipamentos encontrados'
  },
  job: {
    en: 'profession',
    es: 'profesión',
    fr: 'métier',
    pt: 'profissão'
  },
  ingredients: {
    en: 'ingredients',
    es: 'ingredientes',
    fr: 'ingrédients',
    pt: 'ingredients'
  },
  recipe: {
    en: 'recipe',
    es: 'receta',
    fr: 'recette',
    pt: 'receita'
  },
  recipesFound: {
    en: 'recipes found',
    es: 'recetas encontradas',
    fr: 'recettes trouvées',
    pt: 'receitas encontradas'
  },
  totalDomain: {
    en: 'Total Domain',
    es: 'Dominio total',
    fr: 'Dégâts totaux',
    pt: 'Domínio Total'
  },
  baseDamage: {
    en: 'Base Damage',
    es: 'Daño base',
    fr: 'Dégâts de base',
    pt: 'Dano Base'
  },
  targetResistance: {
    en: 'Target Resistance',
    es: 'Resistencia al objetivo',
    fr: 'Résistance de la cible',
    pt: 'Resistência do Alvo'
  },
  criticalchance: {
    en: 'Critical chance',
    es: 'Oportunidad critica',
    fr: 'Chance critique',
    pt: 'Chance Crítica'
  },
  damageDone: {
    en: 'Damage done',
    es: 'Daño causado',
    fr: 'Dommages causés',
    pt: 'Dano causado'
  },
  averageDamage: {
    en: 'Average damage',
    es: 'Daño medio',
    fr: 'Dégats moyens',
    pt: 'Dano médio'
  },
  backDamage: {
    en: 'Back damage',
    es: 'Daño de espalda',
    fr: 'Dommages de dos',
    pt: 'Dano nas costas'
  },
  attackedGobbal: {
    en: 'has attacked a gobbal!',
    es: 'atacó a un jalató!',
    fr: 'a attaqué un bouftou!',
    pt: 'atacou um papatudo!'
  },
  todaysAlma: {
    en: 'today the Almanax temple bonus is',
    es: 'hoy el bono del Almanax templo es',
    fr: "aujourd'hui le bonus du temple Almanax est",
    pt: 'hoje o bônus do templo Almanax é'
  },
  party: {
    en: 'party',
    es: 'grupo',
    fr: 'groupe',
    pt: 'grupo'
  },
  noResults: {
    en: 'No results',
    es: 'No hay resultados',
    fr: 'Aucun résultat',
    pt: 'Sem resultados'
  },
  noResultsMessage: (command) => ({
    en: `Type \`.help ${command}\` to see some examples of how to search.`,
    es: `Escriba \`.help ${command}\` para ver algunos ejemplos de cómo buscar.`,
    fr: `Tapez \`.help ${command}\` pour voir quelques exemples de recherche.`,
    pt: `Digite \`.help ${command}\` para conferir alguns exemplos de como pesquisar.`
  }),
  monstersFound: {
    en: 'Monsters found',
    es: 'Monstruos encontrados',
    fr: 'Monstres trouvés',
    pt: 'Monstros encontrados'
  }
}
