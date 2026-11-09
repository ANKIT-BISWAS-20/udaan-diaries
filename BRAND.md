# Udaan Diaries: brand notes

**Name**: *Udaan* (उड़ान) means "flight". *Diaries* is set small in spaced mono capitals.
**Mark**: a jharokha, the cusped arch window of Rajasthani and Mughal architecture, with a bird lifting off inside it.
The wings are leaf/paisley curves, a small sun sits above, and a row of rangoli dots forms the base.
**Voice**: warm, curious, a little poetic. "Stories from every corner of India."

| Token | Light | Dark |
|---|---|---|
| Accent (sindoor-orange) | `#C2410C` | `#FF9A3C` |
| Accent 2 (haldi / turmeric) | `#E8A317` | `#FFC83D` |
| Ink (indigo) | `#1B1740` | `#FFF1DC` |
| Surface (cream) | `#FFF8EC` | `#14102B` |

Five palettes ship in `src/config/theme.js`: Jaipur Marigold (default), Kerala Backwaters, Peacock, Sindoor & Gold, Kashmir Saffron.

Folk-art motifs used on the site: paisley (buta), mandala, Madhubani fish, Warli dancers, Kolam dots, block-print lattice, jharokha arches.

Type: Google Sans Flex (display and body; Google's open-source sibling of Google Sans) and Google Sans Code (labels), self-hosted via Fontsource.

Files: `public/favicon.svg`, `public/brand/mark.svg`, `mark-mono.svg`, `logo-light.svg`, `logo-dark.svg`, PNG app icons and `og-image.png`.
Regenerate them with `python3 scripts/gen-brand.py` (needs Pillow). In the site the logo is `src/components/Logo.jsx` and follows the palette picker.
