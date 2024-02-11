import { Status as WalletStatus } from "../controller/wallet"
import { Status as NodeStatus } from "../controller/node"

export interface RequestMappings {
  'wallet:status': []
  'node:status': []
}

export interface Request<M extends keyof ResponseMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface ResponseMappings {
  'wallet:status': WalletStatus
  'node:status': NodeStatus
}

export interface Response<M extends keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | false
  error?: {
    message: string
  }
}
