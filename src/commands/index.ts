import AboutCommand, { getData as getAboutData} from './About'
import EquipCommand, { getData as getEquipData } from './Equip'
import CalcCommand, { getData as getCalcData} from './Calc'
import RecipeCommand, { getData as getRecipeData} from './Recipe'
import SubliCommand, { getData as getSubliData } from './Subli'
import AlmaCommand, { getData as getAlmaData} from './Alma'
import HelpCommand, { getData as getHelpData} from './Help'
import ConfigCommand, { getData as getConfigData } from './Config'
import PartyCreateCommand, { getData as getPartyCreateData } from './party/PartyCreate'
import PartyUpdateCommand, { getData as getPartyUpdateData } from './party/PartyUpdate'
import PartyReaction from './party/PartyReaction'

export {
  AboutCommand,
  EquipCommand,
  CalcCommand,
  RecipeCommand,
  SubliCommand,
  AlmaCommand,
  HelpCommand,
  ConfigCommand,
  PartyCreateCommand,
  PartyUpdateCommand,
  PartyReaction
}

export default [
  getAboutData,
  getCalcData,
  getAlmaData,
  getConfigData,
  getPartyCreateData,
  getPartyUpdateData,
  getEquipData,
  getRecipeData,
  getSubliData,
  getHelpData
]
