import fs from 'node:fs';
import path from 'node:path';
import { discoverToolPages } from './auto-tool-i18n.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalogPath = path.join(import.meta.dirname, 'tool-i18n.catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const slug = 'who-pays-roulette';
const tool = discoverToolPages(root, ['fantasy-person-name-generator', 'fantasy-place-name-generator']).find(item => item.slug === slug);
if (!tool) throw new Error('Who Pays? Roulette page was not discovered.');
catalog.tools[slug] = tool;

const translations = {
  ko: {
    'Who Pays? Roulette': '누가 계산할까? 룰렛',
    'Spin the names and let chance decide who pays this time.': '이름을 돌려 이번에는 누가 계산할지 운에 맡겨 보세요.',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': '이름을 입력하고 슬롯머신 방식의 룰렛을 돌려 누가 계산할지 정하세요. 이름은 브라우저에만 저장됩니다.',
    'Who pays roulette result': '누가 계산할까 룰렛 결과',
    'Who pays?': '누가 계산할까요?',
    'Names': '이름',
    'One name per line': '한 줄에 이름 하나',
    'Remove the winner after each spin': '매번 당첨된 사람 제외',
    'Reset names': '이름 초기화',
    'Add at least two names.': '이름을 두 개 이상 추가하세요.',
    'pays!': '계산!',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': '누가 계산할까? 룰렛은 슬롯머신 애니메이션으로 한 사람을 뽑는 재미있는 브라우저 기반 이름 추첨기입니다. 이름을 두 개 이상 입력하고 돌려 가벼운 모임 결정을 정해 보세요.',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': '한 라운드에서 각 사람을 한 번만 뽑으려면 당첨자 제외를 켜세요. 초기화로 기본 목록을 복원하거나 이름을 직접 편집해 새 그룹을 시작할 수 있습니다.',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': '이름, 설정, 최근 결과는 이 브라우저에 로컬로 저장됩니다. 목록은 Super Fast Tool 서버로 전송되지 않으며 브라우저 저장소를 지우면 저장된 그룹도 삭제됩니다.',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': '결과는 무작위이며 가벼운 결정을 위한 것입니다. 특히 돈이나 책임이 관련된 경우 돌리기 전에 모두가 규칙에 동의해야 합니다.'
  },
  ja: {
    'Who Pays? Roulette': '誰が払う？ルーレット',
    'Spin the names and let chance decide who pays this time.': '名前を回して、今回は誰が払うかを運に任せましょう。',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': '名前を入力してスロット風ルーレットを回し、誰が払うかを決めます。名前はブラウザ内に保存されます。',
    'Who pays roulette result': '誰が払うルーレットの結果',
    'Who pays?': '誰が払う？',
    'Names': '名前',
    'One name per line': '1行に1人',
    'Remove the winner after each spin': '毎回選ばれた人を除外',
    'Reset names': '名前をリセット',
    'Add at least two names.': '名前を2つ以上追加してください。',
    'pays!': 'が払います！',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': '誰が払う？ルーレットは、スロット風アニメーションで1人を選ぶ楽しいブラウザ型の名前抽選ツールです。2人以上の名前を入力して回し、気軽なグループの決定に使えます。',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': '1ラウンドで各人を1回だけ選ぶ場合は当選者の除外を有効にします。リセットで初期リストに戻すか、名前を編集して新しいグループを始められます。',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': '名前、設定、最近の結果はこのブラウザにローカル保存されます。リストはSuper Fast Toolのサーバーへ送信されず、ブラウザの保存データを消去すると削除されます。',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': '結果はランダムで、気軽な決定を目的としています。お金や責任が関わる場合は、回す前に全員でルールに同意してください。'
  },
  'zh-CN': {
    'Who Pays? Roulette': '谁买单？轮盘',
    'Spin the names and let chance decide who pays this time.': '转动名字，让随机结果决定这次谁买单。',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': '输入名字并转动老虎机风格的轮盘，让随机结果决定谁买单。名字仅保存在浏览器中。',
    'Who pays roulette result': '谁买单轮盘结果',
    'Who pays?': '谁买单？',
    'Names': '名字',
    'One name per line': '每行一个名字',
    'Remove the winner after each spin': '每次转动后移除选中者',
    'Reset names': '重置名字',
    'Add at least two names.': '请至少添加两个名字。',
    'pays!': '买单！',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': '谁买单？轮盘是一款有趣的浏览器名字抽选工具，通过老虎机动画选出一人。输入两个或更多名字并转动，用结果解决轻松的群体决定。',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': '如果一轮中每个人最多只能被选中一次，请启用移除选中者。使用重置恢复初始列表，或直接编辑名字开始新一组。',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': '名字、设置和最近结果仅保存在当前浏览器中。列表不会发送到Super Fast Tool服务器，清除浏览器存储会删除已保存的群组。',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': '结果是随机的，仅用于轻松决定。尤其涉及金钱或责任时，所有参与者应在转动前同意规则。'
  },
  es: {
    'Who Pays? Roulette': '¿Quién paga? Ruleta',
    'Spin the names and let chance decide who pays this time.': 'Gira los nombres y deja que el azar decida quién paga esta vez.',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': 'Introduce nombres, gira una ruleta estilo tragamonedas y deja que el azar decida quién paga. Los nombres permanecen en tu navegador.',
    'Who pays roulette result': 'Resultado de la ruleta de quién paga',
    'Who pays?': '¿Quién paga?',
    'Names': 'Nombres',
    'One name per line': 'Un nombre por línea',
    'Remove the winner after each spin': 'Eliminar al elegido después de cada giro',
    'Reset names': 'Restablecer nombres',
    'Add at least two names.': 'Añade al menos dos nombres.',
    'pays!': '¡paga!',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': '¿Quién paga? Ruleta es un selector de nombres divertido que funciona en el navegador y revela a una persona con una animación de tragamonedas. Introduce dos o más nombres, gira y usa el resultado para resolver una decisión informal del grupo.',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': 'Activa la eliminación del ganador si cada persona debe salir como máximo una vez por ronda. Usa Restablecer para recuperar la lista inicial o edita los nombres para comenzar otro grupo.',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': 'Los nombres, ajustes y resultados recientes se guardan localmente en este navegador. La lista no se envía a un servidor de Super Fast Tool y se elimina al borrar el almacenamiento del navegador.',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': 'El resultado es aleatorio y está pensado para decisiones informales. Todos deben aceptar las reglas antes de girar, especialmente si hay dinero o responsabilidades de por medio.'
  },
  de: {
    'Who Pays? Roulette': 'Wer zahlt? Roulette',
    'Spin the names and let chance decide who pays this time.': 'Drehe die Namen und lass den Zufall entscheiden, wer diesmal zahlt.',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': 'Gib Namen ein, drehe ein Spielautomaten-Roulette und lass den Zufall entscheiden, wer zahlt. Die Namen bleiben in deinem Browser.',
    'Who pays roulette result': 'Ergebnis des Wer-zahlt-Roulettes',
    'Who pays?': 'Wer zahlt?',
    'Names': 'Namen',
    'One name per line': 'Ein Name pro Zeile',
    'Remove the winner after each spin': 'Ausgewählte Person nach jeder Runde entfernen',
    'Reset names': 'Namen zurücksetzen',
    'Add at least two names.': 'Füge mindestens zwei Namen hinzu.',
    'pays!': 'zahlt!',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': 'Wer zahlt? Roulette ist ein spielerischer Namenswähler im Browser, der eine Person mit einer Spielautomaten-Animation enthüllt. Gib mindestens zwei Namen ein und nutze das Ergebnis für eine lockere Gruppenentscheidung.',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': 'Aktiviere das Entfernen der ausgewählten Person, wenn jede Person pro Runde höchstens einmal gewählt werden soll. Mit Zurücksetzen stellst du die Startliste wieder her oder beginnst durch Bearbeiten der Namen eine neue Gruppe.',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': 'Namen, Einstellungen und letzte Ergebnisse werden lokal in diesem Browser gespeichert. Die Liste wird nicht an einen Super-Fast-Tool-Server gesendet und beim Löschen des Browser-Speichers entfernt.',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': 'Das Ergebnis ist zufällig und für lockere Entscheidungen gedacht. Alle Beteiligten sollten den Regeln vor dem Drehen zustimmen, besonders wenn Geld oder Verantwortlichkeiten betroffen sind.'
  },
  fr: {
    'Who Pays? Roulette': 'Qui paie ? Roulette',
    'Spin the names and let chance decide who pays this time.': 'Faites défiler les noms et laissez le hasard décider qui paie cette fois.',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': 'Saisissez des noms, lancez une roulette façon machine à sous et laissez le hasard décider qui paie. Les noms restent dans votre navigateur.',
    'Who pays roulette result': 'Résultat de la roulette Qui paie',
    'Who pays?': 'Qui paie ?',
    'Names': 'Noms',
    'One name per line': 'Un nom par ligne',
    'Remove the winner after each spin': 'Retirer la personne choisie après chaque tour',
    'Reset names': 'Réinitialiser les noms',
    'Add at least two names.': 'Ajoutez au moins deux noms.',
    'pays!': 'paie !',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': 'Qui paie ? Roulette est un sélecteur de noms ludique dans le navigateur qui révèle une personne avec une animation de machine à sous. Saisissez au moins deux noms et utilisez le résultat pour une décision légère en groupe.',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': 'Activez le retrait de la personne choisie si chacun ne doit apparaître qu’une fois par manche. Utilisez Réinitialiser pour restaurer la liste de départ ou modifiez les noms pour créer un nouveau groupe.',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': 'Les noms, réglages et résultats récents sont stockés localement dans ce navigateur. La liste n’est pas envoyée à un serveur Super Fast Tool et disparaît lorsque le stockage du navigateur est effacé.',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': 'Le résultat est aléatoire et destiné aux décisions légères. Toutes les personnes concernées doivent accepter les règles avant le tirage, surtout lorsque de l’argent ou des responsabilités sont en jeu.'
  },
  'pt-BR': {
    'Who Pays? Roulette': 'Quem paga? Roleta',
    'Spin the names and let chance decide who pays this time.': 'Gire os nomes e deixe o acaso decidir quem paga desta vez.',
    'Enter names, spin a slot-machine-style roulette, and let chance decide who pays. Names stay in your browser.': 'Digite nomes, gire uma roleta estilo caça-níqueis e deixe o acaso decidir quem paga. Os nomes ficam no seu navegador.',
    'Who pays roulette result': 'Resultado da roleta Quem paga',
    'Who pays?': 'Quem paga?',
    'Names': 'Nomes',
    'One name per line': 'Um nome por linha',
    'Remove the winner after each spin': 'Remover a pessoa escolhida após cada giro',
    'Reset names': 'Redefinir nomes',
    'Add at least two names.': 'Adicione pelo menos dois nomes.',
    'pays!': 'paga!',
    'Who Pays? Roulette is a playful browser-based name picker that reveals one person with a slot-machine animation. Enter two or more names, spin, and use the result to settle a casual group decision.': 'Quem paga? Roleta é um seletor de nomes divertido no navegador que revela uma pessoa com animação de caça-níqueis. Digite dois ou mais nomes, gire e use o resultado para resolver uma decisão casual do grupo.',
    'Enable winner removal when each person should be selected at most once during a round. Use Reset to restore the starter list, or edit the names directly to begin a new group.': 'Ative a remoção da pessoa escolhida quando cada participante puder sair apenas uma vez por rodada. Use Redefinir para restaurar a lista inicial ou edite os nomes para começar outro grupo.',
    'Names, settings, and recent results are stored locally in this browser. The list is not sent to a Super Fast Tool server, and clearing browser storage removes the saved group.': 'Nomes, configurações e resultados recentes são armazenados localmente neste navegador. A lista não é enviada a um servidor do Super Fast Tool e é removida ao limpar o armazenamento do navegador.',
    'The result is random and intended for lighthearted decisions. Everyone involved should agree to the rules before spinning, especially when money or responsibilities are involved.': 'O resultado é aleatório e destinado a decisões descontraídas. Todos devem concordar com as regras antes do giro, especialmente quando houver dinheiro ou responsabilidades envolvidas.'
  }
};

for (const [code, map] of Object.entries(translations)) {
  catalog.translations[code] ||= {};
  Object.assign(catalog.translations[code], map);
}
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
console.log(`Added ${slug} with ${tool.strings.length} strings.`);
