import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const showPostNumbers = atom(false)

export const useShowPostNumbers = () => useAtom(showPostNumbers)

const showMuteUserInNotifications = atomWithStorage(
  'shwoMuteUserInNotifications',
  false
)
export const useShowMuteUserInNotifications = () =>
  useAtom(showMuteUserInNotifications)

const showMuteUserInSearch = atomWithStorage('showMuteUserInSearch', false)
export const useShowMuteUserInSearch = () => useAtom(showMuteUserInSearch)

const muteWords = atomWithStorage<string[]>('muteWords', [])
export const useMuteWords = () => useAtom(muteWords)

const disableScrollOnLoadButtonPress = atomWithStorage('disableScrollOnLoadButtonPress', false)

export const useDisableScrollOnLoadButtonPress = () => useAtom(disableScrollOnLoadButtonPress)

const appearanceColorMode = atomWithStorage<"system"|"light"|"dark">('appearanceColorMode', 'light')

export const useAppearanceColorMode = () => useAtom(appearanceColorMode)