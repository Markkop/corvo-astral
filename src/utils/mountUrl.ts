export function mountUrl(itemId: number, type: number, lang: string): string {
  const categories = [
    {
      title: {
        en: 'armors',
        pt: 'armaduras',
        es: 'armaduras',
        fr: 'armures'
      },
      types: [103, 132, 133, 134, 136, 138]
    },
    {
      title: {
        en: 'armors',
        pt: 'armas',
        es: 'armas',
        fr: 'weapons'
      },
      types: [101, 108, 110, 111, 112, 113, 114, 115, 117, 119, 120, 189, 219, 223, 253, 254, 480, 512, 519, 520]
    },
    {
      title: {
        en: 'pets',
        pt: 'mascotes',
        es: 'mascotas',
        fr: 'familiers'
      },
      types: [582]
    },
    {
      title: {
        fr: 'montures',
        en: 'mounts',
        es: 'monturas',
        pt: 'montarias'
      },
      types: [611]
    },
    {
      title: {
        fr: 'accessoires',
        en: 'accessories',
        es: 'accesorios',
        pt: 'acessorios'
      },
      types: [646]
    },
    {
      title: {
        fr: 'ressources',
        en: 'resources',
        es: 'recursos',
        pt: 'recursos'
      },
      types: [812, 134]
    }
  ]
  const category = categories.find(cat => cat.types.some(catType => catType === type))

  const encyclopedia = {
    fr: 'encyclopedie',
    pt: 'enciclopedia',
    es: 'enciclopedia',
    en: 'encyclopedia'
  }
  return `https://www.wakfu.com/${lang}/mmorpg/${encyclopedia[lang]}/${category.title[lang]}/${itemId}`
}
