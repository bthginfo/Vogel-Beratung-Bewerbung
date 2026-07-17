import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const [browserWebSocketUrl, outputArg = 'public/documents/Mario_Schubert_Assignment_Vogel.pdf'] = process.argv.slice(2)

if (!browserWebSocketUrl) {
  throw new Error('Pass the browser CDP websocket URL as the first argument.')
}

const socket = new WebSocket(browserWebSocketUrl)
let nextId = 0
const pending = new Map()

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve: finish, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(message.error.message))
  else finish(message.result)
})

function send(method, params = {}, sessionId) {
  const id = ++nextId
  socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  return new Promise((finish, reject) => pending.set(id, { resolve: finish, reject }))
}

await new Promise((finish, reject) => {
  socket.addEventListener('open', finish, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

const { targetInfos } = await send('Target.getTargets')
const pageTarget = targetInfos.find((target) => target.type === 'page' && target.url.includes('/assignment-print'))
if (!pageTarget) throw new Error('No open /assignment-print page target found.')

const { sessionId } = await send('Target.attachToTarget', { targetId: pageTarget.targetId, flatten: true })
await send('Page.enable', {}, sessionId)
const { data } = await send('Page.printToPDF', {
  displayHeaderFooter: false,
  printBackground: true,
  preferCSSPageSize: true,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
}, sessionId)

const outputPath = resolve(outputArg)
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, Buffer.from(data, 'base64'))
socket.close()
console.log(outputPath)
