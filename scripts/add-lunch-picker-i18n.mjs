import fs from 'node:fs';
import path from 'node:path';
import { discoverToolPages } from './auto-tool-i18n.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalogPath = path.join(import.meta.dirname, 'tool-i18n.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const tool = discoverToolPages(root, ['fantasy-person-name-generator', 'fantasy-place-name-generator']).find(item => item.slug === 'lunch-picker');
if (!tool) throw new Error('Lunch Picker page was not discovered.');

const keys = [
  'Lunch Picker',
  "Spin a lunch slot machine and let chance choose today's meal.",
  "Spin a lunch slot machine, customize the menu list, exclude unavailable choices, and let chance choose today's meal.",
  'Lunch picker result', 'Choose your lunch', 'Spin when ready', 'Preset', 'World Mix',
  'Korean', 'Japanese', 'Chinese', 'Thai', 'Vietnamese', 'Indian', 'Mexican', 'Italian', 'Western', 'Fast Food', 'Custom',
  'Lunch options', 'One lunch option per line', 'Exclude', 'One excluded option per line', 'Avoid recent winners', 'Spin',
  'Add at least one available lunch option.', 'Spinning...', 'Spin Again', 'Recent', 'v1.2.453',
  'Lunch Picker is a browser-based meal decision tool with a slot-machine-style reveal. Choose a preset menu or enter your own lunch options, then spin to select one available meal at random.',
  'Use the exclusion list for sold-out restaurants, dietary conflicts, meals you already had, or anything that is unavailable today. The recent-winner option temporarily favors variety by avoiding the last few results whenever another choice remains.',
  'Your custom menu, exclusions, preference, and recent results are stored locally in this browser. The tool does not send the lunch list to a Super Fast Tool server, and clearing browser storage removes the saved choices.',
  'The result is a casual suggestion rather than nutrition or allergy advice. Check ingredients, dietary needs, price, restaurant hours, and availability before ordering or preparing a meal.'
];

