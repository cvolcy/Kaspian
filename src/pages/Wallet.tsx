import { Button } from "@/components/ui/button"
import { CopyIcon, CopyCheckIcon, LogOutIcon } from "lucide-react"
import Heading from "@/components/Heading"
// import UTXOCard from "@/components/UTXOCard"
import SendDrawer from "@/pages/Wallet/Send"
import ReceiveDrawer from "@/pages/Wallet/Receive"
import SettingsSheet from "@/pages/Wallet/Settings"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useEffect, useState } from "react"
import { Status } from "@/wallet/kaspa/wallet"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"

export default function Wallet () {
  const kaspa = useKaspa()
  const navigate = useNavigate()
  const [addressCopied, setAddressCopied] = useState(false)

  useEffect(() => {
    if (kaspa.status !== Status.Unlocked) {
      navigate("/")
    }
  }, [ kaspa.status ])

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6 gap-3"}>
      <div className={"flex flex-row justify-between items-center"}>
        <Heading title={"Kaspian"} />
        <div className={"flex items-center gap-3 mr-2"}>
          <SettingsSheet />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={async () => {
              await kaspa.request('wallet:lock', [])
            }}
          >
            <LogOutIcon />
          </Button>
        </div>
      </div>
      <div className={"flex flex-col gap-1"}>
        <div className={"flex flex-col items-center"}>
          <Button
            className={"flex flex-row text-sm font-semibold"}
            title={kaspa.usableAddress}
            variant={"link"}
            onClick={(e) => {
              e.preventDefault()
              navigator.clipboard.writeText(kaspa.usableAddress)
              setAddressCopied(true)
              setTimeout(() => setAddressCopied(false), 5000)
            }}
          >
            {kaspa.usableAddress.substring(0, 14)}...{kaspa.usableAddress.substring(kaspa.usableAddress.length - 7)}
            {
              addressCopied
              ? <CopyCheckIcon className={"h-4 w-4 ml-1"} />
              : <CopyIcon className={"h-4 w-4 ml-1"} />
            }
          </Button>
          <p className={"text-4xl font-extrabold"}>{kaspa.balance}</p>
          <p className={"text-xl font-bold"}>$ 0.00</p>
        </div>
      </div>
      <div className={"grid grid-cols-3 mx-3 h-full overflow-y-scroll no-scrollbar gap-2"}>
        {kaspa.utxos.map((utxo, id) => {
          return (
            <div key={id} className="flex flex-col items-center text-center py-2 border-solid border-2 border-orange-800 hover:border-dashed rounded-xl w-full h-24">
              <p className={"text-lg font-bold"}>{utxo[0]}</p>
              <Button variant="link" className={"text-inherit font-extrabold"}>{utxo[1].substring(0, 7)}...</Button>
            </div>
          )
        })}
      </div>
      <div className={"flex flex-row justify-center gap-5"}>
        <SendDrawer />
        <ReceiveDrawer />
      </div>
    </main>
  )
}
