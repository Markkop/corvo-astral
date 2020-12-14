import { saveFile, openFile } from '../../utils/files'

/**
 * Get sublimations from items on wakfu's cdn and parse them
 * to a json that will be manually updated with information
 * that can't be gathered from anywhere, such as end of season
 * chest, steles quantity and quest source.
 */
export function parseSublimationsToInput () {
  const items = openFile('data/raw/cdn/items.json')
  const existingSublimations = openFile('data/raw/sublimations/sublimations.json')

  const sublimations = items.filter(item => {
    return item.definition.item.baseParameters.itemTypeId === 812
  })
  const sublimationsToReceiveManualInputs = sublimations.map(subli => {
    const existingSubli = existingSublimations.find(exSubli => {
      return exSubli.id === subli.definition.item.id
    })
    return {
      id: subli.definition.item.id,
      title: subli.title,
      effects: {
        en: (existingSubli && existingSubli.effects.en) || '',
        es: (existingSubli && existingSubli.effects.es) || '',
        fr: (existingSubli && existingSubli.effects.fr) || '',
        pt: (existingSubli && existingSubli.effects.pt) || ''
      },
      source: {
        chest: {
          en: (existingSubli && existingSubli.source.chest.en) || '',
          es: (existingSubli && existingSubli.source.chest.es) || '',
          fr: (existingSubli && existingSubli.source.chest.fr) || '',
          pt: (existingSubli && existingSubli.source.chest.pt) || ''
        },
        drop: {
          steles: (existingSubli && existingSubli.source.drop.steles) || ''
        },
        quest: {
          en: (existingSubli && existingSubli.source.quest.en) || '',
          es: (existingSubli && existingSubli.source.quest.es) || '',
          fr: (existingSubli && existingSubli.source.quest.fr) || '',
          pt: (existingSubli && existingSubli.source.quest.pt) || ''
        }
      }
    }
  })
  saveFile(sublimationsToReceiveManualInputs, 'data/raw/sublimations/sublimations.json')
}
