import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.join(import.meta.dirname, 'guide-i18n.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const first = 'A lunch picker selects one item from the available menu list. Every remaining option has the same chance when the picker uses uniform random selection.';
const second = 'Choose a preset or enter one lunch option per line, remove anything unavailable, and spin. Avoiding recent winners can add variety across several meals.';
const values = {
  ko: ['점심 뽑기는 이용 가능한 메뉴 목록에서 하나를 선택합니다. 균등 무작위 선택을 사용하면 남은 모든 항목이 같은 확률로 선택됩니다.', '프리셋을 선택하거나 한 줄에 점심 메뉴 하나씩 입력하고, 이용할 수 없는 항목을 제거한 뒤 돌리세요. 최근 당첨 메뉴를 피하면 여러 번의 식사에서 다양성을 높일 수 있습니다.'],
  ja: ['ランチ抽選は利用可能なメニューから1つを選びます。均等なランダム選択では、残っているすべての候補が同じ確率で選ばれます。', 'プリセットを選ぶか1行に1つずつ候補を入力し、利用できない項目を除いて回します。最近の当選を避けると、複数回の食事に変化を付けられます。'],
  'zh-CN': ['午餐抽选器会从可用菜单列表中选出一项。采用均匀随机选择时，所有剩余选项被选中的概率相同。', '选择预设或每行输入一个午餐选项，移除不可用项后开始转动。避开最近结果可以让多次用餐更有变化。'],
  es: ['El selector de almuerzo elige un elemento de la lista disponible. Con una selección aleatoria uniforme, todas las opciones restantes tienen la misma probabilidad.', 'Elige un preajuste o introduce una opción por línea, elimina lo que no esté disponible y gira. Evitar resultados recientes puede aportar variedad a varias comidas.'],
  de: ['Die Mittagessen-Auswahl wählt einen Eintrag aus der verfügbaren Menüliste. Bei gleichmäßiger Zufallsauswahl hat jede verbleibende Option die gleiche Chance.', 'Wähle eine Voreinstellung oder gib eine Option pro Zeile ein, entferne nicht verfügbare Einträge und drehe. Das Vermeiden letzter Ergebnisse kann für mehr Abwechslung sorgen.'],
  fr: ['Le Sélecteur de déjeuner choisit un élément dans la liste disponible. Avec une sélection aléatoire uniforme, chaque option restante a la même chance.', 'Choisissez un préréglage ou saisissez une option par ligne, retirez les éléments indisponibles et lancez la sélection. Éviter les résultats récents peut varier plusieurs repas.'],
  'pt-BR': ['O Seletor de almoço escolhe um item da lista disponível. Com seleção aleatória uniforme, todas as opções restantes têm a mesma chance.', 'Escolha uma predefinição ou digite uma opção por linha, remova o que estiver indisponível e gire. Evitar resultados recentes pode trazer variedade a várias refeições.']
};
for (const [code, translated] of Object.entries(values)) {
  catalog.translations[code] ||= {};
  catalog.translations[code][first] = translated[0];
  catalog.translations[code][second] = translated[1];
}
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
