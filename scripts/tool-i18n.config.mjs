import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales as fantasyPersonLocales } from './fantasy-person-i18n.locales.mjs';
import { locales as fantasyPlaceLocales } from './fantasy-place-i18n.locales.mjs';

const manualConfigs = [
  {
    slug: 'fantasy-person-name-generator',
    cardId: 'fantasyNameCard',
    titleId: 'tool18Title',
    descriptionId: 'tool18Desc',
    guideHref: '/guides/fantasy-person-name-generator/',
    locales: fantasyPersonLocales,
    legacySitemapMarkers: ['SFT_FANTASY_PERSON_I18N'],
    replacements: [
      { pattern: /(<label[^>]+for="fantasyPersonCount">)[^<]*(<\/label>)/, key: 'count' },
      { pattern: /(<button id="generateFantasyPersonName"[^>]*>)[^<]*(<\/button>)/, key: 'generate' },
      { pattern: /(<button id="downloadFantasyPersonName"[^>]*>)[^<]*(<\/button>)/, key: 'download' }
    ]
  },
  {
    slug: 'fantasy-place-name-generator',
    cardId: 'fantasyPlaceCard',
    titleId: 'tool31Title',
    descriptionId: 'tool31Desc',
    guideHref: '/guides/fantasy-place-name-generator/',
    locales: fantasyPlaceLocales,
    legacySitemapMarkers: ['SFT_FANTASY_PLACE_I18N'],
    replacements: [
      { pattern: /(<label[^>]+for="fantasyPlaceCount">)[^<]*(<\/label>)/, key: 'count' },
      { pattern: /(<button id="generateFantasyPlaceName"[^>]*>)[^<]*(<\/button>)/, key: 'generate' },
      { pattern: /(<button id="downloadFantasyPlaceName"[^>]*>)[^<]*(<\/button>)/, key: 'download' }
    ]
  }
];

const here = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(here, 'tool-i18n.catalog.json');
const catalog = fs.existsSync(catalogPath)
  ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
  : { tools: {}, translations: {} };

const doxxSource = {
  description: 'A corrupted pixel horror platformer where control is never entirely yours.',
  close: 'Close game',
  play: "Play Dox'x Click",
  paragraphs: [
    "Dox'x Click is a compact pixel horror platform game built around an unstable struggle for control. Move and jump through each stage while a hostile entity gradually takes over the character. The goal is to reach the portal, survive hazards and monsters, and continue through increasingly long stages.",
    'The game supports keyboard controls on desktop and on-screen controls on touch devices. Progress and total deaths are stored locally in the browser so a later visit can continue from the unlocked stage. Refreshing or closing the page does not send gameplay progress to a Super Fast Tool server.',
    "Dox'x Click runs inside an isolated game frame so its canvas, audio, controls, and saved progress remain separate from the surrounding tool page. The original standalone build is preserved independently for game portals, while this page provides the same Super Fast Tool navigation, privacy information, and contact options as the other tools.",
    'Audio begins only after user interaction because modern browsers restrict automatic playback. Performance can vary with device speed, browser power-saving settings, screen orientation, and available memory. For the best control, use a current browser and keep the game visible while playing.'
  ]
};