const values = {
  ko: [
    '점심 뽑기', '점심 슬롯머신을 돌려 오늘의 메뉴를 운에 맡겨 보세요.', '점심 슬롯머신을 돌리고 메뉴 목록을 편집하고 먹을 수 없는 선택지를 제외한 뒤 오늘의 식사를 무작위로 골라 보세요.',
    '점심 뽑기 결과', '점심 메뉴를 고르세요', '준비되면 돌리세요', '프리셋', '세계 음식 모음',
    '한식', '일식', '중식', '태국 음식', '베트남 음식', '인도 음식', '멕시코 음식', '이탈리아 음식', '서양식', '패스트푸드', '직접 입력',
    '점심 메뉴', '한 줄에 점심 메뉴 하나', '제외', '한 줄에 제외할 메뉴 하나', '최근 당첨 메뉴 피하기', '돌리기',
    '선택 가능한 점심 메뉴를 하나 이상 추가하세요.', '돌리는 중...', '다시 돌리기', '최근 결과', 'v1.2.453',
    '점심 뽑기는 슬롯머신 방식으로 결과를 보여주는 브라우저 기반 메뉴 결정 도구입니다. 프리셋을 선택하거나 원하는 점심 메뉴를 직접 입력한 다음 돌리기를 눌러 이용 가능한 메뉴 중 하나를 무작위로 선택하세요.',
    '품절된 식당 메뉴, 식단과 맞지 않는 음식, 최근에 먹은 메뉴 또는 오늘 이용할 수 없는 항목은 제외 목록에 넣으세요. 최근 당첨 메뉴 피하기를 사용하면 다른 선택지가 남아 있는 동안 최근 결과를 건너뛰어 다양성을 높일 수 있습니다.',
    '직접 만든 메뉴 목록, 제외 항목, 설정 및 최근 결과는 이 브라우저에만 저장됩니다. 점심 목록은 Super Fast Tool 서버로 전송되지 않으며 브라우저 저장소를 삭제하면 저장된 선택지도 제거됩니다.',
    '결과는 가벼운 제안일 뿐 영양 또는 알레르기 관련 조언이 아닙니다. 주문하거나 조리하기 전에 재료, 식단 요구 사항, 가격, 영업시간 및 이용 가능 여부를 확인하세요.'
  ],
  ja: [
    'ランチ抽選', 'ランチスロットを回して、今日の食事を運に任せましょう。', 'ランチスロットを回し、メニューを編集し、利用できない候補を除外して、今日の食事をランダムに選びます。',
    'ランチ抽選結果', 'ランチを選びましょう', '準備ができたら回してください', 'プリセット', '世界の料理ミックス',
    '韓国料理', '日本料理', '中華料理', 'タイ料理', 'ベトナム料理', 'インド料理', 'メキシコ料理', 'イタリア料理', '洋食', 'ファストフード', 'カスタム',
    'ランチ候補', '1行に1つのランチ候補', '除外', '1行に1つの除外候補', '最近の当選を避ける', '回す',
    '利用可能なランチ候補を1つ以上追加してください。', '回転中...', 'もう一度回す', '最近の結果', 'v1.2.453',
    'ランチ抽選は、スロットマシン風に結果を表示するブラウザ上の食事決定ツールです。プリセットを選ぶか候補を入力し、回して利用可能なメニューから1つをランダムに選びます。',
    '売り切れの店、食事制限に合わない料理、最近食べたもの、今日利用できない候補は除外リストに追加してください。最近の当選を避ける設定は、別の候補が残っている間、直近の結果を避けて変化を増やします。',
    'カスタムメニュー、除外項目、設定、最近の結果はこのブラウザ内だけに保存されます。ランチ一覧はSuper Fast Toolのサーバーへ送信されず、ブラウザの保存データを消去すると選択内容も削除されます。',
    '結果は気軽な提案であり、栄養やアレルギーに関する助言ではありません。注文や調理の前に、材料、食事上の要件、価格、営業時間、提供状況を確認してください。'
  ],
  'zh-CN': [
    '午餐抽选器', '转动午餐老虎机，让运气决定今天吃什么。', '转动午餐老虎机，自定义菜单，排除无法选择的项目，然后随机决定今天的午餐。',
    '午餐抽选结果', '选择你的午餐', '准备好后开始转动', '预设', '世界美食混合',
    '韩国料理', '日本料理', '中国菜', '泰国菜', '越南菜', '印度菜', '墨西哥菜', '意大利菜', '西餐', '快餐', '自定义',
    '午餐选项', '每行一个午餐选项', '排除', '每行一个排除选项', '避开最近选中的结果', '转动',
    '请至少添加一个可用的午餐选项。', '转动中...', '再次转动', '最近结果', 'v1.2.453',
    '午餐抽选器是一款在浏览器中运行的用餐决策工具，以老虎机方式展示结果。选择预设菜单或输入自己的午餐选项，然后转动并从可用菜单中随机选出一个。',
    '可将售罄餐厅、不符合饮食要求的餐点、最近吃过的食物或今天无法购买的项目加入排除列表。启用避开最近结果后，只要还有其他选项，就会暂时跳过最近选中的菜单以增加变化。',
    '自定义菜单、排除项、偏好设置和最近结果仅保存在当前浏览器中。本工具不会把午餐列表发送到Super Fast Tool服务器，清除浏览器存储后这些选择也会被删除。',
    '结果只是轻松的建议，并非营养或过敏方面的指导。订购或烹饪前，请检查食材、饮食需求、价格、营业时间和供应情况。'
  ],
  es: [
    'Selector de almuerzo', 'Gira la máquina de almuerzos y deja que el azar elija la comida de hoy.', 'Gira una máquina de almuerzos, personaliza la lista, excluye opciones no disponibles y deja que el azar elija la comida de hoy.',
    'Resultado del selector de almuerzo', 'Elige tu almuerzo', 'Gira cuando estés listo', 'Preajuste', 'Mezcla mundial',
    'Comida coreana', 'Comida japonesa', 'Comida china', 'Comida tailandesa', 'Comida vietnamita', 'Comida india', 'Comida mexicana', 'Comida italiana', 'Comida occidental', 'Comida rápida', 'Personalizado',
    'Opciones de almuerzo', 'Una opción de almuerzo por línea', 'Excluir', 'Una opción excluida por línea', 'Evitar resultados recientes', 'Girar',
    'Añade al menos una opción de almuerzo disponible.', 'Girando...', 'Girar de nuevo', 'Recientes', 'v1.2.453',
    'Selector de almuerzo es una herramienta de decisión que funciona en el navegador y muestra el resultado como una máquina tragamonedas. Elige un menú predefinido o introduce tus opciones y gira para seleccionar una al azar.',
    'Usa la lista de exclusión para restaurantes sin disponibilidad, conflictos alimentarios, comidas recientes o cualquier opción que no esté disponible hoy. Evitar resultados recientes aumenta la variedad mientras queden otras opciones.',
    'El menú personalizado, las exclusiones, las preferencias y los resultados recientes se guardan únicamente en este navegador. La lista no se envía a un servidor de Super Fast Tool y se elimina al borrar el almacenamiento del navegador.',
    'El resultado es una sugerencia informal, no un consejo nutricional ni sobre alergias. Comprueba ingredientes, necesidades dietéticas, precio, horario y disponibilidad antes de pedir o preparar una comida.'
  ],
  de: [
    'Mittagessen-Auswahl', 'Drehe den Mittagessen-Automaten und überlasse die heutige Mahlzeit dem Zufall.', 'Drehe einen Mittagessen-Automaten, passe die Menüliste an, schließe nicht verfügbare Optionen aus und lass den Zufall entscheiden.',
    'Ergebnis der Mittagessen-Auswahl', 'Wähle dein Mittagessen', 'Drehe, wenn du bereit bist', 'Voreinstellung', 'Weltweite Mischung',
    'Koreanisch', 'Japanisch', 'Chinesisch', 'Thailändisch', 'Vietnamesisch', 'Indisch', 'Mexikanisch', 'Italienisch', 'Westlich', 'Fast Food', 'Benutzerdefiniert',
    'Mittagessen-Optionen', 'Eine Option pro Zeile', 'Ausschließen', 'Eine ausgeschlossene Option pro Zeile', 'Letzte Ergebnisse vermeiden', 'Drehen',
    'Füge mindestens eine verfügbare Mittagessen-Option hinzu.', 'Wird gedreht...', 'Erneut drehen', 'Letzte Ergebnisse', 'v1.2.453',
    'Die Mittagessen-Auswahl ist ein browserbasiertes Entscheidungstool mit einer Spielautomaten-Anzeige. Wähle ein voreingestelltes Menü oder gib eigene Optionen ein und drehe, um zufällig eine verfügbare Mahlzeit auszuwählen.',
    'Nutze die Ausschlussliste für ausverkaufte Restaurants, Ernährungskonflikte, kürzlich gegessene Mahlzeiten oder heute nicht verfügbare Optionen. Das Vermeiden letzter Ergebnisse sorgt für Abwechslung, solange andere Optionen übrig sind.',
    'Deine Menüliste, Ausschlüsse, Einstellungen und letzten Ergebnisse werden nur in diesem Browser gespeichert. Die Liste wird nicht an einen Server von Super Fast Tool gesendet und beim Löschen des Browser-Speichers entfernt.',
    'Das Ergebnis ist ein lockerer Vorschlag und keine Ernährungs- oder Allergieberatung. Prüfe Zutaten, Ernährungsanforderungen, Preis, Öffnungszeiten und Verfügbarkeit vor der Bestellung oder Zubereitung.'
  ],
  fr: [
    'Sélecteur de déjeuner', 'Faites tourner la machine à déjeuner et laissez le hasard choisir le repas du jour.', 'Faites tourner une machine à déjeuner, personnalisez la liste, excluez les choix indisponibles et laissez le hasard choisir le repas du jour.',
    'Résultat du sélecteur de déjeuner', 'Choisissez votre déjeuner', 'Faites tourner quand vous êtes prêt', 'Préréglage', 'Mélange du monde',
    'Cuisine coréenne', 'Cuisine japonaise', 'Cuisine chinoise', 'Cuisine thaïlandaise', 'Cuisine vietnamienne', 'Cuisine indienne', 'Cuisine mexicaine', 'Cuisine italienne', 'Cuisine occidentale', 'Restauration rapide', 'Personnalisé',
    'Options de déjeuner', 'Une option par ligne', 'Exclure', 'Une option exclue par ligne', 'Éviter les résultats récents', 'Tourner',
    'Ajoutez au moins une option de déjeuner disponible.', 'Rotation...', 'Tourner à nouveau', 'Résultats récents', 'v1.2.453',
    'Le Sélecteur de déjeuner est un outil de décision dans le navigateur qui révèle le résultat comme une machine à sous. Choisissez un menu prédéfini ou saisissez vos options, puis lancez la sélection aléatoire.',
    'Utilisez la liste d’exclusion pour les restaurants complets, les contraintes alimentaires, les repas récents ou toute option indisponible aujourd’hui. Éviter les résultats récents favorise la variété tant que d’autres choix restent disponibles.',
    'Votre menu personnalisé, les exclusions, les préférences et les résultats récents sont enregistrés uniquement dans ce navigateur. La liste n’est pas envoyée à un serveur Super Fast Tool et disparaît lorsque le stockage du navigateur est effacé.',
    'Le résultat est une suggestion décontractée, pas un conseil nutritionnel ou allergologique. Vérifiez les ingrédients, les besoins alimentaires, le prix, les horaires et la disponibilité avant de commander ou de préparer un repas.'
  ],
  'pt-BR': [
    'Seletor de almoço', 'Gire a máquina de almoço e deixe o acaso escolher a refeição de hoje.', 'Gire uma máquina de almoço, personalize a lista, exclua opções indisponíveis e deixe o acaso escolher a refeição de hoje.',
    'Resultado do seletor de almoço', 'Escolha seu almoço', 'Gire quando estiver pronto', 'Predefinição', 'Mistura mundial',
    'Comida coreana', 'Comida japonesa', 'Comida chinesa', 'Comida tailandesa', 'Comida vietnamita', 'Comida indiana', 'Comida mexicana', 'Comida italiana', 'Comida ocidental', 'Fast food', 'Personalizado',
    'Opções de almoço', 'Uma opção de almoço por linha', 'Excluir', 'Uma opção excluída por linha', 'Evitar resultados recentes', 'Girar',
    'Adicione pelo menos uma opção de almoço disponível.', 'Girando...', 'Girar novamente', 'Recentes', 'v1.2.453',
    'O Seletor de almoço é uma ferramenta de decisão no navegador que mostra o resultado como uma máquina caça-níqueis. Escolha um menu predefinido ou digite suas opções e gire para selecionar uma refeição disponível ao acaso.',
    'Use a lista de exclusão para restaurantes sem disponibilidade, conflitos alimentares, refeições recentes ou qualquer opção indisponível hoje. Evitar resultados recentes aumenta a variedade enquanto houver outras opções.',
    'Seu menu personalizado, exclusões, preferência e resultados recentes são armazenados apenas neste navegador. A lista não é enviada a um servidor do Super Fast Tool e é removida ao limpar o armazenamento do navegador.',
    'O resultado é uma sugestão casual, não uma orientação nutricional ou sobre alergias. Verifique ingredientes, necessidades alimentares, preço, horário e disponibilidade antes de pedir ou preparar uma refeição.'
  ]
};

catalog.tools[tool.slug] = tool;
for (const [code, translatedValues] of Object.entries(values)) {
  if (translatedValues.length !== keys.length) throw new Error(`${code}: expected ${keys.length} translations, received ${translatedValues.length}`);
  const translations = catalog.translations[code] || {};
  keys.forEach((key, index) => { translations[key] = translatedValues[index]; });
  catalog.translations[code] = translations;
}
catalog.generatedAt = new Date().toISOString();
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log(`Added ${tool.slug} and ${keys.length} local translations for ${Object.keys(values).length} locales.`);
