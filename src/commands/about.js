export const aboutText = `O **Corvo Astral** é um bot para o Discord com o intuito de auxiliar jogares de **Wakfu**, um MMORPG da Ankama, com informações sobre o jogo.
Feito em Javascript com NodeJS e hospedado no Heroku, o bot utiliza informações retiradas diretamente do site oficial e da API da Method, disponível publicamente.

**Créditos**:
[Mark Kop](https://github.com/Markkop) - criador
[Luiz Gadelha](https://github.com/luizgadel) - traduções
Corvos de Efrim - testes

Deseja contribuir? O projeto tem código aberto e está disponível no GitHub o/
Acesso em: [https://github.com/Markkop/corvo-astral](https://github.com/Markkop/corvo-astral)`

/**
 * Send a message with information about this bot.
 *
 * @param { import('discord.js').Message } message - Discord message object.
 * @returns {Promise<object>}
 */
export function getAbout (message) {
  const embed = {
    color: 'YELLOW',
    title: ':crescent_moon: Sobre o Corvo Astral',
    description: aboutText
  }
  return message.channel.send({ embed })
}