const doxxCopy = {
  en: {
    meta: "Play Dox'x Click, a free pixel horror platform game where control shifts between the player and a hostile entity.",
    description: doxxSource.description,
    close: doxxSource.close,
    play: doxxSource.play
  },
  ko: {
    meta: "플레이어와 적대적 존재 사이에서 조작권이 바뀌는 무료 픽셀 호러 플랫폼 게임 Dox'x Click을 플레이하세요.",
    description: '적대적인 존재와 조작권을 빼앗고 빼앗기는 오염된 픽셀 호러 플랫포머입니다.',
    close: '게임 닫기',
    play: "Dox'x Click 플레이"
  },
  ja: {
    meta: "プレイヤーと敵対する存在の間で操作権が切り替わる無料ピクセルホラーゲーム、Dox'x Clickをプレイできます。",
    description: '敵対する存在と操作権を奪い合う、崩壊したピクセルホラープラットフォーマーです。',
    close: 'ゲームを閉じる',
    play: "Dox'x Clickをプレイ"
  },
  'zh-CN': {
    meta: "免费游玩Dox'x Click，这是一款控制权会在玩家与敌对实体之间切换的像素恐怖平台游戏。",
    description: '一款与敌对实体争夺控制权的故障像素恐怖平台游戏。',
    close: '关闭游戏',
    play: "游玩Dox'x Click"
  },
  es: {
    meta: "Juega gratis a Dox'x Click, un juego de plataformas y terror pixelado donde el control cambia entre el jugador y una entidad hostil.",
    description: 'Un juego de plataformas de terror pixelado y corrupto donde nunca tienes el control por completo.',
    close: 'Cerrar juego',
    play: "Jugar a Dox'x Click"
  },
  de: {
    meta: "Spiele Dox'x Click, ein kostenloses Pixel-Horror-Jump-and-Run, bei dem die Kontrolle zwischen dir und einer feindlichen Entität wechselt.",
    description: 'Ein korrumpierter Pixel-Horror-Plattformer, in dem die Kontrolle nie ganz dir gehört.',
    close: 'Spiel schließen',
    play: "Dox'x Click spielen"
  },
  fr: {
    meta: "Jouez gratuitement à Dox'x Click, un jeu de plateforme horrifique en pixel art où le contrôle alterne entre le joueur et une entité hostile.",
    description: 'Un jeu de plateforme horrifique en pixel art corrompu où le contrôle ne vous appartient jamais totalement.',
    close: 'Fermer le jeu',
    play: "Jouer à Dox'x Click"
  },
  'pt-BR': {
    meta: "Jogue Dox'x Click, um jogo gratuito de plataforma e terror em pixel art no qual o controle alterna entre o jogador e uma entidade hostil.",
    description: 'Um jogo de plataforma de terror em pixel art corrompido, no qual o controle nunca é totalmente seu.',
    close: 'Fechar jogo',
    play: "Jogar Dox'x Click"
  }
};

