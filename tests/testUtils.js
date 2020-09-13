import config from '../src/config'
const { groupListingChannelName } = config

/**
 * Mocks a channel message to match properties from a Discord Message.
 * Note that channel messages has actually Collection type and here we're treating them
 * as arrays and enriching their properties to have the same as a Discord Collection.
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
    filtered.first = () => filtered[0]
    filtered.size = filtered.length
    return filtered
  }
  return {
    react: jest.fn(),
    content: content,
    channel: {
      send: jest.fn(message => {
        message.react = jest.fn()
        return message
      })
    },
    author: {
      id: 111,
      username: 'Mark'
    },
    guild: {
      channels: {
        cache: [
          {
            name: groupListingChannelName,
            messages: {
              fetch: jest.fn().mockResolvedValue(channelMessages)
            },
            send: jest.fn(message => {
              message.react = jest.fn()
              return message
            })
          }
        ]
      }
    }
  }
}
