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
      { name: 'Condições', value: 'Singular' }])
  })

  it('return a footer with more equip. found if results are more than one', async () => {
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