const doxxParagraphs = {
  en: doxxSource.paragraphs,
  ko: [
    "Dox'x Click은 불안정한 조작권 싸움을 중심으로 구성된 짧고 강렬한 픽셀 호러 플랫폼 게임입니다. 적대적인 존재가 캐릭터의 조작권을 서서히 빼앗는 동안 각 스테이지를 이동하고 점프하세요. 포탈에 도달하고 함정과 몬스터를 피해 점점 길어지는 스테이지를 계속 진행하는 것이 목표입니다.",
    '데스크톱에서는 키보드로, 터치 기기에서는 화면 버튼으로 조작할 수 있습니다. 진행 상황과 누적 사망 횟수는 브라우저에 로컬로 저장되므로 다음 방문에도 잠금 해제한 스테이지부터 이어갈 수 있습니다. 페이지를 새로 고치거나 닫아도 플레이 기록은 Super Fast Tool 서버로 전송되지 않습니다.',
    "Dox'x Click은 독립된 게임 프레임 안에서 실행되므로 캔버스, 오디오, 조작 및 저장 데이터가 주변 툴 페이지와 분리됩니다. 게임 포털용 독립 실행 빌드는 별도로 유지되며, 이 페이지에서는 다른 툴과 동일한 Super Fast Tool 탐색, 개인정보 안내 및 문의 기능을 제공합니다.",
    '최신 브라우저는 자동 재생을 제한하므로 오디오는 사용자가 처음 조작한 뒤 시작됩니다. 성능은 기기 속도, 브라우저 절전 설정, 화면 방향 및 사용 가능한 메모리에 따라 달라질 수 있습니다. 원활한 조작을 위해 최신 브라우저를 사용하고 플레이 중에는 게임 화면이 보이도록 유지하세요.'
  ],
  ja: [
    "Dox'x Clickは、不安定な操作権の争いを軸にしたコンパクトなピクセルホラープラットフォームゲームです。敵対する存在が徐々にキャラクターを乗っ取る中、各ステージを移動してジャンプしてください。ポータルに到達し、罠やモンスターを切り抜け、次第に長くなるステージを進むことが目的です。",
    'デスクトップではキーボード、タッチ端末では画面上のボタンで操作できます。進行状況と累計死亡回数はブラウザ内に保存されるため、次回は解放済みのステージから続けられます。ページを再読み込みまたは閉じても、プレイ記録がSuper Fast Toolのサーバーへ送信されることはありません。',
    "Dox'x Clickは独立したゲームフレーム内で動作するため、キャンバス、音声、操作、保存データは周囲のツールページから分離されています。ゲームポータル向けのスタンドアロン版は別に維持され、このページでは他のツールと同じナビゲーション、プライバシー情報、お問い合わせ機能を利用できます。",
    '最新のブラウザでは自動再生が制限されるため、音声はユーザーが操作した後に開始します。性能は端末の速度、省電力設定、画面の向き、使用可能なメモリによって異なる場合があります。快適に操作するには、最新のブラウザを使用し、プレイ中はゲームを表示したままにしてください。'
  ],
  'zh-CN': [
    "Dox'x Click是一款围绕不稳定控制权争夺展开的紧凑型像素恐怖平台游戏。当敌对实体逐渐接管角色时，你需要在各个关卡中移动和跳跃。目标是抵达传送门、避开陷阱与怪物，并继续挑战越来越长的关卡。",
    '桌面设备支持键盘操作，触屏设备支持屏幕按键。游戏进度和累计死亡次数会保存在本地浏览器中，因此下次访问时可以从已解锁的关卡继续。刷新或关闭页面不会把游戏进度发送到Super Fast Tool服务器。',
    "Dox'x Click在独立的游戏框架中运行，因此画布、音频、控制和存档数据都与外部工具页面相互隔离。用于游戏平台的独立版本会单独保留，而此页面提供与其他工具相同的Super Fast Tool导航、隐私信息和联系选项。",
    '由于现代浏览器会限制自动播放，音频只会在用户首次互动后开始。性能可能受到设备速度、浏览器省电设置、屏幕方向和可用内存的影响。为获得更好的操控体验，请使用最新版浏览器，并在游玩时保持游戏画面可见。'
  ],
  es: [
    "Dox'x Click es un compacto juego de plataformas y terror pixelado basado en una lucha inestable por el control. Muévete y salta por cada nivel mientras una entidad hostil se apodera gradualmente del personaje. El objetivo es llegar al portal, sobrevivir a trampas y monstruos y avanzar por niveles cada vez más largos.",
    'El juego admite teclado en ordenadores y controles en pantalla en dispositivos táctiles. El progreso y el total de muertes se guardan localmente en el navegador para continuar más tarde desde el nivel desbloqueado. Recargar o cerrar la página no envía el progreso a ningún servidor de Super Fast Tool.',
    "Dox'x Click se ejecuta dentro de un marco de juego aislado, por lo que el lienzo, el audio, los controles y el progreso guardado permanecen separados de la página de la herramienta. La versión independiente para portales de juegos se conserva por separado, mientras que esta página ofrece la misma navegación, información de privacidad y opciones de contacto que las demás herramientas.",
    'El audio comienza únicamente después de la interacción del usuario porque los navegadores modernos restringen la reproducción automática. El rendimiento puede variar según la velocidad del dispositivo, el ahorro de energía, la orientación de la pantalla y la memoria disponible. Para un mejor control, utiliza un navegador actualizado y mantén visible el juego mientras juegas.'
  ],
  de: [
    "Dox'x Click ist ein kompaktes Pixel-Horror-Jump-and-Run über einen unbeständigen Kampf um die Kontrolle. Bewege dich durch jede Stufe und springe, während eine feindliche Entität die Figur schrittweise übernimmt. Erreiche das Portal, überlebe Fallen und Monster und bewältige zunehmend längere Stufen.",
    'Auf Desktop-Geräten wird das Spiel per Tastatur und auf Touch-Geräten über Bildschirmtasten gesteuert. Fortschritt und gesamte Tode werden lokal im Browser gespeichert, sodass du später bei der freigeschalteten Stufe weitermachen kannst. Beim Neuladen oder Schließen der Seite werden keine Spieldaten an einen Server von Super Fast Tool gesendet.',
    "Dox'x Click läuft in einem isolierten Spielfenster. Canvas, Audio, Steuerung und gespeicherter Fortschritt bleiben dadurch von der umgebenden Tool-Seite getrennt. Die eigenständige Fassung für Spieleportale wird separat erhalten; diese Seite bietet zugleich dieselbe Navigation, Datenschutzhinweise und Kontaktmöglichkeiten wie die anderen Tools.",
    'Audio startet erst nach einer Benutzerinteraktion, da moderne Browser die automatische Wiedergabe einschränken. Die Leistung kann je nach Gerätegeschwindigkeit, Energiespareinstellungen, Bildschirmausrichtung und verfügbarem Speicher variieren. Verwende für eine gute Steuerung einen aktuellen Browser und lasse das Spiel während des Spielens sichtbar.'
  ],
  fr: [
    "Dox'x Click est un jeu de plateforme horrifique compact en pixel art, construit autour d'une lutte instable pour le contrôle. Avancez et sautez dans chaque niveau tandis qu'une entité hostile prend progressivement possession du personnage. Le but est d'atteindre le portail, de survivre aux pièges et aux monstres, puis de parcourir des niveaux de plus en plus longs.",
    "Le jeu se contrôle au clavier sur ordinateur et avec des commandes à l'écran sur les appareils tactiles. La progression et le nombre total de morts sont enregistrés localement dans le navigateur afin de reprendre plus tard au niveau débloqué. Recharger ou fermer la page n'envoie aucune progression à un serveur de Super Fast Tool.",
    "Dox'x Click s'exécute dans un cadre de jeu isolé : son canevas, son audio, ses commandes et sa sauvegarde restent séparés de la page de l'outil. La version autonome destinée aux portails de jeux est conservée séparément, tandis que cette page propose la même navigation, les mêmes informations de confidentialité et les mêmes options de contact que les autres outils.",
    "L'audio ne démarre qu'après une interaction de l'utilisateur, car les navigateurs modernes limitent la lecture automatique. Les performances peuvent varier selon la vitesse de l'appareil, les réglages d'économie d'énergie, l'orientation de l'écran et la mémoire disponible. Pour un meilleur contrôle, utilisez un navigateur récent et gardez le jeu visible pendant la partie."
  ],
  'pt-BR': [
    "Dox'x Click é um jogo compacto de plataforma e terror em pixel art baseado em uma disputa instável pelo controle. Mova-se e salte por cada fase enquanto uma entidade hostil assume gradualmente o personagem. O objetivo é alcançar o portal, sobreviver a perigos e monstros e avançar por fases cada vez mais longas.",
    'O jogo aceita teclado no computador e controles na tela em dispositivos sensíveis ao toque. O progresso e o total de mortes ficam armazenados localmente no navegador para que uma visita futura continue a partir da fase desbloqueada. Atualizar ou fechar a página não envia o progresso a um servidor do Super Fast Tool.',
    "Dox'x Click é executado dentro de um quadro de jogo isolado; assim, canvas, áudio, controles e progresso salvo permanecem separados da página da ferramenta. A versão independente para portais de jogos é mantida separadamente, enquanto esta página oferece a mesma navegação, informações de privacidade e opções de contato das outras ferramentas.",
    'O áudio começa somente depois da interação do usuário porque navegadores modernos restringem a reprodução automática. O desempenho pode variar conforme a velocidade do dispositivo, as configurações de economia de energia, a orientação da tela e a memória disponível. Para obter melhor controle, use um navegador atualizado e mantenha o jogo visível enquanto joga.'
  ]
};

