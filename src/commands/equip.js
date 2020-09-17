import equipmentList from '../../data/equipment.json'
import recipesData from '../../data/recipes.json'
import { getRecipeFields } from './recipe'
import { mountCommandHelpEmbed } from './help'
import { getArgumentsAndOptions } from '../utils/message'
import config from '../config'
const { rarityMap } = config

const iconCodeMap = {
  '[el1]': ':fire:',
  '[el2]': ':droplet:',
  '[el3]': ':herb:',
  '[el4]': ':dash:',
  '[el6]': ':star2:',
  '[HLINE]': ':left_right_arrow:',
  '[VLINE]': ':arrow_up_down:',
  '[CIRCLERING]': ':arrows_counterclockwise:',
  '[*]': ''
}

// eslint-disable-next-line
const actionsMap = {
  20: 'PV',
  21: '- Pontos Vida',
  26: 'Domínio cura',
  31: 'PA',
  32: '- PA',
  39: '% Armadura recebida',
  41: 'PM',
  42: '- PM',
  56: '- PA máximo',
  57: '- PM máximo',
  71: 'Resistência costas',
  80: 'resistência elementar',
  82: 'Resistência a fogo',
  83: 'Resistência a agua',
  84: 'Resistência a terra',
  85: 'Resistência a ar',
  96: '- Resistência a terra',
  97: '- Resistência a fogo',
  98: '- Resistência a agua',
  100: '- resistência elementar',
  120: 'domínio elementar',
  122: 'domínio fogo',
  123: 'domínio terra',
  124: 'domínio agua',
  125: 'domínio ar',
  130: '- domínio elementar',
  132: '- domínio fogo',
  149: 'Domínio crítico',
  150: '% Golpe crítico',
  160: 'Alcance',
  161: '- Alcance',
  162: 'Prospecção',
  166: 'Sabedoria',
  167: '-% Sabedoria',
  168: '-% Golpe crítico',
  171: 'Iniciativa',
  172: '- Iniciativa',
  173: 'Bloqueio',
  174: '- Bloqueio',
  175: 'esquiva',
  176: '- Esquiva',
  177: 'Vontade',
  180: 'Domínio costas',
  181: '- Domínio costas',
  184: 'Controle',
  191: 'PW',
  192: '- PW no máx.',
  234: 'Instrução Militar',
  304: 'aura',
  400: '+% velocidade movimento',
  832: 'nv. aos feitiços',
  875: '% Parada',
  876: '-% Parada',
  979: 'Niv. aos feitiços elementares',
  988: 'Resistência a crítico',
  1020: 'Reenvia % dos danos',
  1050: 'Domínio zona',
  1051: 'Domínio alvo único',
  1052: 'Domínio luta corpo a corpo',
  1053: 'Domínio distância',
  1055: 'Domínio Berserk',
  1056: '- Domínio crítico',
  1060: '- Domínio distância',
  1061: '- Domínio Berserk',
  1062: '- Resistência a crítico',
  1063: '- Resistência costas',
  1068: 'Domínio sobre elementos aleatórios',
  1069: 'Resistência a elementos aleatórios',
  2001: '% quantidade colheita'
}

const typeMap = {
  103: 'Anel',
  108: 'Varinha',
  110: 'Espada de uma mão',
  111: 'Pá de duas mãos',
  112: 'Adaga',
  113: 'Bastão de uma mão',
  114: 'Martelo de duas mãos',
  115: 'Arma de uma mão',
  117: 'Arco de duas mãos',
  119: 'Botas',
  120: 'Amuleto',
  132: 'Capa',
  133: 'Cinto',
  134: 'Capacete',
  136: 'Peitoral',
  138: 'Ombreira',
  189: 'Escudo',
  223: 'Espada de duas mãos',
  253: 'Bastão de duas mãos',
  254: 'Cartas de uma mão',
  480: 'Lanterna',
  511: '???',
  537: 'Profissão',
  582: 'Mascote',
  611: 'Montaria',
  646: 'Emblema'
}

/**
 * Remove equip with the same name and lower rarity.
 *
 * @param {object[]} equipmentList
 * @returns {object[]}
 */
function removeLowerRarities (equipmentList) {
  return equipmentList.filter(equip => {
    const equipName = equip.title
    const higherRarity = equipmentList.reduce((higherRarity, otherEquip) => {
      const hasSameName = otherEquip.title === equipName
      if (!hasSameName) {
        return higherRarity
      }
      return Math.max(higherRarity, otherEquip.rarity, equip.rarity)
    }, 0)

    const equipRarity = equip.rarity
    return equipRarity === higherRarity
  })
}

