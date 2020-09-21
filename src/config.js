const defaultConfig = {
  lang: 'en',
  prefix: '.',
  almanaxChannel: 'almanax',
  partyChannel: 'listagem-de-grupos'
}

export default {
  defaultConfig,
  guildsOptions: [],
  classEmoji: {
    '🐲': 'Osa',
    '🛡️': 'Feca',
    '🏥': 'Eni',
    '🕰️': 'Xel',
    '💰': 'Enu',
    '🌈': 'Hup',
    '💢': 'Sac',
    '😼': 'Eca',
    '🐶': 'Ouginak',
    '💀': 'Sram',
    '🥊': 'Iop',
    '🏹': 'Cra',
    '🌱': 'Sadi',
    '🐼': 'Panda',
    '💣': 'Rogue',
    '🎭': 'Mask',
    '🤖': 'Fogger',
    '🌀': 'Elio'
  },
  rarityMap: {
    1: {
      name: {
        en: 'Unusual',
        es: 'Inhabituel',
        fr: 'Inhabituel',
        pt: 'Comum'
      },
      emoji: ':white_circle:',
      color: 'LIGHT_GREY'
    },
    2: {
      name: {
        en: 'Rare',
        es: 'Raro',
        fr: 'Rare',
        pt: 'Raro'
      },
      emoji: ':green_circle:',
      color: '#28f18b'
    },
    3: {
      name: {
        en: 'Mythical',
        es: 'Mítico',
        fr: 'Mythique',
        pt: 'Mítico'
      },
      emoji: ':orange_circle:',
      color: '#fd8e39'
    },
    4: {
      name: {
        en: 'Legendary',
        es: 'Legendario',
        fr: 'Légendaire',
        pt: 'Lendário'
      },
      emoji: ':yellow_circle:',
      color: '#fede71'
    },
    5: {
      name: {
        en: 'Relic',
        es: 'Reliquia',
        fr: 'Relique',
        pt: 'Relíquia'
      },
      emoji: ':purple_circle:',
      color: '#ff47e7'
    },
    6: {
      name: {
        en: 'Souvenir',
        es: 'Recuerdo',
        fr: 'Souvenir',
        pt: 'Anelembrança'
      },
      emoji: ':blue_circle:',
      color: '#8fc7e2'
    },
    7: {
      name: {
        en: 'Epic',
        es: 'Epique',
        fr: 'Epique',
        pt: 'Épico'
      },
      emoji: ':purple_circle:',
      color: '#fd87ba'
    },
    10: {
      name: {
        en: 'Impossible',
        es: 'Impossible',
        fr: 'Impossible',
        pt: 'Impossível'
      },
      emoji: ':purple_circle:',
      color: '#ff47e7'
    }
  },
  jobsMap: {
    40: {
      emoji: ':bread:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Boulanger',
        en: 'Baker',
        es: 'Panadero',
        pt: 'Padeiro'
      }
    },
    64: {
      emoji: ':corn:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Paysan',
        en: 'Farmer',
        es: 'Campesino',
        pt: 'Fazendeiro'
      }
    },
    71: {
      emoji: ':palm_tree:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Forestier',
        en: 'Lumberjack',
        es: 'Leñador',
        pt: 'Lenhador'
      }
    },
    72: {
      emoji: ':sunflower:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Herboriste',
        en: 'Herbalist',
        es: 'Herbolario',
        pt: 'Herborista'
      }
    },
    73: {
      emoji: ':pick:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Mineur',
        en: 'Miner',
        es: 'Minero',
        pt: 'Mineiro'
      }
    },
    74: {
      emoji: ':shell:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Trappeur',
        en: 'Trapper',
        es: 'Peletero',
        pt: 'Caçador'
      }
    },
    75: {
      emoji: ':fish:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919456.png',
      title: {
        fr: 'Pêcheur',
        en: 'Fisherman',
        es: 'Pescador',
        pt: 'Pescador'
      }
    },
    76: {
      emoji: ':spaghetti:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919802.png',
      title: {
        fr: 'Cuisinier',
        en: 'Chef',
        es: 'Cocinero',
        pt: 'Cozinheiro'
      }
    },
    77: {
      emoji: ':shield:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919810.png',
      title: {
        fr: 'Armurier',
        en: 'Armorer',
        es: 'Armero',
        pt: 'Armeiro'
      }
    },
    78: {
      emoji: ':ring:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919811.png',
      title: {
        fr: 'Bijoutier',
        en: 'Jeweler',
        es: 'Joyero',
        pt: 'Joalheiro'
      }
    },
    79: {
      emoji: ':womans_hat:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919809.png',
      title: {
        fr: 'Tailleur',
        en: 'Tailor',
        es: 'Sastre',
        pt: 'Alfaiate'
      }
    },
    80: {
      emoji: ':boot:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919804.png',
      title: {
        fr: 'Maroquinier',
        en: 'Leather Dealer',
        es: 'Marroquinero',
        pt: 'Coureiro'
      }
    },
    81: {
      emoji: ':chair:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919805.png',
      title: {
        fr: 'Ebéniste',
        en: 'Handyman',
        es: 'Ebanista',
        pt: 'Marceneiro'
      }
    },
    83: {
      emoji: ':crossed_swords:',
      recipeImage: 'https://static.ankama.com/wakfu/portal/game/item/115/71919807.png',
      title: {
        fr: 'Maitre d\'Armes',
        en: 'Weapons Master',
        es: 'Maestro de armas',
        pt: 'Mestre de armas'
      }
    }
  },
  equipTypesMap: {
    101: {
      fr: 'Hache',
      en: 'Axe',
      es: 'Hacha',
      pt: 'Machado'
    },
    103: {
      fr: 'Anneau',
      en: 'Ring',
      es: 'Anillo',
      pt: 'Anel'
    },
    108: {
      fr: 'Baguette',
      en: 'Wand',
      es: 'Varita',
      pt: 'Varinha'
    },
    110: {
      fr: 'Epée',
      en: 'Sword',
      es: 'Espada',
      pt: 'Espada'
    },
    111: {
      fr: 'Pelle',
      en: 'Shovel',
      es: 'Pala',
      pt: 'Pá'
    },
    112: {
      fr: 'Dague',
      en: 'Dagger',
      es: 'Daga',
      pt: 'Adaga'
    },
    113: {
      fr: 'Bâton',
      en: 'One-handed Staff',
      es: 'Bastón',
      pt: 'Bastão'
    },
    114: {
      fr: 'Marteau',
      en: 'Hammer',
      es: 'Martillo',
      pt: 'Martelo'
    },
    115: {
      fr: 'Aiguille',
      en: 'Hand',
      es: 'Aguja',
      pt: 'Ponteiro'
    },
    117: {
      fr: 'Arc',
      en: 'Bow',
      es: 'Arco',
      pt: 'Arco'
    },
    119: {
      fr: 'Bottes',
      en: 'Boots',
      es: 'Botas',
      pt: 'Botas'
    },
    120: {
      fr: 'Amulette',
      en: 'Amulet',
      es: 'Amuleto',
      pt: 'Amuleto'
    },
    132: {
      fr: 'Cape',
      en: 'Cloak',
      es: 'Capa',
      pt: 'Capa'
    },
    133: {
      fr: 'Ceinture',
      en: 'Belt',
      es: 'Cinturón',
      pt: 'Cinto'
    },
    134: {
      fr: 'Casque',
      en: 'Helmet',
      es: 'Casco',
      pt: 'Capacete'
    },
    136: {
      fr: 'Plastron',
      en: 'Breastplate',
      es: 'Coraza',
      pt: 'Peitoral'
    },
    138: {
      fr: 'Epaulettes',
      en: 'Epaulettes',
      es: 'Hombreras',
      pt: 'Dragonas'
    },
    189: {
      fr: 'Bouclier',
      en: 'Shield',
      es: 'Escudo',
      pt: 'Escudo'
    },
    219: {
      fr: 'Poing',
      en: 'Fist',
      es: 'Puño',
      pt: 'Punho '
    },
    223: {
      fr: 'Epée à 2 mains',
      en: 'Two-handed Sword',
      es: 'Espada a dos manos',
      pt: 'Espada de 2 mãos'
    },
    253: {
      fr: 'Bâton à 2 mains',
      en: 'Two-handed Staff',
      es: 'Bastón a dos manos',
      pt: 'Bastão de 2 mãos'
    },
    254: {
      fr: 'Cartes',
      en: 'Cards',
      es: 'Cartas',
      pt: 'Cartas'
    },
    480: {
      fr: 'Torches',
      en: 'Torches',
      es: 'Antorchas',
      pt: 'Tochas'
    },
    518: {
      fr: 'Armes 1 Main',
      en: 'One-Handed Weapons',
      es: 'Armas de una mano',
      pt: 'Armas de 1 mão'
    },
    519: {
      fr: 'Armes 2 Mains',
      en: 'Two-Handed Weapons',
      es: 'Armas de dos manos',
      pt: 'Armas de 2 mãos'
    },
    520: {
      fr: 'Seconde Main',
      en: 'Second Hand',
      es: 'Segunda mano',
      pt: 'Segunda mão'
    },
    537: {
      fr: 'Outils',
      en: 'Tools',
      es: 'Herramientas',
      pt: 'Ferramentas'
    },
    582: {
      fr: 'Familiers',
      en: 'Pets',
      es: 'Mascotas',
      pt: 'Mascotes'
    },
    611: {
      fr: 'Montures',
      en: 'Mounts',
      es: 'Monturas',
      pt: 'Montarias'
    },
    646: {
      fr: 'Emblème',
      en: 'Emblem',
      es: 'Emblema',
      pt: 'Emblema'
    },
    647: {
      fr: 'Costumes',
      en: 'Costumes',
      es: 'Trajes',
      pt: 'Trajes'
    }
  }
}
