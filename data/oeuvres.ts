export type Categorie = 'danseuses' | 'corbeaux' | 'silhouettes' | 'etudes'
export type Statut = 'disponible' | 'vendu' | 'nfs'

export interface Oeuvre {
  slug: string
  title: string
  year: number
  technique: string
  format: string
  categorie: Categorie
  statut: Statut
  imagePath?: string
  images?: string[]       // toutes les vues : principale + détails + process
  description?: string
}

export const oeuvres: Oeuvre[] = [
  {
    slug: 'arabeque-i',
    title: 'Arabeque I',
    year: 2024,
    technique: 'Acrylique sur toile noire',
    format: '80 × 100 cm',
    categorie: 'danseuses',
    statut: 'vendu',
    description: 'La première danseuse. Des milliers de traits blancs qui construisent le mouvement.',
  },
  {
    slug: 'envol',
    title: 'Envol',
    year: 2024,
    technique: 'Craie et acrylique sur toile noire',
    format: '100 × 130 cm',
    categorie: 'danseuses',
    statut: 'disponible',
    description: 'Une figure qui s\'élève. Bras ouverts sur le vide.',
  },
  {
    slug: 'tutu-blanc',
    title: 'Tutu Blanc',
    year: 2025,
    technique: 'Acrylique sur toile noire',
    format: '60 × 80 cm',
    categorie: 'danseuses',
    statut: 'vendu',
  },
  {
    slug: 'equilibre',
    title: 'Équilibre',
    year: 2025,
    technique: 'Craie sur carton noir',
    format: '50 × 70 cm',
    categorie: 'danseuses',
    statut: 'disponible',
  },
  {
    slug: 'corbeau-i',
    title: 'Corbeau I',
    year: 2024,
    technique: 'Encre sur papier blanc',
    format: '40 × 50 cm',
    categorie: 'corbeaux',
    statut: 'vendu',
    description: 'Le premier corbeau. Encre projetée, gestes libres.',
  },
  {
    slug: 'perche',
    title: 'Perché',
    year: 2024,
    technique: 'Craie sur carton noir',
    format: '50 × 65 cm',
    categorie: 'corbeaux',
    statut: 'disponible',
  },
  {
    slug: 'vol-nocturne',
    title: 'Vol Nocturne',
    year: 2025,
    technique: 'Encre sur papier gris',
    format: '60 × 80 cm',
    categorie: 'corbeaux',
    statut: 'disponible',
  },
  {
    slug: 'duo',
    title: 'Duo',
    year: 2024,
    technique: 'Encre et crayon sur papier',
    format: '30 × 40 cm',
    categorie: 'silhouettes',
    statut: 'vendu',
    description: 'Deux silhouettes. Le langage sans les mots.',
  },
  {
    slug: 'enfant-balancoire',
    title: "L'Enfant à la balançoire",
    year: 2025,
    technique: 'Craie sur carton noir',
    format: '40 × 60 cm',
    categorie: 'silhouettes',
    statut: 'disponible',
  },
  {
    slug: 'gardien',
    title: 'Le Gardien',
    year: 2025,
    technique: 'Acrylique sur toile noire',
    format: '80 × 120 cm',
    categorie: 'silhouettes',
    statut: 'nfs',
    description: 'Une grande figure et une petite. La transmission.',
  },
  {
    slug: 'etude-main',
    title: 'Étude — Main',
    year: 2024,
    technique: 'Crayon sur papier',
    format: '21 × 29 cm',
    categorie: 'etudes',
    statut: 'disponible',
  },
  {
    slug: 'gants',
    title: 'Gants',
    year: 2024,
    technique: 'Encre et acrylique sur papier gris',
    format: '30 × 40 cm',
    categorie: 'etudes',
    statut: 'vendu',
    description: 'Des gants de boxe. Le combat comme méditation.',
  },
]

export function getOeuvreBySlug(slug: string): Oeuvre | undefined {
  return oeuvres.find((o) => o.slug === slug)
}
