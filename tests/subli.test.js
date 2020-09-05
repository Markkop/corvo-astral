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

  it('returns three sublimations when providing slots', () => {
    const userMessage = {
      content: '.subli BBR',
      reply: jest.fn()
    }
    const replySpy = jest.spyOn(userMessage, 'reply')
    getSublimation(userMessage)
    expect(replySpy).toHaveBeenCalledWith('Sublimações encontradas: Ambush, Spines, Integrity')
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
