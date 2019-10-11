import Typography from 'typography'
import noriega from 'typography-theme-noriega'

const typography = new Typography(noriega)

if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
