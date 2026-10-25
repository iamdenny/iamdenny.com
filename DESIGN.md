# Design System: iamdenny.com

**Project ID:** iamdenny-com

The site combines an animated, nocturnal maker identity with practical service
navigation. This document records the implemented design rather than proposing
a replacement. Preserve its lunar scene while keeping useful text easy to read.

## 1. Visual Theme & Atmosphere

A dark space setting provides depth behind clear service and guide content.
Motion belongs primarily to scenery and decorative objects. MODU TT reads as
an independent sports product through its own green feature section.

## 2. Color Palette & Roles

Near-black Space (#050507) and pale Lunar White (#f3f0ff) are the shared base.
Electric Cyan (#68edff) identifies focus and key accents. Violet (#7c3cff),
Blue (#426cff) and Pink (#ff4fd8) belong to the established scene palette.
Service cards use individual accents on restrained dark surfaces; body copy
uses #c4cede. MODU TT keeps its lime/green palette and darker green background.
Preserve these established choices instead of imposing a generic single-accent
template. Text must remain legible independently of background effects.

## 3. Typography Rules

The existing stack is Inter, Pretendard, system sans-serif and Helvetica Neue.
Monospace is reserved for compact labels and technical accents. Service headings
use `clamp(21px, 1.9vw, 27px)`; descriptions use 13px with 1.8 line height.
Guide content has a quieter reading hierarchy. Do not shrink explanatory copy
to fit additional decoration; keep Korean wrapping and heading contrast clear.

## 4. Component Stylings

Service cards have a 16px radius, subtle accent borders, a 2:1 SVG preview and
an explicit example caption. Primary buttons launch services; secondary links
open the related guide. Both have a minimum 44px target height and visible
keyboard focus. Preview images include intrinsic dimensions, alt text and lazy
loading. Cards are not whole-card links containing nested interactive controls.

## 5. Layout Principles

The content sequence is hero, nine service cards, guides, MODU TT, approach,
task selection, FAQ and operator information. The directory uses three columns
on desktop, two at intermediate widths and one at 560px or below. Existing
responsive rules and full-width descriptions take priority over older CSS
rules earlier in the stylesheet. Prevent horizontal overflow and preserve
access to guide content before the longer decorative sections.

## 6. Motion & Interaction

Keep the single-context three.js moon, stars and other scene elements.
Reduced-motion visitors receive the existing static-render behavior; WebGL
failure restores CSS fallbacks. Preview zoom is limited to hover-capable devices
without reduced-motion preference. Do not make body content wait for a reveal
animation or leave it dimmed after scrolling. Category filters announce results.

## 7. Anti-Patterns (Banned)

- Replacing the approved lunar identity as part of routine content maintenance.
- Treating MODU TT as another small utility card or part of apex AdSense approval.
- Presenting illustrative previews as actual screenshots or live activity.
- Inventing usage statistics, confidence scores or approval promises.
- Hiding useful explanations behind animation or making text low contrast.
- Opening internal guides in new tabs, or dropping safe external-link attributes.
