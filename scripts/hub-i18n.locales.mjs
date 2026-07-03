import { locales as baseLocales } from './fantasy-person-i18n.locales.mjs';

const hub = {
  en: {
    title: 'Super Fast Tool - Free Online Tools',
    meta: 'Free online calculators, converters, generators, image tools, audio tools, and game tools for quick everyday tasks. No signup required.',
    actions: ['Generate', 'Convert', 'Calculate'], search: 'Search',
    categories: ['Starred', 'All', 'Generator', 'Calculator', 'Converter', 'Image', 'Video', 'Audio', 'Game'],
    latest: 'Latest guides and news', terms: 'Terms of Service'
  },
  ko: {
    title: 'Super Fast Tool - 무료 온라인 도구',
    meta: '계산기, 변환기, 생성기, 이미지·비디오·오디오 도구와 브라우저 게임을 회원가입 없이 빠르게 이용하세요.',
    actions: ['생성', '변환', '계산'], search: '도구 검색',
    categories: ['즐겨찾기', '전체', '생성기', '계산기', '변환기', '이미지', '비디오', '오디오', '게임'],
    latest: '최신 가이드와 뉴스', terms: '이용약관'
  },
  ja: {
    title: 'Super Fast Tool - 無料オンラインツール',
    meta: '計算機、変換ツール、ジェネレーター、画像・動画・音声ツール、ブラウザゲームを登録なしですぐに利用できます。',
    actions: ['生成', '変換', '計算'], search: 'ツールを検索',
    categories: ['お気に入り', 'すべて', 'ジェネレーター', '計算機', '変換', '画像', '動画', '音声', 'ゲーム'],
    latest: '最新ガイドとニュース', terms: '利用規約'
  },
  'zh-CN': {
    title: 'Super Fast Tool - 免费在线工具',
    meta: '无需注册，即可快速使用在线计算器、转换器、生成器、图像、视频、音频工具和浏览器游戏。',
    actions: ['生成', '转换', '计算'], search: '搜索工具',
    categories: ['收藏', '全部', '生成器', '计算器', '转换器', '图像', '视频', '音频', '游戏'],
    latest: '最新指南与新闻', terms: '服务条款'
  },
  es: {
    title: 'Super Fast Tool - Herramientas online gratis',
    meta: 'Calculadoras, conversores, generadores y herramientas de imagen, vídeo y audio gratis. Úsalas al instante y sin registro.',
    actions: ['Generar', 'Convertir', 'Calcular'], search: 'Buscar herramientas',
    categories: ['Favoritos', 'Todo', 'Generadores', 'Calculadoras', 'Conversores', 'Imagen', 'Vídeo', 'Audio', 'Juegos'],
    latest: 'Guías y noticias recientes', terms: 'Términos del servicio'
  },
  de: {
    title: 'Super Fast Tool - Kostenlose Online-Tools',
    meta: 'Kostenlose Rechner, Konverter, Generatoren sowie Bild-, Video- und Audio-Tools. Sofort und ohne Anmeldung nutzbar.',
    actions: ['Erstellen', 'Konvertieren', 'Berechnen'], search: 'Tools suchen',
    categories: ['Favoriten', 'Alle', 'Generatoren', 'Rechner', 'Konverter', 'Bild', 'Video', 'Audio', 'Spiele'],
    latest: 'Neue Anleitungen und Nachrichten', terms: 'Nutzungsbedingungen'
  },
  fr: {
    title: 'Super Fast Tool - Outils en ligne gratuits',
    meta: 'Calculatrices, convertisseurs, générateurs et outils d’image, de vidéo et d’audio gratuits, utilisables sans inscription.',
    actions: ['Générer', 'Convertir', 'Calculer'], search: 'Rechercher un outil',
    categories: ['Favoris', 'Tous', 'Générateurs', 'Calculatrices', 'Convertisseurs', 'Image', 'Vidéo', 'Audio', 'Jeux'],
    latest: 'Guides et actualités récents', terms: 'Conditions d’utilisation'
  },
  'pt-BR': {
    title: 'Super Fast Tool - Ferramentas online grátis',
    meta: 'Calculadoras, conversores, geradores e ferramentas de imagem, vídeo e áudio grátis. Use sem cadastro e direto no navegador.',
    actions: ['Gerar', 'Converter', 'Calcular'], search: 'Buscar ferramentas',
    categories: ['Favoritos', 'Tudo', 'Geradores', 'Calculadoras', 'Conversores', 'Imagem', 'Vídeo', 'Áudio', 'Jogos'],
    latest: 'Guias e notícias recentes', terms: 'Termos de serviço'
  }
};

export const locales = Object.fromEntries(Object.entries(baseLocales).map(([code, base]) => [code, { ...base, ...hub[code] }]));
