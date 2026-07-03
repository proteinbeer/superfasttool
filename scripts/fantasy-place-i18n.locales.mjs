import { locales as baseLocales } from './fantasy-person-i18n.locales.mjs';

const content = {
  en: {
    title: 'Fantasy Place Name Generator',
    meta: 'Generate fantasy place names for kingdoms, towns, forests, ruins, and magical locations. Free and instant in your browser.',
    short: 'Create names for kingdoms, towns, forests, ruins, and magical places.',
    paragraphs: [
      'Fantasy Place Name Generator creates location names for games, stories, tabletop campaigns, and original worlds. Use it for kingdoms, towns, forests, ruins, islands, strongholds, and other fictional places without installing software or creating an account.',
      'Generate a new result whenever a map, chapter, quest, or setting needs a name. The tool combines fantasy-style fragments and varied structures so repeated generations can suggest places with different moods and scales.',
      'Set the count from 1 to 100. Generate shows one place name on the page, while Download prepares a text file containing the requested number of names. Review the list and adapt spelling, language, or geography to fit your world.',
      'Generation runs locally in your browser. Results are creative prompts rather than historical or linguistic references, and a generated name may coincidentally resemble a real location or an existing fictional setting.'
    ],
    aboutLine: 'This page creates fantasy place names without registration or installation.'
  },
  ko: {
    title: '판타지 장소 이름 생성기',
    meta: '왕국, 도시, 숲, 폐허, 마법 지역에 어울리는 판타지 장소 이름을 무료로 생성하세요. 설치 없이 브라우저에서 바로 사용할 수 있습니다.',
    short: '왕국, 마을, 숲, 폐허, 마법 지역의 이름을 생성합니다.',
    paragraphs: [
      '판타지 장소 이름 생성기는 게임, 소설, TRPG 캠페인, 창작 세계의 지명을 만드는 브라우저 도구입니다. 왕국, 도시, 숲, 폐허, 섬, 요새 등의 이름을 계정이나 설치 없이 만들 수 있습니다.',
      '지도, 챕터, 퀘스트, 배경에 새 이름이 필요할 때마다 사용하세요. 판타지 풍의 어감과 다양한 구조를 결합하여, 반복해 생성하면 다른 분위기와 규모를 가진 장소 후보를 얻을 수 있습니다.',
      '개수는 1개에서 100개까지 설정할 수 있습니다. 생성 버튼은 화면에 하나의 지명을 보여 주고, 다운로드 버튼은 지정한 개수를 텍스트 파일로 준비합니다. 작품의 언어와 지리에 맞게 철자를 다듬어 사용하세요.',
      '생성 작업은 브라우저 내부에서 실행됩니다. 결과는 역사적이거나 언어학적인 자료가 아닌 창작 제안이며, 실제 지명이나 기존 작품의 장소와 우연히 비슷할 수 있습니다.'
    ],
    aboutLine: '이 페이지는 가입과 설치 없이 판타지 장소 이름을 만듭니다.'
  },
  ja: {
    title: 'ファンタジー地名ジェネレーター',
    meta: '王国、街、森、遺跡、魔法の土地に使えるファンタジー地名を無料で生成。インストール不要です。',
    short: '王国、街、森、遺跡、魔法の土地の名前を生成します。',
    paragraphs: [
      'ファンタジー地名ジェネレーターは、ゲーム、小説、TRPG、創作世界の場所名を作るブラウザツールです。王国、街、森、遺跡、島、要塞などの名前を登録やインストールなしで作成できます。',
      '地図、章、クエスト、舞台に新しい名前が必要なときに使えます。ファンタジー風の断片と構造を組み合わせ、異なる雰囲気や規模の地名候補を提案します。',
      '件数は1から100まで設定できます。生成は画面に1件を表示し、ダウンロードは指定数の名前をテキストファイルにまとめます。作品の言語や地理に合わせて表記を調整してください。',
      '生成はブラウザ内で実行されます。結果は創作用の提案であり、実在の地名や既存作品の場所と偶然似る場合があります。'
    ],
    aboutLine: 'このページでは登録やインストールなしでファンタジー地名を作成できます。'
  },
  'zh-CN': {
    title: '奇幻地名生成器',
    meta: '免费生成适用于王国、城镇、森林、遗迹和魔法地区的奇幻地名，无需安装。',
    short: '为王国、城镇、森林、遗迹和魔法地区生成名称。',
    paragraphs: [
      '奇幻地名生成器是一款用于游戏、小说、桌游和原创世界的浏览器工具。无需注册或安装，即可创建王国、城镇、森林、遗迹、岛屿和要塞的名称。',
      '当地图、章节、任务或设定需要新名称时，可以反复生成。工具会组合奇幻风格的片段和不同结构，提供具有不同氛围和规模的地名候选。',
      '数量可设置为1至100。生成按钮会在页面上显示一个名称，下载按钮则会创建包含指定数量的文本文件。请根据你的世界观调整拼写、语言和地理风格。',
      '生成过程在浏览器中运行。结果是创作建议，可能偶然与真实地名或现有虚构地点相似。'
    ],
    aboutLine: '本页面无需注册或安装即可创建奇幻地名。'
  },
  es: {
    title: 'Generador de nombres de lugares de fantasía',
    meta: 'Genera nombres de fantasía para reinos, ciudades, bosques, ruinas y lugares mágicos. Gratis y sin instalación.',
    short: 'Crea nombres para reinos, ciudades, bosques, ruinas y lugares mágicos.',
    paragraphs: [
      'El Generador de nombres de lugares de fantasía crea ubicaciones para juegos, relatos, partidas de rol y mundos originales. Puedes nombrar reinos, ciudades, bosques, ruinas, islas y fortalezas sin instalar programas ni crear una cuenta.',
      'Genera otro resultado cuando un mapa, capítulo, misión o escenario necesite un nombre. La herramienta combina fragmentos de estilo fantástico y estructuras variadas para proponer lugares con distintos ambientes y escalas.',
      'Configura una cantidad entre 1 y 100. Generar muestra un nombre en la página y Descargar prepara un archivo de texto con la cantidad solicitada. Revisa la lista y adapta la ortografía, el idioma o la geografía a tu mundo.',
      'La generación se ejecuta en el navegador. Los resultados son propuestas creativas y pueden parecerse por casualidad a lugares reales o escenarios ficticios existentes.'
    ],
    aboutLine: 'Esta página crea nombres de lugares fantásticos sin registro ni instalación.'
  },
  de: {
    title: 'Generator für Fantasy-Ortsnamen',
    meta: 'Erstelle kostenlos Fantasy-Ortsnamen für Königreiche, Städte, Wälder, Ruinen und magische Orte. Ohne Installation.',
    short: 'Erstellt Namen für Königreiche, Städte, Wälder, Ruinen und magische Orte.',
    paragraphs: [
      'Der Generator für Fantasy-Ortsnamen erstellt Schauplätze für Spiele, Geschichten, Rollenspielrunden und eigene Welten. Benenne Königreiche, Städte, Wälder, Ruinen, Inseln und Festungen ohne Konto oder Installation.',
      'Erzeuge ein neues Ergebnis, wenn eine Karte, ein Kapitel, eine Quest oder ein Schauplatz einen Namen braucht. Das Werkzeug verbindet fantasyartige Fragmente und unterschiedliche Strukturen zu Orten mit verschiedenen Stimmungen und Größen.',
      'Stelle eine Anzahl zwischen 1 und 100 ein. Erstellen zeigt einen Namen auf der Seite, Herunterladen bereitet eine Textdatei mit der gewünschten Anzahl vor. Passe Schreibweise, Sprache und Geografie an deine Welt an.',
      'Die Generierung läuft im Browser. Die Ergebnisse sind kreative Vorschläge und können zufällig realen Orten oder bestehenden fiktiven Schauplätzen ähneln.'
    ],
    aboutLine: 'Diese Seite erstellt Fantasy-Ortsnamen ohne Anmeldung oder Installation.'
  },
  fr: {
    title: 'Générateur de noms de lieux fantastiques',
    meta: 'Générez des noms pour royaumes, villes, forêts, ruines et lieux magiques. Gratuit et sans installation.',
    short: 'Créez des noms pour royaumes, villes, forêts, ruines et lieux magiques.',
    paragraphs: [
      'Le Générateur de noms de lieux fantastiques crée des lieux pour les jeux, récits, parties de rôle et univers originaux. Nommez royaumes, villes, forêts, ruines, îles et forteresses sans compte ni installation.',
      'Générez un nouveau résultat lorsqu’une carte, un chapitre, une quête ou un décor a besoin d’un nom. L’outil combine des fragments fantastiques et des structures variées pour proposer différentes ambiances et échelles.',
      'Réglez le nombre entre 1 et 100. Générer affiche un nom sur la page et Télécharger prépare un fichier texte avec le nombre demandé. Adaptez l’orthographe, la langue et la géographie à votre univers.',
      'La génération s’exécute dans le navigateur. Les résultats sont des suggestions créatives et peuvent ressembler par hasard à des lieux réels ou fictifs existants.'
    ],
    aboutLine: 'Cette page crée des noms de lieux fantastiques sans inscription ni installation.'
  },
  'pt-BR': {
    title: 'Gerador de nomes de lugares de fantasia',
    meta: 'Gere nomes para reinos, cidades, florestas, ruínas e locais mágicos. Grátis, instantâneo e sem instalação.',
    short: 'Crie nomes para reinos, cidades, florestas, ruínas e lugares mágicos.',
    paragraphs: [
      'O Gerador de nomes de lugares de fantasia cria locais para jogos, histórias, campanhas de RPG e mundos originais. Dê nomes a reinos, cidades, florestas, ruínas, ilhas e fortalezas sem instalar programas ou criar uma conta.',
      'Gere outro resultado quando um mapa, capítulo, missão ou cenário precisar de um nome. A ferramenta combina fragmentos de fantasia e estruturas variadas para sugerir lugares com diferentes atmosferas e escalas.',
      'Defina uma quantidade entre 1 e 100. Gerar mostra um nome na página e Baixar prepara um arquivo de texto com a quantidade solicitada. Ajuste a grafia, o idioma e a geografia ao seu mundo.',
      'A geração acontece no navegador. Os resultados são sugestões criativas e podem coincidir por acaso com lugares reais ou cenários fictícios existentes.'
    ],
    aboutLine: 'Esta página cria nomes de lugares de fantasia sem cadastro ou instalação.'
  }
};

export const locales = Object.fromEntries(Object.entries(baseLocales).map(([code, base]) => {
  const tool = content[code];
  const aboutHtml = base.aboutHtml.replace(/<p>[^<]*(?:fantasy|Fantasy|fantasia|fantásticos|Fantasy-Namen|ファンタジー|奇幻)[^<]*<\/p>/, `<p>${tool.aboutLine}</p>`);
  return [code, { ...base, ...tool, aboutHtml }];
}));
