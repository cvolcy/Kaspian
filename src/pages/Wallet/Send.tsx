import { SendToBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import { AlertDialog } from "@/components/ui/alert-dialog"
import Sign from "./Send/Sign"
import Submit from "./Send/Submit"
import Success from "./Send/Success"
import { type Summary } from "@/wallet/kaspa/account"

export enum Tabs {
  Sign,
  Submit,
  Success
}

export default function SendDrawer () {
  const kaspa = useKaspa()

  const [ recipient, setRecipient ] = useState("")
  const [ amount, setAmount ] = useState("")
  const [ summary, setSummary ] = useState<Summary | undefined>()
  const [ error, setError ] = useState("")
  const [ tab, setTab ] = useState(Tabs.Sign)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"gap-2"}>
          <SendToBack />
          {i18n.getMessage('send')}
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>{i18n.getMessage('sendTitle')}</SheetTitle>
            <SheetDescription>{i18n.getMessage('sendDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-5">
            <div className={"text-center"}>
              <p className={"text-lg font-extrabold mb-1"}>{i18n.getMessage('sendAvailable')}</p>
              <p className={"text-base font-bold"}>{kaspa.balance}</p>
            </div>
            <div className={"text-center flex flex-col gap-3"}>
              <Input
                type={"text"}
                placeholder={i18n.getMessage('address')}
                className={"w-60"}
                value={recipient}
                onChange={(e) => { 
                  if (error) setError("")

                  setRecipient(e.target.value)
                }}
              />
              <Input
                type={"number"}
                placeholder={i18n.getMessage('amount')}
                value={amount}
                onChange={(e) => {
                  if (error) setError("")

                  setAmount(e.target.value)
                }}
              />
              <p className="text-red-600">{error}</p>
            </div>
            <Button className={"gap-2"} disabled={!!summary} onClick={() => {
              if (tab !== Tabs.Sign) setTab(Tabs.Sign)

              kaspa.request('account:initiateSend', [ recipient, amount ]).then((summary) => {
                setRecipient("")
                setAmount("")
                setSummary(summary)
              }).catch((err) => {
                setError(err)
              })
            }}>
              <SendToBack />
              {i18n.getMessage('send')}
            </Button>

            <AlertDialog open={!!summary} onOpenChange={(o) => setSummary(o ? summary : undefined)}>
              {tab === Tabs.Sign && !!summary && <Sign summary={summary} onSigned={() => setTab(Tabs.Submit)} />}
              {tab === Tabs.Submit && <Submit onSubmitted={() => setTab(Tabs.Success)} />}
              {tab === Tabs.Success && !!summary && <Success hash={summary.hash} />}
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
