export default {
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
** Note: note that when there is space, it is necessary to use "" around the option. **
If date is not provided, it comes as "To be agreed"
If level is not provided, it comes as "1-215"
If places are not provided, it comes as 6 (maximum 50 places)
To change the name, date, level and description, use the command \`.party update\`. If you are not the leader, you can only update the class.
Join any group already created in the group channel, informing the group id and its class with \`.party join\`.
You can also use the ** reactions ** of the group message to enter, leave or add / remove classes.`,
      pt: `Liste e participe de grupos.
**Obs: note que quando tiver espaço, é necessário usar "" em volta da opção.**
Se data não for fornecido, vem como "A combinar"
Se nível não for fornecido, vem como "1-215"
Se vagas não for fornecido, vem como 6 (máximo 50 vagas)
Para alterar nome, data, nível e descrição, use o comando \`.party update\`. Caso você não seja o líder, só pode atualizar a classe
Entre em algum grupo já criado no canal de grupos informando o id do grupo e a sua classe com \`.party join\`.
Você também pode usar as **reações** da mensagem de grupo para entrar, sair ou adicionar/remover classes.`,
      es: `Enumere y únase a grupos.
** Nota: tenga en cuenta que cuando hay espacio, es necesario usar "" alrededor de la opción. **
Si no se proporciona la fecha, aparece como "A convenir"
Si no se proporciona el nivel, aparece como "1-215"
Si no se proporcionan plazas, viene como 6 (máximo 50 plazas)
Para cambiar el nombre, la fecha, el nivel y la descripción, use el comando \`.party update\`. Si no eres el líder, solo puedes actualizar la clase.
Únase a cualquier grupo ya creado en el canal del grupo, informando el ID del grupo y su clase con \`.party join\`.
También puede usar las ** reacciones ** del mensaje grupal para ingresar, salir o agregar / eliminar clases.`,
      fr: `Répertoriez et rejoignez des groupes.
** Remarque: notez que lorsqu'il y a des espaces, il faut utiliser "" autour de l'option. **
Si la date n'est pas fournie, elle apparaît comme "A préciser"
Si le niveau n'est pas fourni, il apparaît sous la forme "1-215"
Si les places ne sont pas fournies, il s'agit de 6 (maximum 50 places)
Pour changer le nom, la date, le niveau et la description, utilisez la commande \`.party update \`. Si vous n'êtes pas le leader, vous ne pouvez mettre à jour que la classe.
Rejoignez n'importe quel groupe déjà créé dans le canal du groupe, en informant l'identifiant du groupe et sa classe avec \`.party join\`.
Vous pouvez également utiliser les ** réactions ** du message de groupe pour entrer, quitter ou ajouter / supprimer des classes.`
    },
    examples: [
      '.party create name="vertox s21 3 stele" desc="looking for incurable and enutrof" lvl="186+"',
      '.party create name="moon leveling" date=15/10 lvl="160-200" slots=3',
      '.party create name="dg excarnus s21" date="21/11 21:00" lvl=80',
      '.party join id=1 class=enu',
      '.party update id=50 date="12/11 15:00"',
      '.party update id=32 class=feca',
      '.party leave id=32'
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
      '.recipe peace pipe rarity=mythical'
    ]
  },
  help: {
    help: {
      en: 'Nice try',
      pt: 'Boa tentativa',
      es: 'Buena tentativa',
      fr: 'Bel tentative'
    },
    examples: []
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
