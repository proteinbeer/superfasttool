import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.join(import.meta.dirname, 'guide-i18n.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const keys = [
  'How to Use Who Pays? Roulette | Super Fast Tool',
  'How to Use Who Pays? Roulette. Learn the core idea, a practical workflow, common mistakes, and limitations before using the result.',
  'How to Use Who Pays? Roulette',
  'Spin the names and let chance decide who pays this time. This guide explains what the tool calculates or changes, how to use it carefully, and where a quick browser result has limits.',
  'Who Pays? Roulette selects one name from the current list. Each unique name has the same chance when the picker uses uniform random selection.',
  'How to use Who Pays? Roulette',
  'Enter at least two names, choose whether to remove each selected person, and spin. Reset restores the starter list and clears the recent results.',
  "The result is meant for lighthearted group decisions. Agree on the rules before spinning, and do not use a random picker to impose financial obligations without everyone's consent.",
  'Does Who Pays? Roulette require an account?',
  'Open Who Pays? Roulette'
];

const values = {
  ko: ['누가 계산할까? 룰렛 사용 방법 | Super Fast Tool', '누가 계산할까? 룰렛 사용 방법. 결과를 사용하기 전에 핵심 개념, 실용적인 절차, 흔한 실수와 제한 사항을 알아보세요.', '누가 계산할까? 룰렛 사용 방법', '이름을 돌려 이번에는 누가 계산할지 운에 맡겨 보세요. 이 가이드는 도구의 작동 방식, 주의 깊게 사용하는 방법과 빠른 브라우저 결과의 한계를 설명합니다.', '누가 계산할까? 룰렛은 현재 목록에서 이름 하나를 선택합니다. 균등 무작위 선택을 사용하면 고유한 각 이름이 선택될 확률은 같습니다.', '누가 계산할까? 룰렛 사용 방법', '이름을 두 개 이상 입력하고 선택된 사람을 제외할지 정한 다음 돌리세요. 초기화는 기본 목록을 복원하고 최근 결과를 지웁니다.', '결과는 가벼운 모임 결정을 위한 것입니다. 돌리기 전에 규칙에 동의하고 모두의 동의 없이 무작위 추첨으로 금전적 의무를 강요하지 마세요.', '누가 계산할까? 룰렛에 계정이 필요한가요?', '누가 계산할까? 룰렛 열기'],
  ja: ['誰が払う？ルーレットの使い方 | Super Fast Tool', '誰が払う？ルーレットの使い方。結果を使う前に基本、実用的な手順、よくある間違い、制限を確認します。', '誰が払う？ルーレットの使い方', '名前を回して今回は誰が払うかを運に任せましょう。このガイドでは仕組み、注意深い使い方、ブラウザ結果の限界を説明します。', '誰が払う？ルーレットは現在のリストから1人を選びます。均等なランダム選択では、各固有名が同じ確率で選ばれます。', '誰が払う？ルーレットの使い方', '2人以上の名前を入力し、選ばれた人を除外するか決めて回します。リセットは初期リストを戻し、最近の結果を消去します。', '結果は気軽なグループ決定向けです。回す前にルールへ同意し、全員の同意なしに金銭的義務を課すために使わないでください。', '誰が払う？ルーレットにアカウントは必要ですか？', '誰が払う？ルーレットを開く'],
  'zh-CN': ['谁买单？轮盘使用指南 | Super Fast Tool', '谁买单？轮盘使用指南。在使用结果前了解核心原理、实用流程、常见错误和限制。', '谁买单？轮盘使用指南', '转动名字，让随机结果决定这次谁买单。本指南说明工具原理、谨慎使用方法以及快速浏览器结果的局限。', '谁买单？轮盘会从当前列表中选出一个名字。均匀随机选择时，每个不同名字被选中的概率相同。', '如何使用谁买单？轮盘', '输入至少两个名字，选择是否移除每次选中的人，然后转动。重置会恢复初始列表并清除最近结果。', '结果仅用于轻松的群体决定。转动前请同意规则，不要在未经所有人同意时用随机选择强加金钱义务。', '谁买单？轮盘需要账户吗？', '打开谁买单？轮盘'],
  es: ['Cómo usar ¿Quién paga? Ruleta | Super Fast Tool', 'Cómo usar ¿Quién paga? Ruleta. Conoce la idea principal, un flujo práctico, errores comunes y limitaciones antes de usar el resultado.', 'Cómo usar ¿Quién paga? Ruleta', 'Gira los nombres y deja que el azar decida quién paga esta vez. Esta guía explica el funcionamiento, el uso cuidadoso y los límites de un resultado rápido en el navegador.', '¿Quién paga? Ruleta selecciona un nombre de la lista actual. Cada nombre único tiene la misma probabilidad con una selección aleatoria uniforme.', 'Cómo usar ¿Quién paga? Ruleta', 'Introduce al menos dos nombres, elige si quieres retirar a cada persona seleccionada y gira. Restablecer recupera la lista inicial y borra los resultados recientes.', 'El resultado está pensado para decisiones informales. Acordad las reglas antes de girar y no impongáis obligaciones económicas sin el consentimiento de todos.', '¿Quién paga? Ruleta requiere una cuenta?', 'Abrir ¿Quién paga? Ruleta'],
  de: ['Wer zahlt? Roulette verwenden | Super Fast Tool', 'Wer zahlt? Roulette verwenden. Lerne Grundidee, praktischen Ablauf, häufige Fehler und Grenzen kennen.', 'Wer zahlt? Roulette verwenden', 'Drehe die Namen und lass den Zufall entscheiden, wer diesmal zahlt. Dieser Leitfaden erklärt Funktionsweise, sorgfältige Nutzung und Grenzen eines schnellen Browser-Ergebnisses.', 'Wer zahlt? Roulette wählt einen Namen aus der aktuellen Liste. Bei gleichmäßiger Zufallsauswahl hat jeder eindeutige Name die gleiche Chance.', 'So verwendest du Wer zahlt? Roulette', 'Gib mindestens zwei Namen ein, entscheide, ob ausgewählte Personen entfernt werden, und drehe. Zurücksetzen stellt die Startliste wieder her und löscht letzte Ergebnisse.', 'Das Ergebnis ist für lockere Gruppenentscheidungen gedacht. Einigt euch vorher auf die Regeln und erzwingt ohne Zustimmung aller keine finanziellen Verpflichtungen per Zufall.', 'Benötigt Wer zahlt? Roulette ein Konto?', 'Wer zahlt? Roulette öffnen'],
  fr: ['Comment utiliser Qui paie ? Roulette | Super Fast Tool', 'Comment utiliser Qui paie ? Roulette. Découvrez le principe, une méthode pratique, les erreurs courantes et les limites avant d’utiliser le résultat.', 'Comment utiliser Qui paie ? Roulette', 'Faites défiler les noms et laissez le hasard décider qui paie cette fois. Ce guide explique le fonctionnement, l’utilisation prudente et les limites d’un résultat rapide dans le navigateur.', 'Qui paie ? Roulette choisit un nom dans la liste actuelle. Avec une sélection aléatoire uniforme, chaque nom unique a la même chance.', 'Comment utiliser Qui paie ? Roulette', 'Saisissez au moins deux noms, choisissez de retirer ou non chaque personne sélectionnée, puis lancez. Réinitialiser restaure la liste initiale et efface les résultats récents.', 'Le résultat est destiné aux décisions légères en groupe. Acceptez les règles avant le tirage et n’imposez aucune obligation financière sans le consentement de tous.', 'Qui paie ? Roulette nécessite-t-il un compte ?', 'Ouvrir Qui paie ? Roulette'],
  'pt-BR': ['Como usar Quem paga? Roleta | Super Fast Tool', 'Como usar Quem paga? Roleta. Conheça a ideia central, um fluxo prático, erros comuns e limitações antes de usar o resultado.', 'Como usar Quem paga? Roleta', 'Gire os nomes e deixe o acaso decidir quem paga desta vez. Este guia explica o funcionamento, o uso cuidadoso e os limites de um resultado rápido no navegador.', 'Quem paga? Roleta seleciona um nome da lista atual. Com seleção aleatória uniforme, cada nome único tem a mesma chance.', 'Como usar Quem paga? Roleta', 'Digite pelo menos dois nomes, escolha se cada pessoa selecionada será removida e gire. Redefinir restaura a lista inicial e limpa os resultados recentes.', 'O resultado é destinado a decisões descontraídas em grupo. Concordem com as regras antes do giro e não imponham obrigações financeiras sem o consentimento de todos.', 'Quem paga? Roleta exige uma conta?', 'Abrir Quem paga? Roleta']
};

for (const [code, translatedValues] of Object.entries(values)) {
  if (translatedValues.length !== keys.length) throw new Error(`${code}: translation count mismatch`);
  catalog.translations[code] ||= {};
  keys.forEach((key, index) => { catalog.translations[code][key] = translatedValues[index]; });
}
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log('Added Who Pays guide translations.');