/**
 * Find a equipment list by matching name.
 *
 * @param {object[]} equipmentList
 * @param {string} query
 * @param {string[]} filters
 * @returns {object[]}
 */
function findEquipmentByName (equipmentList, query, filters) {
  const hasRarityFilter = Boolean(filters.raridade)
  if (!hasRarityFilter) {
    return removeLowerRarities(equipmentList).filter(equip => equip.title.toLowerCase().includes(query))
  }

  return equipmentList.filter(equip => {
    let filterAssertion = true
    const includeQuery = equip.title.toLowerCase().includes(query)
    const hasRarity = rarityMap[equip.rarity].name.toLowerCase().includes(filters.raridade)
    filterAssertion = filterAssertion && hasRarity

    return includeQuery && filterAssertion
  })
}

/**
 * Parse a text string converting icon codes to discord emojis.
 *
 * @param {string} text
 * @returns {string}
 */
function parseIconCodeToEmoji (text) {
  return text.split(/(\[.*?\])/).map(word => iconCodeMap[word] || word).join('')
}

/**
 * Get the text that displays more results.
 *
 * @param {object[]} results
 * @param {number} resultsLimit
 * @returns {string}
 */
function getMoreEquipmentText (results, resultsLimit) {
  if (results.length > resultsLimit) {
    const firstResults = results.slice(0, resultsLimit)
    const otherResults = results.slice(resultsLimit, results.length)
    const moreResultsText = ` e outros ${otherResults.length} resultados`
    return firstResults.map(equip => equip.title).join(', ').trim() + moreResultsText
  }
  return results.map(equip => equip.title).join(', ').trim()
}

/**
 * Replies the user information about the given equipment.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns { Promise<object>}.
 */
export async function getEquipment (message) {
  const { args, options } = getArgumentsAndOptions(message, '=')
  const query = args.join(' ').toLowerCase()
  if (!query) {
    const helpEmbed = mountCommandHelpEmbed(message)
    return message.channel.send({ embed: helpEmbed })
  }
  let results = []
  results = findEquipmentByName(equipmentList, query, options)
  if (!results.length) {
    return message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Nenhum equipamento encontrado',
        description: 'Digite `.help equip` para conferir alguns exemplos de como pesquisar.'
      }
    })
  }

  const firstResult = results[0]
  const equipEmbed = {
    color: rarityMap[firstResult.rarity].color,
    title: `${rarityMap[firstResult.rarity].emoji} ${firstResult.title}`,
    thumbnail: { url: `https://builder.methodwakfu.com/assets/icons/items/${firstResult.img}.webp` },
    fields: [
      {
        name: 'Nível',
        value: firstResult.level,
        inline: true
      },
      {
        name: 'Tipo',
        value: typeMap[firstResult.type],
        inline: true
      },
      {
        name: 'Raridade',
        value: rarityMap[firstResult.rarity].name,
        inline: true
      }
    ]
  }
  if (firstResult.effects.length) {
    equipEmbed.fields.push({
      name: 'Equipado',
      value: firstResult.effects.map(effect => parseIconCodeToEmoji(effect.descriptions[0])).join('\n')
    })
  }
  if (firstResult.useEffects.length) {
    equipEmbed.fields.push({
      name: 'Em uso',
      value: firstResult.useEffects.map(effect => parseIconCodeToEmoji(effect.descriptions[0])).join('\n')
    })
  }
  const hasCondititions = firstResult.conditions.description && firstResult.conditions.description.length
  if (hasCondititions) {
    equipEmbed.fields.push({
      name: 'Condições',
      value: firstResult.conditions.description[0]
    })
  }
  const recipes = recipesData.filter(recipe => recipe.result.productedItemId === firstResult.id)
  if (recipes.length) {
    const recipeFields = getRecipeFields(recipes)
    equipEmbed.fields = [
      ...equipEmbed.fields,
      ...recipeFields
    ]
  }
  const equipamentsFoundText = getMoreEquipmentText(results, 20)
  if (results.length > 1) {
    equipEmbed.footer = {
      text: `Equipamentos encontrados: ${equipamentsFoundText}`
    }
  }
  return message.channel.send({ embed: equipEmbed })
}
