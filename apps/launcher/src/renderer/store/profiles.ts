import { create } from 'zustand'
import type { LauncherProfile } from '@prism/api-types'

interface ProfilesState {
  profiles: LauncherProfile[]
  activeProfileId: string | null
  isGameRunning: boolean
  setProfiles: (profiles: LauncherProfile[]) => void
  setActiveProfile: (id: string) => void
  setGameRunning: (v: boolean) => void
}

export const useProfilesStore = create<ProfilesState>()((set) => ({
  profiles: [],
  activeProfileId: null,
  isGameRunning: false,
  setProfiles: (profiles) => set({ profiles }),
  setActiveProfile: (activeProfileId) => set({ activeProfileId }),
  setGameRunning: (isGameRunning) => set({ isGameRunning }),
}))
