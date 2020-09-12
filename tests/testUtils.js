/**
 * Mocks a channel message to match properties from a Discord Message.
 * Note that channel messages has actually Collection type and here we're treating them
 * as arrays and enriching their properties to have the same as Discord.
 *
 * @param {string} content
 * @param {object[]} channelMessages
 * @returns {object}
 */
export function mockMessage (content, channelMessages = []) {
  channelMessages.forEach(channelMessages => { channelMessages.edit = jest.fn(message => message) })
  channelMessages.nativeFilter = channelMessages.filter
  channelMessages.filter = (func) => {
    const filtered = channelMessages.nativeFilter(func)
    filtered.first = () => channelMessages[0]
    filtered.size = channelMessages.length
    return filtered
  }
  return {
    content: content,
    channel: {
      send: jest.fn(message => message)
    },
    author: {
      id: 111,
      username: 'Mark'
    },
    client: {
      channels: {
        cache: [
          {
            name: 'grupos',
            messages: {
              fetch: jest.fn().mockResolvedValue(channelMessages)
            },
            send: jest.fn(message => message)
          }
        ]
      }
    }
  }
}
