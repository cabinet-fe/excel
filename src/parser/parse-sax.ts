import { SaxesParser } from 'saxes'

export async function parseSax(stream: TransformStream) {
  const parser = new SaxesParser()

  let error
  parser.on('error', err => {
    console.error(err)
  })

  let events: Record<string, any>[] = []
  parser.on('opentag', value => events.push({ eventType: 'opentag', value }))
  parser.on('text', value => events.push({ eventType: 'text', value }))
  parser.on('closetag', value => events.push({ eventType: 'closetag', value }))

  const reader = stream.readable.getReader()

  while (true) {
    const { value, done } = await reader.read()
    parser.write(new TextDecoder().decode(value))
    if (done) {
      break
    }
  }

  return events
}
