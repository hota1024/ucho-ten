import { atom, useAtom } from 'jotai'

const showPostNumbers = atom(false)

export const useShowPostNumbers = () => useAtom(showPostNumbers)