const doxxLocales = Object.fromEntries(Object.entries(fantasyPersonLocales).map(([code, common]) => {
  const copy = doxxCopy[code];
  const translations = code === 'en' ? {} : { ...(catalog.translations[code] || {}) };
  translations[doxxSource.description] = copy.description;
  translations[doxxSource.close] = copy.close;
  translations[doxxSource.play] = copy.play;
  doxxSource.paragraphs.forEach((paragraph, index) => {
    translations[paragraph] = doxxParagraphs[code][index];
  });
  return [code, {
    label: common.label,
    addStar: common.addStar,
    removeStar: common.removeStar,
    title: "Dox'x Click",
    meta: copy.meta,
    translations
  }];
}));

const doxxConfig = {
  mode: 'auto',
  slug: 'doxx-click',
  cardId: 'doxxClickCard',
  guideHref: null,
  locales: doxxLocales,
  replacements: []
};

const autoConfigs = Object.values(catalog.tools).map(tool => {
  const locales = Object.fromEntries(Object.entries(fantasyPersonLocales).map(([code, common]) => {
    const translations = code === 'en' ? {} : (catalog.translations[code] || {});
    return [code, {
      label: common.label,
      addStar: common.addStar,
      removeStar: common.removeStar,
      title: translations[tool.title] || tool.title,
      meta: translations[tool.meta] || tool.meta,
      translations
    }];
  }));
  return {
    mode: 'auto',
    slug: tool.slug,
    cardId: tool.cardId,
    guideHref: tool.guideHref,
    locales,
    replacements: []
  };
});

export const toolI18nConfigs = [...manualConfigs, ...autoConfigs, doxxConfig];

export function getToolI18nConfig(slug) {
  const config = toolI18nConfigs.find(item => item.slug === slug);
  if (!config) throw new Error(`Unknown localized tool: ${slug}`);
  return config;
}
