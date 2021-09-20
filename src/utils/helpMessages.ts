export default {
  default: {
    help: {
      en: 'Get help for a given command.',
      pt: 'Get help for a given command.',
      es: 'Get help for a given command.',
      fr: 'Get help for a given command.'
    },
    examples: ['.help', '.help subli', '.help equip']
  },
  alma: {
    help: {
      en: 'Discover the Almanax bonus for the current day',
      pt: 'Descubra o bônus do Almanax para o dia atual',
      es: 'Descubra el bono Almanax para el día actual',
      fr: 'Découvrez le bonus Almanax du jour en cours'
    },
    examples: ['.alma', '.alma lang=fr']
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
      '.calc dmg=3000 base=55 res=60%',
      '.calc dmg=5000 base=40 res=420 crit=30%'
    ]
  },
  subli: {
    help: {
      en: `Search for sublimations by name, combination of slots or source of obtain.
Use "random" to search for matches in any order.`,
      pt: `Pesquise por sublimações pelo nome, combinação de slots ou fonte de obtenção.
Utilize "random" para procurar combinações em qualquer ordem.`,
      es: `Busque sublimaciones por nombre, combinación de ranuras o fuente de obtención.
Utilice "random" para buscar coincidencias en cualquier orden.`,
      fr: `Recherchez les sublimations par nom, combinaison d'emplacements ou source d'obtention.
Utilisez "random" pour rechercher des correspondances dans n'importe quel ordre.`
    },
    examples: [
      '.subli bruta',
      '.subli bruta translate=fr',
      '.subli talho lang=pt',
      '.subli rwb',
      '.subli rgbg random',
      '.subli epic',
      '.subli quest',
      '.subli koko',
      '.subli craft'
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
      '.equip martelo de osamodas lang=pt',
      '.equip the eternal rarity=mythical'
    ]
  },
  about: {
    help: {
      en: 'Displays information about Corvo Astral',
      pt: 'Exibe informações sobre o Corvo Astral',
      es: 'Muestra información sobre el Corvo Astral',
      fr: 'Affiche des informations sur Corvo Astral'
    },
    examples: ['.about']
  },
  party: {
    help: {
      en: `List and join groups.
You can now use \`.party create\` and follow the helper's messages to create your party.
To change the name, date, level and description, use the command \`.party update\`.
Join and leave any group by reacting to them with your character's class.`,
      pt: `Liste e participe de grupos.
Agora você pode usar \`.party create\` e seguir as mensagens do ajudante para criar seu grupo.
Para alterar o nome, data, nível e descrição, use o comando \`.party update\`.
Junte-se e saia de qualquer grupo reagindo a eles com a classe de seu personagem.`,
      es: `Enumere y únase a grupos.
Ahora puede usar \`.party create\` y seguir los mensajes del ayudante para crear su grupo.
Para cambiar el nombre, la fecha, el nivel y la descripción, use el comando \`.party update\`.
Únete y abandona cualquier grupo reaccionando ante ellos con la clase de tu personaje.`,
      fr: `Répertoriez et rejoignez des groupes.
Vous pouvez maintenant utiliser \`.party create\` et suivre les messages de l'assistant pour créer votre groupe.
Pour changer le nom, la date, le niveau et la description, utilisez la commande \`.party update\`.
Rejoignez et quittez n'importe quel groupe en y réagissant avec la classe de votre personnage.`
    },
    examples: [
      '.party create',
      '.party update'
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
      '.recipe brakmar sword',
      '.recipe espada de brakmar lang=pt',
      '.recipe peace pipe rarity=mythical',
      '.recipe o eterno raridade=mítico lang=pt'
    ]
  },
  config: {
    help: {
      en:
        "Change some of this bot's configuration for your guild. You need admin permission for this.",
      pt: '',
      es: '',
      fr: ''
    },
    examples: [
      '.config set lang=en',
      '.config set almanaxChannel=temple-bonus',
      '.config set partyChannel=party-listing',
      '.config get'
    ]
  }
}
