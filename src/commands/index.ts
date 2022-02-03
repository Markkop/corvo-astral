import AboutCommand, { getData as getAboutData} from './About'
// import EquipCommand from './Equip'
import CalcCommand, { getData as getCalcData} from './Calc'
// import RecipeCommand from './Recipe'
// import SubliCommand from './Subli'
import AlmaCommand, { getData as getAlmaData} from './Alma'
// import HelpCommand from './Help'
// import ConfigCommand from './Config'
// import PartyBaseCommand from './party/PartyBase'
// import PartyCreateCommand from './party/PartyCreate'
// import PartyUpdateCommand from './party/PartyUpdate'
import PartyReaction from './party/PartyReaction'

export {
  AboutCommand,
  // EquipCommand,
  CalcCommand,
  // RecipeCommand,
  // SubliCommand,
  AlmaCommand,
  // HelpCommand,
  // ConfigCommand,
  // PartyBaseCommand,
  // PartyCreateCommand,
  // PartyUpdateCommand,
  PartyReaction
}

export default [
  getAboutData,
  getCalcData,
  getAlmaData
]
