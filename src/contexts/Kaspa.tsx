import { createContext, useState, ReactNode, useEffect, useMemo } from "react"
import { runtime, type Runtime } from "webextension-polyfill"
import { Status } from "@/wallet/kaspa/wallet"

export interface IKaspa {
  status: Status
  connected: boolean
  address: string
  balance: string
  utxos: [ string, string ][]
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  address: "",
  balance: '0 KAS',
  utxos: []
}

export const KaspaContext = createContext<{
  connection: Runtime.Port
  state: IKaspa
  setState: React.Dispatch<React.SetStateAction<IKaspa>>
} | undefined>(undefined)

export function KaspaProvider ({ children }: {
  children: ReactNode
}) {
  const connection = useMemo(() => runtime.connect({ name: "@kaspian/client" }), [])
  const [ state, setState ] = useState(defaultState)

  useEffect(() => {
    // TODO: Move message listener here for avoiding a weird resource leak

    return () => {
      connection.disconnect()
    }
  }, [ connection ])


  return (
    <KaspaContext.Provider value={{ connection, state, setState }}>
      {children}
    </KaspaContext.Provider>
  )
}
