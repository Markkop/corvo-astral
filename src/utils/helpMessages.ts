export default {
  alma: {
    help: {
      en: 'Discover the Almanax bonus for the current day',
      pt: 'Descubra o bônus do Almanax para o dia atual',
      es: 'Descubra el bono Almanax para el día actual',
      fr: 'Découvrez le bonus Almanax du jour en cours'
    },
    examples: ['/alma', '/alma lang: fr']
  },
  calc: {
    help: {
      en: `Calculate the damage of an attack dealt.
Parameters:
* \`dmg\`: total domain (major elemental + secondary)
* \`base\`: skill base damage
* \`res\`: target's resistance. It can be in% or total
* \`crit\`: critical chance in% (optional)`,
      pt: `Calcule o dano de um ataque causado.
Parâmetros:
* \`dmg\`: domínio total (maior elemental + secundários)
* \`base\`: dano base da skill
* \`res\`: resistência do alvo. Pode ser em % ou total
* \`crit\`: chance crítica em % (opcional)`,
      es: `Calcula el daño de un ataque infligido.
Parámetros:
* \`dmg\`: dominio total (elemental mayor + secundario)
* \`base\`: daño de la base de habilidades
* \`res\`: resistencia del objetivo. Puede estar en% o total
* \`crit\`: probabilidad crítica en% (opcional)`,
      fr: `Calculez les dégâts infligés par une attaque.
Paramètres:
* \`dmg\`: dégâts totaux (élémentaire majeur + secondaire)
* \`base\`: dégâts de base de compétences
* \`res\`: résistance de la cible. Cela peut être en % ou au total
* \`crit\`: chance critique en % (optionnel)`
    },
    examples: [
      '/calc dmg:3000 base:55 res:60%',
      '/calc dmg:5000 base:40 res:420 crit:30%'
    ]
  },
  subli: {
    help: {
      en: `Search for sublimations by name or slots combination.
Use "random" to search for matches in any order.`,
      pt: `Pesquise por sublimações pelo nome ou combinação de slots.
Utilize "random" para procurar combinações em qualquer ordem.`,
      es: `Busque sublimaciones por nombre o combinación de ranuras.
Utilice "random" para buscar coincidencias en cualquier orden.`,
      fr: `Recherchez les sublimations par nom ou combinaison d'emplacements.
Utilisez "random" pour rechercher des correspondances dans n'importe quel ordre.`
    },
    examples: [
      '/subli by-name name: bruta',
      '/subli by-name name: bruta translate: fr',
      '/subli by-name name: talho lang: pt',
      '/subli by-slots slots: rwb',
      '/subli by-slots slots: rgbg random:true',
      '/subli by-slots slots: epic',
    ]
  },
  equip: {
    help: {
      en: 'Search by equipment name and / or rarity',
      pt: 'Pesquise pelo nome do equipamento e/ou raridade',
      es: 'Buscar por nombre de equipo y / o rareza',
      fr: "Recherche par nom d'équipement et / ou rareté"
    },
    examples: [
      '/equip name: martelo de osamodas lang: pt',
      '/equip name: the eternal rarity: mythical'
    ]
  },
  about: {
    help: {
      en: 'Displays information about Corvo Astral',
      pt: 'Exibe informações sobre o Corvo Astral',
      es: 'Muestra información sobre el Corvo Astral',
      fr: 'Affiche des informations sur Corvo Astral'
    },
    examples: ['/about']
  },
  "party-create": {
    help: {
      en: 'Create party groups to recruite other players for dungeons and events. \nPlayers can join and leave the party by reacting to class emojis',
      pt: 'Crie grupos de grupo para recrutar outros jogadores para dungeons e eventos. \nJogadores podem entrar e sair do grupo reagindo nos emojis de classe',
      es: 'Crea grupos de grupo para reclutar a otros jugadores para mazmorras y eventos. \nLos jugadores pueden unirse y abandonar la fiesta reaccionando a los emojis de clase.',
      fr: "Créez des groupes pour recruter d'autres joueurs pour les donjons et les événements.\nLes joueurs peuvent rejoindre et quitter la fête en réagissant aux emojis de classe"
    },
    examples: [
      '/party-create name: Boss Smasher',
      "/party-create name: Ogrest description: If it's your first time, it's okay date: Tomorrow 8PM level: 200 slots: 3"
    ]
  },
  "party-update": {
    help: {
      en: 'Change details for a group listing whose leader is you',
      pt: 'Altere detalhes de uma listagem de grupo cujo líder é você',
      es: 'Cambiar los detalles de una ficha de grupo cuyo líder eres tú',
      fr: "Modifier les détails d'une fiche de groupe dont vous êtes le chef",
    },
    examples: [
      '/party-update id: 20 date: 02/04/2020 '
    ]
  },
  recipe: {
    help: {
      en: 'See recipes.',
      pt: 'Consulte as receitas de items.',
      es: 'Ver recetas.',
      fr: 'Voir les recettes.'
    },
    examples: [
      '/recipe name: brakmar sword',
      '/recipe name: espada de brakmar lang: pt',
      '/recipe name: peace pipe rarity: mythical',
      '/recipe name: o eterno rarity: mítico lang: pt'
    ]
  },
  config: {
    help: {
      en:
        "Change some of this bot's configuration for your guild. You need admin permission for this.",
      pt: 'Altere algumas configurações deste bot para sua guilda. Você precisa de permissão de administrador para isso. ',
      es: 'Cambia parte de la configuración de este bot para tu gremio. Necesita permiso de administrador para esto.',
      fr: "Modifiez une partie de la configuration de ce bot pour votre guilde. Vous avez besoin d'une autorisation d'administrateur pour cela."
    },
    examples: [
      '/config get',
      '/config set lang: en',
      '/config set almanax-channel: #temple-bonus',
      '/config set party-channel: #party-listing',
    ]
  }
}
