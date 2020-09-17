import { getEquipment } from '../src/commands'
import { commandsHelp } from '../src/commands/help'
import { mockMessage } from './testUtils'

describe('getEquipment', () => {
  it('return a matching equipment by name', async () => {
    const content = '.equip Cinto Tentacular'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#fede71',
      title: ':yellow_circle: Cinto Tentacular',
      thumbnail: {
        url: 'https://builder.methodwakfu.com/assets/icons/items/13327644.webp'
      },
      fields: [
        {
          name: 'Nível',
          value: 215,
          inline: true
        },
        {
          name: 'Tipo',
          value: 'Cinto',
          inline: true
        },
        {
          name: 'Raridade',
          value: 'Lendário',
          inline: true
        },
        {
          name: 'Equipado',
          value:
            '286 PV\n47 de esquiva\n30 de Prospecção\n6% de Golpe crítico\n218 Domínio sobre 2 elementos aleatórios\n118 de Domínio de distância\n47 Resistência a :fire:\n47 Resistência a :herb:'
        },
        {
          inline: true,
          name: 'Profissão',
          value: ':boot: Coureiro'
        },
        {
          inline: true,
          name: 'Nível',
          value: 140
        },
        {
          name: 'Ingredientes',
          value: `:orange_circle: \`1x   \` Cinto Tentacular
:boot: \`38x  \` Couro Divino
:adhesive_bandage: \`63x  \` Bond, Super Bond Divina
:sunflower: \`8x   \` Violeta
:sparkles: \`287x \` Pó
:white_small_square: \`75x  \` Pinsengraça
:white_small_square: \`7x   \` Carapaça do Crustacérebro
:white_small_square: \`8x   \` Pinsolação`
        }
      ]
    })
  })

  it('return a matching equipment by name with higher rarity by default', async () => {
    const content = '.equip o eterno'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Anelembrança',
      inline: true
    }]))
  })

  it('return a matching equipment by name with lower rarity with rarity argument is provided', async () => {
    const content = '.equip o eterno raridade=mítico'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Raridade',
      value: 'Mítico',
      inline: true
    }]))
  })

  it('return a matching equipment with a recipe', async () => {
    const content = '.equip espada de brakmar'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([
      {
        name: 'Profissão',
        value: ':crossed_swords: Mestre de armas',
        inline: true
      },
      {
        name: 'Nível',
        value: 130,
        inline: true
      },
      {
        name: 'Ingredientes',
        value: `:pick: \`80x  \` Rubi Polido
:pick: \`40x  \` Carbono Hara
:adhesive_bandage: \`400x \` Bond, Super Bond eterna
:sparkles: \`717x \` Pó
:white_small_square: \`20x  \` Esterco Marrom Dourado
:white_small_square: \`20x  \` Canino Real
:white_small_square: \`20x  \` Essência de Blopzart
:white_small_square: \`20x  \` Estalagmama`
      }
    ]))
  })

  it('return the condition if the resulting equipment has one', async () => {
    const content = '.equip espada de amakna'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Condições',
      value: 'Está equipado com Anel de Amakna'
    }]))
  })

  it('return the useEffect description if the resulting equipment has one', async () => {
    const content = '.equip Palito de Dente de Ogrest'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual(expect.arrayContaining([{
      name: 'Em uso',
      value: 'Dano :star2:: 46 :left_right_arrow:'
    }]))
  })

  it('does not return the effects for an equipment that does not have one ', async () => {
    const content = '.equip anel de brakmar'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.fields).toEqual([
      { inline: true, name: 'Nível', value: 200 },
      { inline: true, name: 'Tipo', value: 'Anel' },
      { inline: true, name: 'Raridade', value: 'Épico' },
      { name: 'Condições', value: 'Singular' },
      {
        inline: true,
        name: 'Profissão',
        value: ':ring: Joalheiro'
      },
      {
        inline: true,
        name: 'Nível',
        value: 130
      },
      {
        name: 'Ingredientes',
        value: `:pick: \`15x  \` Carbono Hara
:sparkles: \`300x \` Pó
:chair: \`25x  \` Orbe Eterno
:droplet: \`1400x\` Lágrima de Ogrest
:adhesive_bandage: \`300x \` Bond, Super Bond eterna
:orange_circle: \`5x   \` Anel Furtador
:ring: \`100x \` Gema eterna`
      }
    ])
  })

  it('return a footer with more equipment found if results are more than one', async () => {
    const content = '.equip amakna'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Equipamentos encontrados: Botas dos Riktus de Amakna, Peitoral dos Riktus de Amakna, Máscara dos Riktus de Amakna, Escudo do Capitão Amakna, Espada de Amakna, Anel de Amakna, Dragonas dos Riktus de Amakna'
    })
  })

  it('return a footer with truncated results if there are too many', async () => {
    const content = '.equip a'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed.footer).toEqual({
      text: 'Equipamentos encontrados: Kwal Dhedo Enfraquecido, Botas do Tofu selvagem, Fatiadoras de Milobo, Fatiadoras de Milobo, Fatiadoras de Milobo, Fatiadoras de Milobo, O Amula, O Amula, O Amula, O Amula, Dragoperu de Precisão, Dragoperu de Distância, Dragoperu de Destruição, Manto do Competidor Júnior, Amuleto de Moskito, Lâmina Estrondosa, Sapeado, Vegetacinto, Anel Aventureiro, ChaPiu Azul e outros 3333 resultados'
    })
  })

  it('return a not found message if no equip was found', async () => {
    const content = '.equip asdasdasd'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toEqual({
      color: '#bb1327',
      title: ':x: Nenhum equipamento encontrado',
      description: 'Digite `.help equip` para conferir alguns exemplos de como pesquisar.'
    })
  })

  it('return a help message if no query was provided', async () => {
    const content = '.equip'
    const userMessage = mockMessage(content)
    const botMessage = await getEquipment(userMessage)
    expect(botMessage.embed).toMatchObject({
      description: commandsHelp.equip
    })
  })
})
