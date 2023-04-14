import { BskyAgent } from '@atproto/api'
import { atom, useAtom } from 'jotai'

const agentAtom = atom<BskyAgent | null>(null)

export const useAgent = () => useAtom(agentAtom)
