import { getSublimation } from '../src/commands'

describe('getSublimation', () => {
  it('returns a sublimation when finding only one result', () => {
    const userMessage = {
      content: '.subli brutalidade',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith(`Sublimação: Brutalidade
Slot: Épico
Efeitos: Se Domínio Zona > Domínio Corpo a Corpo, Domínio Corpo a Corpo é adicionado ao Domínio Zona (max 800) no começo do combate, perdendo a mesma quantidade em Domínio Distância.
MaxStack: 1
Drop: Baú de Final de Temporada de Chefe Supremo`)
  })

  it('returns a sublimation and more results when finding more than one', () => {
    const userMessage = {
      content: '.subli frenzy',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith(`Sublimação: Frenzy
Slot: RGB
Efeitos: -20% damage Inflicted, 10% damage inflicted per affected enemy at the start of the next turn
MaxStack: 1
Drop: Aguabrial (2%)
Sublimações encontradas: Frenzy, Frenzy II, Frenzy III`)
  })

  it('returns matching sublimations when searching with three slots', () => {
    const userMessage = {
      content: '.subli BBR',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Ambush, Spines, Integrity')
  })

  it('returns matching sublimations when searching with one white slot', () => {
    const userMessage = {
      content: '.subli wbr',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Ambush, Resolute, Moon Scales, Spines, Resolute II, Condemnation II, Integrity')
  })

  it('returns matching sublimations when searching with two white slots', () => {
    const userMessage = {
      content: '.subli wwr',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Ruin, Ambush, Determination, Solidity, Resolute, Theory of Matter, Moon Scales, Swiftness, Save, Ruin II, Spines, Distance Barrier, Tenacity II, Resolute II, Cyclothymia, Condemnation II, Frenzy III, Length, Integrity')
  })

  it('returns non-repeated matching sublimations when searching with white slots', () => {
    const userMessage = {
      content: '.subli wwgw',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Devastate, Carnage, Evasion, Condemnation, Stupefaction, Dimensionality, Return, Berserk Critical, Visibility, Devastate II, Evasion II, Berserk Dodge, Vitality Well, Influence, Wall, Return II, Influence II, Critical Hit Expert, Lone Wolf, Determination, Tenacity, Solidity, Topology, Frenzy, Theory of Matter, Distance Barrier, Close-Combat Barrier, Tenacity II, Berserk Block, Frenzy II, Cyclothymia')
  })

  it('returns matching sublimations when searching with four slots', () => {
    const userMessage = {
      content: '.subli rrgb',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Carnage, Evasion II, Frenzy, Frenzy II')
  })

  it('returns matching sublimations when searching by 4 slots with the same combinations', () => {
    const userMessage = {
      content: '.subli gggg',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Devastate, Devastate II')
  })

  it('maps correctly an argument', () => {
    const userMessage = {
      content: '.subli epic',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Brutalidade, Precisão Cirúrgica, Medida, Desenlace, Inflexibilidade, Constância, Saúde de Ferro, Arte do Posicionamento, Anatomia, Manejo: Duas Mãos, Manejo: Adaga, Manejo: Escudo, Pacto Wakfu, Concentração Elemental, Força Hercúlea')
  })

  it('returns a not found message if no sublimation was found', () => {
    const userMessage = {
      content: '.subli caracas',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimação não encontrada :c. Digite `.help subli` para mais informações')
  })
})
