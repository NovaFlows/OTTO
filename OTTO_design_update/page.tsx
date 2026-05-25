# OTTO — Mise à jour D.A. craie

Cette archive contient uniquement les fichiers à mettre à jour dans ton repo `OTTO-ryan/`.

## Comment intégrer

1. Décompresse l'archive.
2. Recopie l'arborescence `app/` et `components/` par-dessus celle de ton repo, en gardant la même structure.
3. Aucun fichier dans `lib/`, `app/api/`, `supabase/`, `data/`, ni `middleware.ts` n'a été modifié.
4. Aucune dépendance npm n'a été ajoutée — pas de `npm install` nécessaire.
5. Lance `npm run dev` et vérifie que tout compile.

## Fichiers NOUVEAUX (à créer)

- `components/ChalkAmbient.tsx`   — animation craie aléatoire sur toute la page
- `components/ChalkDivider.tsx`   — séparateur de section dessiné à la craie
- `components/OttoSignature.tsx`  — signature manuscrite « drewit » en SVG

## Fichiers MODIFIÉS (à remplacer)

- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/about/page.tsx`
- `app/boutique/page.tsx`
- `app/oeuvre/[slug]/page.tsx`
- `components/Nav.tsx`
- `components/Footer.tsx`
- `components/HeroAnimated.tsx`
- `components/OeuvreCard.tsx`
- `components/BackgroundTraces.tsx`

## Tests rapides après intégration

1. **Animation craie** — au bout de quelques secondes, des traits doivent apparaître aléatoirement. En scrollant, ils restent ancrés à la page.
2. **Toggle jour/nuit** — la signature, les séparateurs et le cadre des cards doivent basculer du blanc au noir.
3. **Hover sur une œuvre** — halo lumineux subtil autour de la card.
4. **Boutique** — filtres en wayfinding texte, soulignement craie sur l'actif.
5. **Hero** — traits de craie de part et d'autre de OTTO, halo radial visible derrière.

## Si quelque chose casse

- Si `ChalkAmbient` ne s'affiche pas : vérifier que `app/layout.tsx` importe et monte `<ChalkAmbient />`.
- Si les séparateurs craie ne s'affichent pas : vérifier que `components/ChalkDivider.tsx` est bien présent et importé.
- Si la signature ne s'affiche pas : vérifier `components/OttoSignature.tsx`.
