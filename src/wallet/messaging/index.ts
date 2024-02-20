import browser from "webextension-polyfill"
import Router from "./server/router"
import { type Request } from "./protocol"
import Notifier from "./server/notifier"

export default class RPC {
  router: Router
  notifier: Notifier
  ports: Set<browser.Runtime.Port> = new Set()
 
  constructor (identity: string, { router, notifier }: {
    router: Router
    notifier: Notifier
  }) {
    this.router = router
    this.notifier = notifier

    this.listen(identity)
  }

  private listen (identity: string) {
    browser.runtime.onConnect.addListener((port) => {
      if (port.sender?.id !== browser.runtime.id) return port.disconnect()
      if (port.name !== identity) return

      this.registerPort(port)
    })

    this.streamEvents()
  }

  private registerPort (port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request) => {
      const response = await this.router.routeMessage(request)

      port.postMessage(response)
    }

    port.onMessage.addListener(onMessageListener)

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(onMessageListener)

      this.ports.delete(port)
    })
  }

  private streamEvents () {
    this.notifier.stream((event) => {
      this.ports.forEach(port => {
        port.postMessage(event)
      })
    })
  }
}