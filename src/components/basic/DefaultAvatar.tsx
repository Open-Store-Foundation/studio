import Avatar from "@mui/material/Avatar/Avatar"
import { useTheme } from "@mui/material"

export function DefaultAvatar({ name, size = 45 }: { name: string, size?: number }) {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const bg = stringToHexColor(name, isDark)
    const fg = getReadableTextColor(bg)
    return <Avatar
        sx={{
            bgcolor: bg,
            color: fg,
            width: `${size}px`,
            height: `${size}px`
        }}
    >
        {name[0].toUpperCase()}
    </Avatar>
}

function stringToHexColor(input: string, isDark: boolean) {
    let hash = 0
    for (let i = 0; i < input.length; i += 1) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash)
        hash |= 0
    }
    const hue = Math.abs(hash) % 360
    const saturation = isDark ? 80 : 60
    const lightness = isDark ? 60 : 40
    return hslToHex(hue, saturation, lightness)
}

function hslToHex(h: number, s: number, l: number) {
    const sNorm = s / 100
    const lNorm = l / 100
    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = lNorm - c / 2
    let rPrime = 0
    let gPrime = 0
    let bPrime = 0
    if (h >= 0 && h < 60) { rPrime = c; gPrime = x; bPrime = 0 }
    else if (h >= 60 && h < 120) { rPrime = x; gPrime = c; bPrime = 0 }
    else if (h >= 120 && h < 180) { rPrime = 0; gPrime = c; bPrime = x }
    else if (h >= 180 && h < 240) { rPrime = 0; gPrime = x; bPrime = c }
    else if (h >= 240 && h < 300) { rPrime = x; gPrime = 0; bPrime = c }
    else { rPrime = c; gPrime = 0; bPrime = x }
    const r = Math.round((rPrime + m) * 255)
    const g = Math.round((gPrime + m) * 255)
    const b = Math.round((bPrime + m) * 255)
    const toHex = (v: number) => v.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function getReadableTextColor(hexColor: string) {
    const rgb = hexToRgb(hexColor)
    if (!rgb) return '#000000'
    const [r, g, b] = rgb
    const [rs, gs, bs] = [r, g, b].map(v => {
        const t = v / 255
        return t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4)
    })
    const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    return luminance > 0.6 ? '#000000' : '#ffffff'
}

function hexToRgb(hex: string) {
    const clean = hex.replace('#', '')
    if (clean.length !== 6) return null
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    return [r, g, b] as const
}
