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
  buildPreviewConfigCommandOptionDescription: {
    en: 'Enables use of build preview ',
    es: 'Habilita el uso de la vista previa de build',
    fr: "Permet l'utilisation de l'aperçu de les build",
    pt: 'Ativa o uso de pré-visualização de builds'
  },
  partyChannelConfigCommandOptionDescription: {
    en: 'The channel will contain the group listings',
    es: 'El canal contendrá las listas de grupos.',
    fr: 'La chaîne contiendra les listes de groupes ',
    pt: 'O canal conterá as listagens de grupo'
  },
  almanaxChannelConfigCommandOptionDescription: {
    en: 'The channel that will report the Almanax bonus daily',
    es: 'El canal que informará el bono de Almanax diariamente',
    fr: 'La chaîne qui rapportera quotidiennement le bonus Almanax',
    pt: 'O canal que informará o bônus do Almanax diariamente'
  },
  langConfigCommandOptionDescription: {
    en: 'The language that will be used in searches and in command results',
    es: 'El idioma que se utilizará en las búsquedas y en los resultados de los comandos.',
    fr: 'La langue qui sera utilisée dans les recherches et dans les résultats des commandes',
    pt: 'O idioma que será usado nas buscas e nos resultados dos comandos'
  },
  setConfigCommandDescription: {
    en: 'Change bot configuration',
    es: 'Cambiar la configuración del bot',
    fr: 'Modifier la configuration du bot ',
    pt: 'Alterar a configuração do bot '
  },
  getConfigCommandDescription: {
    en: 'View bot configuration',
    es: 'Ver la configuración del bot',
    fr: 'Afficher la configuration du bot ',
    pt: 'Visualizar a configuração do bot '
  },
  configCommandDescription: {
    en: 'View or change bot configuration',
    es: 'Ver o cambiar la configuración del bot',
    fr: 'Afficher ou modifier la configuration du bot ',
    pt: 'Visualizar ou alterar a configuração do bot '
  },
  langCommandOptionDescription: {
    en: 'The language you wish to use for this command',
    es: 'El idioma que desea utilizar para este comando',
    fr: 'La langue que vous souhaitez utiliser pour cette commande',
    pt: 'O idioma que você deseja usar para este comando'
  },
  aboutCommandDescription: {
    en: 'Displays information about Corvo Astral',
    pt: 'Exibe informações sobre o Corvo Astral',
    es: 'Muestra información sobre el Corvo Astral',
    fr: 'Affiche des informations sur Corvo Astral'
  },
  almaCommandDescription: {
    en: 'Discover the Almanax bonus for the current day',
    pt: 'Descubra o bônus do Almanax para o dia atual',
    es: 'Descubra el bono Almanax para el día actual',
    fr: 'Découvrez le bonus Almanax du jour en cours'
  },
  calcCommandDescription: {
    en: 'Calculates the damage inflicted based on player and target stats',
    es: 'Calcula el daño infligido en función de las estadísticas del jugador y del objetivo. ',
    fr: 'Calcule les dégâts infligés en fonction des statistiques du joueur et de la cible ',
    pt: 'Calcula o dano infligido com base nas estatísticas do jogador e do alvo '
  },
  calcCommandDmgOptionDescription: {
    en: 'total domain (major elemental + secondary)',
    pt: 'domínio total (maior elemental + secundários)',
    es: 'dominio total (elemental mayor + secundario)',
    fr: 'dégâts totaux (élémentaire majeur + secondaire)',
  },
  calcCommandResOptionDescription: {
    en: "target's resistance. It can be in% or total",
    pt: 'resistência do alvo. Pode ser em % ou total',
    es: 'resistencia del objetivo. Puede estar en% o total',
    fr: 'résistance de la cible. Cela peut être en % ou au total',
  },
  calcCommandBaseOptionDescription: {
    en: 'skill base damage',
    pt: 'dano base da skill',
    es: 'daño de la base de habilidades',
    fr: 'dégâts de base de compétences',
  },
  calcCommandCritOptionDescription: {
    en: 'critical chance in%',
    pt: 'chance crítica em %',
    es: 'probabilidad crítica en%',
    fr: 'chance critique en %'
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
  },
  donationExtraMessage(days: number) {
      return {
      en: `\n\nThis bot might stop running in ${days} days, we\'re counting on your donation.\nTo find out more type \`.about\` or click [here](https://www.buymeacoffee.com/markkop)`,
      fr: `\n\nCe bot pourrait cesser de fonctionner dans ${days} hours, nous comptons sur votre don.\nPour en savoir plus, tapez \`.about\` ou cliquez [ici](https://www.buymeacoffee.com/markkop)`,
      pt: `\n\nEste bot pode parar de funcionar em ${days} dias, contamos com sua doação.\nPara saber mais digite \`.about\` ou clique [aqui](https://www.buymeacoffee.com/markkop)`,
      es: `\n\nEste bot podría dejar de funcionar en ${days} días, contamos con su donación.\nPara obtener más información, escriba \`.about\` o haga clic [aquí](https://www.buymeacoffee.com/markkop)`,
    }
  },
  aboutText: {
    fr: `**Corvo Astral** est un bot Discord qui fournit des informations sur le MMORPG Wakfu.
Utilisez .help pour trouver la liste des commandes et leurs exemples d'utilisation.

**Contribution:**
Il en coûte 7$/mois pour que ce bot fonctionne 24h/24 et 7j/7 sur [Heroku](https://www.heroku.com/pricing).
J'utilise actuellement des crédits Github Education qui expireront bientôt, je compte donc sur les dons pour le faire fonctionner les prochains mois.
Si vous avez des conditions et que vous souhaitez aider, merci de contribuer <3

Carte de crédit:
https://www.buymeacoffee.com/markkop

Pix (Brésil uniquement):
me@markkop.dev

Rejoignez le serveur discord du bot pour obtenir plus d'aide, signaler des bugs et découvrir de nouvelles fonctionnalités:
https://discord.gg/aX6j3gM8HC

**Crédits:**
Ce projet est open source et il est disponible sur Github: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)
Auteur et maintaner: [Mark Kop](https://github.com/Markkop) (Markx - Rubilax)
Le jeu WAKFU et les graphismes utilisés dans ce bot appartiennent à Ankama - tous droits réservés.
Ce bot est un projet non officiel et n'a aucun lien avec Ankama.
    `,
    es: `**Corvo Astral** es un bot de Discord que proporciona información sobre el MMORPG Wakfu.
Utilice .help para encontrar la lista de comandos y sus ejemplos de uso.

**Contribución:**
Cuesta $7/mes mantener este bot funcionando 24 horas al día, 7 días a la semana en [Heroku](https://www.heroku.com/pricing).
Actualmente estoy usando créditos de educación de Github que vencerán pronto, por lo que cuento con donaciones para que funcione durante los próximos meses.
Si tiene condiciones y le gustaría ayudar, por favor contribuya <3

Tarjeta de crédito:
https://www.buymeacoffee.com/markkop

Pix (solo Brasil):
me@markkop.dev

Únase al servidor de Discord del bot para obtener más ayuda, informar errores y descubrir nuevas funciones:
https://discord.gg/aX6j3gM8HC

**Créditos:**
Este proyecto es de código abierto y está disponible en Github: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)
Autor y mantenedor: [Mark Kop](https://github.com/Markkop) (Markx - Rubilax)
El juego WAKFU y los gráficos utilizados en este bot pertenecen a Ankama, todos los derechos reservados.
Este bot es un proyecto no oficial y no tiene ninguna conexión con Ankama.
    `,
    en: `**Corvo Astral** is a Discord bot that provides information about the Wakfu MMORPG.
Use .help to find the command list and their usage examples.

**Contribution:**
It costs $7/month to keep this bot running 24/7 on [Heroku](https://www.heroku.com/pricing).  
I'm currently using Github Education credits which will expire soon, so I'm counting on donations to have it working for the next months.
If you have conditions and would like to help, please contribute <3

Credit Card: 
https://www.buymeacoffee.com/markkop

Pix (Brazil only):
me@markkop.dev

Join the bot's discord server to get more help, report bugs and discover new features:
https://discord.gg/aX6j3gM8HC

**Credits:**
This project is open source and it's available on Github: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)
Author and maintaner: [Mark Kop](https://github.com/Markkop) (Markx - Rubilax)
The game WAKFU and the graphics used in this bot belongs to Ankama - all rights reserved.  
This bot is an unnoficial project and doesn't have any connection with Ankama.
    `,
    pt: `**Corvo Astral** é um bot do Discord que fornece informações sobre o MMORPG Wakfu.
Use .help para encontrar a lista de comandos e seus exemplos de uso.

**Contribuição:**
Custa US$7/mês para manter este bot funcionando 24 horas por dia, 7 dias por semana no [Heroku](https://www.heroku.com/pricing).
No momento, estou usando os créditos do Github Education que irão expirar em breve, então estou contando com doações para tê-lo funcionando nos próximos meses.
Se você tem condições e gostaria de ajudar, por favor contribua <3

Cartão de crédito:
https://www.buymeacoffee.com/markkop

Pix (somente no Brasil):
me@markkop.dev

Junte-se ao servidor discord do bot para obter mais ajuda, relatar bugs e descobrir novos recursos:
https://discord.gg/aX6j3gM8HC

**Créditos:**
Este projeto é de código aberto e está disponível no Github: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)
Autor e mantenedor: [Mark Kop](https://github.com/Markkop) (Markx - Rubilax)
O jogo WAKFU e os gráficos usados ​​neste bot pertencem à Ankama - todos os direitos reservados.
Este bot é um projeto não oficial e não tem nenhuma conexão com a Ankama.
    `
  } 
}
