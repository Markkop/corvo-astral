import equipmentList from '../../data/equipment.json'
import { commandsHelp } from './help'
import config from '../config'
const { rarityColors } = config

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

    const equipRarity = equip.rarity || 0
    return equipRarity === higherRarity
  })
}

/**
 * Find a equipment list by matching name.
 *
 * @param {object[]} equipmentList
 * @param {string} query
 * @returns {object[]}
 */
function findEquipmentByName (equipmentList, query) {
  return removeLowerRarities(equipmentList).filter(equip => equip.title.toLowerCase().includes(query))
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

const rarityEmojiMap = {
  1: ':white_circle:',
  2: ':green_circle:',
  3: ':orange_circle:',
  4: ':yellow_circle:',
  5: ':purple_circle:',
  6: ':blue_circle:',
  7: ':purple_circle:'
}

const rarityNameMap = {
  1: 'Comum',
  2: 'Raro',
  3: 'Mítico',
  4: 'Lendário',
  5: 'Relíquia',
  6: 'Anelembrança',
  7: 'Épico'
}

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
 * Replies the user information about the given equipment.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 */
export async function getEquipment (message) {
  const query = message.content.split(' ').slice(1).join(' ').toLowerCase()
  if (!query) {
    message.channel.send({
      embed: {
        color: '#ffffff',
        title: ':grey_question: Ajuda: `.equip`',
        description: commandsHelp.equip
      }
    })
    return
  }
  let results = []
  let hasFoundByName = false
  hasFoundByName = true

  results = findEquipmentByName(equipmentList, query)
  const equipDetails = results[0]
  if (equipDetails) {
    hasFoundByName = true
  }
  if (!results.length) {
    message.channel.send({
      embed: {
        color: '#bb1327',
        title: ':x: Nenhum equipamento encontrado',
        description: 'Digite `.help equip` para conferir alguns exemplos de como pesquisar.'
      }
    })
    return
  }

  const equipamentsFoundText = results.map(equip => equip.title).join(', ').trim()
  if (hasFoundByName) {
    const firstResult = equipDetails
    const equipEmbed = {
      color: rarityColors[rarityNameMap[firstResult.rarity]] || rarityColors.other,
      title: `${rarityEmojiMap[firstResult.rarity]} ${firstResult.title}`,
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
          value: rarityNameMap[firstResult.rarity],
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
        name: 'Em uso:',
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
    if (results.length > 1) {
      equipEmbed.footer = {
        text: `Equipamentos encontrados: ${equipamentsFoundText}`
      }
    }
    message.channel.send({ embed: equipEmbed })
  }
}
