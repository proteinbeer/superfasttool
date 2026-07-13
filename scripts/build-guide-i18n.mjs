import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, serialize } from 'parse5';
import { toolI18nConfigs } from './tool-i18n.config.mjs';
import { buildLocaleRouting } from './locale-routing-builder.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const baseUrl = 'https://superfasttool.com';
const version = 'v1.2.455';
const catalogPath = path.join(here, 'guide-i18n.catalog.json');
const localeDefinitions = {
  en: { label: 'English', target: 'en' },
  ko: { label: 'Korean', target: 'ko' },
  ja: { label: 'Japanese', target: 'ja' },
  'zh-CN': { label: 'Simplified Chinese', target: 'zh-CN' },
  es: { label: 'Spanish', target: 'es' },
  de: { label: 'Deutsch', target: 'de' },
  fr: { label: 'French', target: 'fr' },
  'pt-BR': { label: 'Portuguese (Brazil)', target: 'pt' }
};
const localeCodes = Object.keys(localeDefinitions);
const guideSlugFor = slug => slug === 'stock-crypto-avg-cost-calculator' ? 'how-to-calculate-average-stock-cost' : slug;
const guideConfigs = toolI18nConfigs.filter(config => config.guideHref);
const guideSlugs = guideConfigs.map(config => guideSlugFor(config.slug));
const toolSlugs = toolI18nConfigs.map(config => config.slug);

function attr(node, name) {
  return node.attrs?.find(item => item.name === name)?.value;
}

function setAttr(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find(item => item.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}

function hasClass(node, name) {
  return (attr(node, 'class') || '').split(/\s+/).includes(name);
}

function walk(node, visitor, ancestors = []) {
  visitor(node, ancestors);
  for (const child of node.childNodes || []) walk(child, visitor, [...ancestors, node]);
}

function languageControl(code, guideSlug) {
  const items = localeCodes.map(locale => {
    const selected = locale === code;
    const href = locale === 'en' ? `/guides/${guideSlug}/` : `/${locale}/guides/${guideSlug}/`;
    return `<a role="menuitem" data-locale="${locale}" aria-current="${selected}" href="${href}" class="language-item${selected ? ' selected' : ''}"><span>${localeDefinitions[locale].label}</span><small>${locale.toUpperCase()}</small></a>`;
  }).join('');
  return `<div class="language-menu"><button id="languageMenuButton" type="button" aria-haspopup="menu" aria-expanded="false"><span>${localeDefinitions[code].label}</span><span class="language-chevron" aria-hidden="true"></span></button><div id="languageMenu" role="menu" hidden>${items}</div></div>`;
}

function alternateLinks(guideSlug) {
  const links = localeCodes.map(code => {
    const href = code === 'en' ? `${baseUrl}/guides/${guideSlug}/` : `${baseUrl}/${code}/guides/${guideSlug}/`;
    return `<link rel="alternate" hreflang="${code}" href="${href}">`;
  });
  links.push(`<link rel="alternate" hreflang="x-default" href="${baseUrl}/guides/${guideSlug}/">`);
  return `<!-- SFT_GUIDE_I18N_ALTERNATES_START -->${links.join('')}<!-- SFT_GUIDE_I18N_ALTERNATES_END -->`;
}

const menuCss = `.language-menu{position:relative;flex:0 0 auto}.language-menu button{min-width:120px;height:38px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 12px;border:1px solid #18181b;border-radius:8px;background:#18181b;color:#fff;font:800 12px/1 Inter,ui-sans-serif,system-ui;cursor:pointer}.language-chevron{width:7px;height:7px;border-right:2px solid #fff;border-bottom:2px solid #fff;transform:translateY(-2px) rotate(45deg)}.language-menu [role=menu]{position:absolute;right:0;top:calc(100% + 8px);z-index:80;width:190px;padding:6px;border:1px solid #e4e4e7;border-radius:8px;background:#fff;box-shadow:0 16px 40px rgba(24,24,27,.16)}.language-item{display:flex;align-items:center;justify-content:space-between;padding:9px 10px;border-radius:6px;color:#3f3f46;text-decoration:none;font-size:12px;font-weight:800}.language-item:hover{background:#f4f4f5}.language-item.selected{background:#18181b;color:#fff}.language-item small{color:#a1a1aa;font-size:10px}.language-item.selected small{color:#fdba74}[hidden]{display:none!important}`;
const menuScript = `<script>(()=>{const button=document.getElementById('languageMenuButton');const menu=document.getElementById('languageMenu');if(!button||!menu)return;const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false')};button.addEventListener('click',event=>{event.stopPropagation();menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden))});document.addEventListener('click',event=>{if(!event.target.closest('.language-menu'))close()});document.addEventListener('keydown',event=>{if(event.key==='Escape')close()})})();</script>`;

function normalizeSource(source, code, guideSlug) {
  let output = source.replace(/v1\.2\.\d+/g, version);
  output = output.replace(/<a class="tool-link"[\s\S]*?<\/a>\s*(?=<section>)/, '');
  output = output.replace(/\s*<!-- SFT_GUIDE_I18N_ALTERNATES_START -->[\s\S]*?<!-- SFT_GUIDE_I18N_ALTERNATES_END -->/g, '');
  output = output.replace(/\s*<script src="\/locale-routing\.js"><\/script>/g, '');
  output = output.replace(/(<link rel="canonical"[^>]+>)/, `$1${alternateLinks(guideSlug)}<script src="/locale-routing.js"></script>`);
  output = output.replace(/<div class="language-menu">[\s\S]*?<\/div><\/div><\/div><\/header>/, `${languageControl(code, guideSlug)}</div></header>`);
  output = output.replace('<div data-guide-language-slot></div>', languageControl(code, guideSlug));
  if (!output.includes("const button=document.getElementById('languageMenuButton')")) output = output.replace('</body>', `${menuScript}</body>`);
  if (!output.includes('.language-menu{position:relative')) output = output.replace('</style>', `${menuCss}</style>`);
  return output;
}

function excludedText(ancestors) {
  if (ancestors.some(node => ['script', 'style'].includes(node.tagName))) return true;
  if (ancestors.some(node => hasClass(node, 'language-menu') || hasClass(node, 'logo-text') || hasClass(node, 'logo-sub-name') || hasClass(node, 'version'))) return true;
  return ancestors.some(node => node.tagName === 'a' && attr(node, 'rel')?.includes('noopener'));
}

function translatable(value) {
  const text = value.trim();
  return text.length > 0 && /[A-Za-z]/.test(text);
}

function collectStrings(html) {
  const document = parse(html);
  const strings = new Set();
  walk(document, (node, ancestors) => {
    if (node.nodeName === '#text' && !excludedText(ancestors) && translatable(node.value)) strings.add(node.value.trim());
    if (node.tagName === 'meta' && ['description', 'og:title', 'og:description'].includes(attr(node, 'name') || attr(node, 'property'))) {
      const value = attr(node, 'content');
      if (translatable(value || '')) strings.add(value.trim());
    }
  });
  return strings;
}

const guideCommonTranslations = {
  ko: {
    'How to read the result': '결과를 읽는 방법',
    'Conversion workflow': '변환 작업 흐름',
    'Image workflow': '이미지 작업 흐름',
    'Audio workflow': '오디오 작업 흐름',
    'Generation workflow': '생성 작업 흐름',
    'How to play or use it': '플레이하거나 사용하는 방법',
    'Quick note': '빠른 참고',
    'Before you rely on it': '사용하기 전에 확인할 점',
    'Why can two calculators disagree?': '왜 계산기마다 결과가 다를 수 있나요?',
    'Can I use this as professional advice?': '전문적인 조언으로 사용해도 되나요?',
    'What should I save with the answer?': '결과와 함께 무엇을 저장해야 하나요?',
    'Is every conversion exact?': '모든 변환이 정확한가요?',
    'Why does reversing a conversion not always match perfectly?': '반대로 변환했을 때 왜 항상 완전히 일치하지 않나요?',
    'Can I use the result in code or records?': '코드나 기록에 결과를 사용해도 되나요?',
    'Does the image leave my browser?': '이미지가 브라우저 밖으로 나가나요?',
    'Will quality stay identical?': '품질이 항상 동일하게 유지되나요?',
    'Why is the output file larger?': '출력 파일이 왜 더 커질 수 있나요?',
    'Why should I preview audio?': '왜 오디오를 미리 들어봐야 하나요?',
    'Does conversion improve quality?': '변환하면 품질이 좋아지나요?',
    'Why might playback differ by device?': '기기마다 재생이 왜 다를 수 있나요?',
    'Is the result fair?': '결과가 공정한가요?',
    'Does the game save progress?': '게임 진행 상황이 저장되나요?',
    'Can I use this with a group?': '그룹에서 사용해도 되나요?',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': '이 페이지는 특정 작업을 더 빠르게 처리하기 위한 참고용입니다. 공식 기준, 전문가 조언, 파일 백업, 원본 문서, 필요한 경우의 사람 검토를 대체하지 않습니다.',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': '예시는 하나의 패턴으로 사용하세요. 실제 작업 하나를 분리하고, 원본 값을 보이게 둔 뒤, 결과를 다른 앱, 주문 양식, 디자인, 스프레드시트, 게임 세션 또는 프로젝트 노트에 복사하기 전에 확인하세요.'
  },
  ja: {
    'How to read the result': '結果の読み方',
    'Conversion workflow': '変換の流れ',
    'Image workflow': '画像の作業手順',
    'Audio workflow': '音声の作業手順',
    'Generation workflow': '生成の流れ',
    'How to play or use it': '遊び方と使い方',
    'Quick note': '短いメモ',
    'Before you rely on it': '使用前に確認すること',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': 'このページは特定の作業をすばやく進めるためのものです。公式基準、専門的な助言、ファイルのバックアップ、元資料、必要な人による確認の代わりにはなりません。',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': '例は作業の型として使ってください。実際の作業を一つに絞り、元の値を見える状態にして、別のアプリ、注文フォーム、デザイン、スプレッドシート、ゲームセッション、プロジェクトノートへコピーする前に結果を確認します。'
  },
  'zh-CN': {
    'How to read the result': '如何读取结果',
    'Conversion workflow': '转换流程',
    'Image workflow': '图像处理流程',
    'Audio workflow': '音频处理流程',
    'Generation workflow': '生成流程',
    'How to play or use it': '玩法或使用方式',
    'Quick note': '快速提示',
    'Before you rely on it': '依赖结果前请检查',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': '本页面用于更快完成一个明确任务。在需要官方标准、专业建议、文件备份、源文档或人工审核时，它不能替代这些内容。',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': '可以把示例当作操作模板：先明确一个真实任务，保留原始值可见，并在把结果复制到其他应用、订单表单、设计、电子表格、游戏记录或项目笔记前进行检查。'
  },
  es: {
    'How to read the result': 'Cómo leer el resultado',
    'Conversion workflow': 'Flujo de conversión',
    'Image workflow': 'Flujo de trabajo con imágenes',
    'Audio workflow': 'Flujo de trabajo con audio',
    'Generation workflow': 'Flujo de generación',
    'How to play or use it': 'Cómo jugar o usarlo',
    'Quick note': 'Nota rápida',
    'Before you rely on it': 'Antes de confiar en el resultado',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': 'Esta página está pensada para acelerar una tarea concreta. No sustituye normas oficiales, asesoramiento profesional, copias de seguridad, documentación original ni revisión humana cuando sean necesarias.',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': 'Usa el ejemplo como patrón: separa una tarea real, mantén visible el valor original y revisa el resultado antes de copiarlo en otra aplicación, formulario, diseño, hoja de cálculo, sesión de juego o nota de proyecto.'
  },
  de: {
    'How to read the result': 'So liest du das Ergebnis',
    'Conversion workflow': 'Ablauf der Umrechnung',
    'Image workflow': 'Bild-Workflow',
    'Audio workflow': 'Audio-Workflow',
    'Generation workflow': 'Ablauf der Generierung',
    'How to play or use it': 'So spielst oder nutzt du es',
    'Quick note': 'Kurzer Hinweis',
    'Before you rely on it': 'Vor der Nutzung prüfen',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': 'Diese Seite soll eine klar umrissene Aufgabe schneller machen. Sie ersetzt keine offiziellen Standards, professionelle Beratung, Dateisicherungen, Quelldokumentation oder menschliche Prüfung, wenn diese erforderlich sind.',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': 'Nutze das Beispiel als Muster: Trenne eine konkrete Aufgabe, lasse den Ausgangswert sichtbar und prüfe das Ergebnis, bevor du es in eine andere App, ein Formular, ein Design, eine Tabelle, eine Spielrunde oder eine Projektnotiz kopierst.'
  },
  fr: {
    'How to read the result': 'Comment lire le résultat',
    'Conversion workflow': 'Flux de conversion',
    'Image workflow': 'Flux de travail image',
    'Audio workflow': 'Flux de travail audio',
    'Generation workflow': 'Flux de génération',
    'How to play or use it': 'Comment jouer ou l’utiliser',
    'Quick note': 'Note rapide',
    'Before you rely on it': 'À vérifier avant de s’y fier',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': 'Cette page sert à accélérer une tâche précise. Elle ne remplace pas les normes officielles, les conseils professionnels, les sauvegardes, la documentation source ni la relecture humaine lorsqu’elles sont nécessaires.',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': 'Utilisez l’exemple comme modèle : isolez une tâche réelle, gardez la valeur source visible et vérifiez le résultat avant de le copier dans une autre application, un formulaire, un design, une feuille de calcul, une session de jeu ou une note de projet.'
  },
  'pt-BR': {
    'How to read the result': 'Como ler o resultado',
    'Conversion workflow': 'Fluxo de conversão',
    'Image workflow': 'Fluxo de imagem',
    'Audio workflow': 'Fluxo de áudio',
    'Generation workflow': 'Fluxo de geração',
    'How to play or use it': 'Como jogar ou usar',
    'Quick note': 'Nota rápida',
    'Before you rely on it': 'Antes de confiar no resultado',
    'This page is meant to make a focused task faster. It does not replace official standards, professional advice, file backups, source documentation, or human review when those are required.': 'Esta página serve para acelerar uma tarefa específica. Ela não substitui normas oficiais, orientação profissional, backups de arquivos, documentação original nem revisão humana quando isso for necessário.',
    'Use the example as a pattern: isolate one real task, keep the source value visible, and check the result before copying it into another app, order form, design, spreadsheet, game session, or project note.': 'Use o exemplo como padrão: isole uma tarefa real, mantenha o valor original visível e confira o resultado antes de copiá-lo para outro aplicativo, formulário, design, planilha, sessão de jogo ou nota de projeto.'
  }
};

const guideFallbackTemplates = {
  ko: {
    basics: title => `${title} 기본`,
    handles: title => `${title}는 이 작업을 브라우저에서 빠르게 처리하도록 도와줍니다.`,
    forTool: title => `${title}를 사용할 때는 입력값, 단위, 설정, 결과를 함께 확인하는 습관이 가장 중요합니다.`,
    calculatorStep: [
      '비용, 비율, 시간, 성적, 거리처럼 실제로 확인하려는 값을 먼저 정하세요.',
      '필드에 표시된 단위에 맞춰 값을 입력하고, 퍼센트는 도구 안내에 맞게 입력했는지 확인하세요.',
      '주요 결과와 보조 합계를 함께 읽으세요. 보조 합계는 최종 숫자가 왜 바뀌었는지 설명해 줍니다.',
      '입력값 하나만 바꿔 차이를 비교하세요. 어떤 값이 결과를 좌우하는지 가장 빨리 알 수 있습니다.',
      '중요한 작업이라면 나중에 재현할 수 있도록 입력값과 결과를 함께 기록하세요.'
    ],
    converterStep: [
      '먼저 원본 값과 원본 단위 또는 형식을 선택하세요.',
      '대상 단위나 형식을 고르고, 결과가 정확한 값인지 반올림된 값인지 확인하세요.',
      '가능하면 변환 방향을 한 번 바꿔 원래 값에 가깝게 돌아오는지 확인하세요.',
      '단위 이름, 대소문자, 접두사, 소수 자릿수를 확인한 뒤 결과를 복사하세요.',
      '코드, 디자인, 배송, 기록에 사용할 값이라면 원본 값도 함께 보관하세요.'
    ],
    imageStep: [
      '지원되는 로컬 이미지를 하나 추가하고 미리보기나 컨트롤이 나타날 때까지 기다리세요.',
      '미리보기를 보면서 자르기, 형식, 크기, 색상, 품질 설정을 조정하세요.',
      '결과 파일을 다운로드한 뒤 원본과 비교해 투명도, 선명도, 크기, 파일 용량을 확인하세요.',
      '텍스트, 가장자리, 색상이 예상보다 나쁘면 다른 설정으로 다시 시도하세요.',
      '내보낸 이미지가 필요한 페이지나 편집기에서 제대로 작동할 때까지 원본 파일을 보관하세요.'
    ],
    audioStep: [
      '지원되는 로컬 오디오 파일 하나를 추가하고 길이, 파형, 컨트롤이 나타날 때까지 기다리세요.',
      '도구가 재생 기능을 제공하면 내보내기 전에 선택 구간이나 설정을 미리 들어보세요.',
      '볼륨, 속도, 손실 변환은 먼저 적당한 값으로 바꿔 보세요.',
      '다운로드한 뒤 시작, 중간, 끝부분을 들어보고 파일을 교체하세요.',
      '다른 구간, 형식, 품질 설정이 필요할 수 있으니 원본 녹음은 보관하세요.'
    ],
    generatorStep: [
      '먼저 작은 묶음으로 생성해 분위기, 명확성, 반복을 확인하세요.',
      '긴 목록을 페이지 밖에서 검토하고 싶을 때만 일괄 다운로드를 사용하세요.',
      '좋은 후보는 직접 다듬어 최종 선택이 생성기가 아니라 프로젝트에 맞게 느껴지도록 하세요.',
      '중요한 이름, 사용자명, 비즈니스 아이디어는 공개 전에 검색해 확인하세요.',
      '무작위 생성은 같은 결과가 다시 나오지 않을 수 있으니 마음에 드는 선택은 맥락과 함께 저장하세요.'
    ],
    gameStep: [
      '화면에 보이는 설정을 읽고 짧은 라운드부터 시작하세요.',
      '결과는 오락, 연습, 가벼운 그룹 프롬프트로 사용하세요.',
      '무작위 결과가 특이하게 쉽거나 어렵게 나오면 다시 시도하세요.',
      '파티나 수업에서 사용할 때는 첫 결과가 나오기 전에 규칙을 설명하세요.',
      '결과가 압박, 불공정함, 진지한 결정을 만들 수 있다면 멈추세요.'
    ],
    beforeCalculator: ['입력하기 전에 정확한 공식이나 규칙을 확인하세요.', '단위, 날짜, 비율, 반올림을 모든 필드에서 일관되게 유지하세요.', '돈, 건강, 성적, 기록과 관련된 경우 간단한 손계산 추정과 비교하세요.'],
    beforeConverter: ['변환하기 전에 원본 단위나 형식을 확인하세요.', '가능하면 반대로 변환해 빠르게 검산하세요.', '오프셋, 제곱 계수, 이진 접두사, 지역 규칙이 필요한 단위를 주의하세요.'],
    beforeMedia: ['다운로드하기 전에 선택 구간이나 효과를 미리 확인하세요.', '편집, 보관, 재시도를 위해 원본 파일은 그대로 보관하세요.', '내보낸 뒤 클리핑, 클릭 소리, 무음, 시간 밀림, 손실 압축 흔적을 확인하세요.'],
    beforeGenerator: ['프로젝트 분위기에 맞는 후보만 추리세요.', '생성된 텍스트를 공개하기 전에 철자, 길이, 발음, 의미를 직접 다듬으세요.', '이름이 중요하다면 사용 가능성, 권리, 상표, 문화적 의미, 기존 사용 사례를 확인하세요.'],
    beforeGame: ['화면에 보이는 규칙을 가벼운 오락이나 연습용으로 사용하세요.', '무작위 결과가 지나치게 쉽거나 어렵다면 라운드를 다시 시작하세요.', '도박, 상품, 임상 검사, 중요한 결정에는 캐주얼 브라우저 게임을 사용하지 마세요.'],
    faqCalculator: {
      'They may use different rounding, input assumptions, fee handling, date counting, or formulas. Compare the assumptions before comparing the final answer.': '반올림, 입력 가정, 수수료 처리, 날짜 계산, 공식이 다를 수 있습니다. 최종 결과를 비교하기 전에 가정을 먼저 비교하세요.',
      'No. Treat it as an estimate or learning aid, then use official rules or a qualified professional for financial, tax, legal, medical, academic, or regulatory decisions.': '아니요. 추정치나 학습 보조로 보고, 금융, 세금, 법률, 의료, 학업, 규제 관련 결정에는 공식 규칙이나 자격 있는 전문가를 사용하세요.',
      'Save the inputs, units, date, and any assumptions. Those details make the number easier to check later.': '입력값, 단위, 날짜, 가정을 저장하세요. 이런 정보가 있어야 나중에 숫자를 쉽게 확인할 수 있습니다.'
    }
  }
};

const genericGuideFallbacks = {
  ko: title => `${title}와 관련된 이 항목은 입력값, 설정, 결과를 함께 확인하면서 사용하는 것이 좋습니다.`,
  ja: title => `${title}については、入力、設定、結果をあわせて確認しながら使うと安全です。`,
  'zh-CN': title => `使用${title}时，建议同时检查输入、设置和结果。`,
  es: title => `Para usar ${title}, conviene revisar juntos los datos de entrada, la configuración y el resultado.`,
  de: title => `Bei ${title} solltest du Eingaben, Einstellungen und Ergebnis gemeinsam prüfen.`,
  fr: title => `Pour utiliser ${title}, vérifiez ensemble les données saisies, les réglages et le résultat.`,
  'pt-BR': title => `Ao usar ${title}, confira os dados de entrada, as configurações e o resultado em conjunto.`
};

function localizedListItem(value, code, templates) {
  const groups = [templates.calculatorStep, templates.converterStep, templates.imageStep, templates.audioStep, templates.generatorStep, templates.gameStep, templates.beforeCalculator, templates.beforeConverter, templates.beforeMedia, templates.beforeGenerator, templates.beforeGame].filter(Boolean);
  const englishGroups = [
    ['Start with the real-world question: cost, rate, time, grade, distance, or another measurable value.', 'Enter values in the units shown by the fields, then check that percentages are entered as percentages rather than decimals unless the tool says otherwise.', 'Read both the main answer and any supporting totals. Supporting totals often explain why the final number changed.', 'Change one input and compare the difference. This is the fastest way to understand which value controls the outcome.', 'For consequential work, record the inputs along with the answer so the result can be reproduced later.'],
    ['Choose the source value and source unit or format first.', 'Select the target unit or format and check whether the output is exact, rounded, or format-dependent.', 'For reversible units, swap the direction once to see whether the result returns close to the original value.', 'Copy the converted result only after checking labels, capitalization, prefixes, and decimal places.', 'When the value will be used in code, design, travel, shipping, or records, keep the original value beside the converted one.'],
    ['Add one local image and wait for the preview or controls to appear.', 'Adjust the crop, format, size, color, or quality setting while watching the preview.', 'Download a copy, open it, and compare it with the original for transparency, sharpness, dimensions, and file size.', 'Retry with a different setting if text, edges, or colors look worse than expected.', 'Keep the original file until the exported image works in the page, editor, or upload form that needs it.'],
    ['Add one supported local audio file and wait for duration, waveform, or controls to appear.', 'Preview the selected range or setting before export whenever the tool offers playback.', 'Use moderate changes first, especially for volume, speed, or lossy conversion.', 'Download the result and listen through the beginning, middle, and ending before replacing any file.', 'Keep the original recording in case the edit needs a different boundary, format, or quality setting.'],
    ['Generate a small set first and listen for tone, clarity, and repetition.', 'Use batch download only when you want a longer list to review away from the page.', 'Edit promising results by hand so the final choice belongs to the project instead of the generator.', 'Search important names, usernames, or business ideas before publication.', 'Save the final selection with context, because random generation may not reproduce the same favorite later.'],
    ['Read the visible setup controls and start with a short round.', 'Use the result as entertainment, practice, or a lightweight group prompt.', 'Repeat when random variation produces an edge case or when the group wants another round.', 'For party or classroom use, explain the rules before the first result appears.', 'Stop when the result would create pressure, unfairness, or a decision that needs real discussion.'],
    ['Identify the exact formula or convention used before entering values.', 'Keep units, dates, rates, and rounding consistent across every field.', 'Compare the result with a simple hand estimate when money, health, grades, or records are involved.'],
    ['Confirm the source unit or format before converting.', 'Reverse the conversion when a quick sanity check is possible.', 'Watch for units that need offsets, squared factors, binary prefixes, or local conventions.'],
    ['Preview the selected range or effect before downloading.', 'Keep an untouched source file for editing, archiving, or retrying a different setting.', 'Listen for clipping, clicks, silence, timing shifts, or lossy artifacts after export.'],
    ['Generate several options and shortlist only the ones that match the project tone.', 'Edit spelling, length, pronunciation, or meaning before publishing generated text.', 'Check availability, rights, trademarks, cultural meaning, and existing usage when names matter.'],
    ['Use the visible rules as casual entertainment, practice, or a playful group prompt.', 'Restart or repeat rounds when random variation creates an unusually easy or hard result.', 'Avoid using casual browser games for gambling, prizes, clinical testing, or serious decisions.']
  ];
  for (let groupIndex = 0; groupIndex < englishGroups.length; groupIndex += 1) {
    const itemIndex = englishGroups[groupIndex].indexOf(value);
    if (itemIndex >= 0 && groups[groupIndex]?.[itemIndex]) return groups[groupIndex][itemIndex];
  }
  return null;
}

function guideFallback(value, code, config) {
  const trimmed = value.trim();
  const common = guideCommonTranslations[code]?.[trimmed];
  if (common) return common;
  const englishTitle = config.locales.en.title;
  const localizedTitle = config.locales[code]?.title || englishTitle;
  const templates = guideFallbackTemplates[code];
  if (!templates) return genericGuideFallbacks[code]?.(localizedTitle) || value;
  if (trimmed === `${englishTitle} basics`) return templates.basics(localizedTitle);
  if (trimmed.startsWith(`${englishTitle} handles one local `)) return templates.handles(localizedTitle);
  if (trimmed.startsWith(`For ${englishTitle},`)) return templates.forTool(localizedTitle);
  const listItem = localizedListItem(trimmed, code, templates);
  if (listItem) return listItem;
  if (templates.faqCalculator?.[trimmed]) return templates.faqCalculator[trimmed];
  return genericGuideFallbacks[code]?.(localizedTitle) || value;
}

function translateValue(value, translations, code = 'en', config = null) {
  if (!translatable(value)) return value;
  const trimmed = value.trim();
  const translated = translations[trimmed] || (config && code !== 'en' ? guideFallback(trimmed, code, config) : '');
  if (!translated || translated === trimmed) return value;
  const start = value.indexOf(trimmed);
  return value.slice(0, start) + translated + value.slice(start + trimmed.length);
}

function openToolLabel(code, title) {
  return {
    en: `Open ${title}`,
    ko: `${title} \uC5F4\uAE30`,
    ja: `${title}\u3092\u958B\u304F`,
    'zh-CN': `\u6253\u5F00${title}`,
    es: `Abrir ${title}`,
    de: `${title} \u00F6ffnen`,
    fr: `Ouvrir ${title}`,
    'pt-BR': `Abrir ${title}`
  }[code];
}

function localizeDocument(source, code, guideSlug, toolSlug, translations, config) {
  const document = parse(normalizeSource(source, code, guideSlug));
  const localizedUrl = code === 'en' ? `${baseUrl}/guides/${guideSlug}/` : `${baseUrl}/${code}/guides/${guideSlug}/`;
  const localizedTranslations = { ...translations };
  const englishTitle = config.locales.en.title;
  localizedTranslations[`Open ${englishTitle}`] = openToolLabel(code, config.locales[code].title);
  walk(document, (node, ancestors) => {
    if (node.tagName === 'html') setAttr(node, 'lang', code);
    if (node.nodeName === '#text' && !excludedText(ancestors) && code !== 'en') node.value = translateValue(node.value, localizedTranslations, code, config);
    if (node.tagName === 'link' && attr(node, 'rel') === 'canonical') setAttr(node, 'href', localizedUrl);
    if (node.tagName === 'meta') {
      const key = attr(node, 'name') || attr(node, 'property');
      if (['description', 'og:title', 'og:description'].includes(key) && code !== 'en') setAttr(node, 'content', translateValue(attr(node, 'content') || '', localizedTranslations, code, config));
      if (key === 'og:url') setAttr(node, 'content', localizedUrl);
    }
    if (node.tagName === 'a') {
      const href = attr(node, 'href');
      if (code !== 'en' && href === '/') setAttr(node, 'href', `/${code}/`);
      if (code !== 'en' && href === '/privacy.html') setAttr(node, 'href', `/${code}/privacy.html`);
      if (code !== 'en' && href === `/${toolSlug}/`) setAttr(node, 'href', `/${code}/${toolSlug}/`);
    }
    if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json' && node.childNodes?.[0]) {
      try {
        const data = JSON.parse(node.childNodes[0].value);
        if (code !== 'en') {
          data.headline = translateValue(data.headline, translations, code, config);
          data.description = translateValue(data.description, translations, code, config);
        }
        data.mainEntityOfPage = localizedUrl;
        data.dateModified = '2026-07-03';
        node.childNodes[0].value = JSON.stringify(data);
      } catch {}
    }
  });
  return serialize(document).replace(/v1\.2\.\d+/g, version);
}

const guideRecords = guideSlugs.map(guideSlug => {
  const file = path.join(root, 'guides', guideSlug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`Missing English guide: ${guideSlug}`);
  const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const toolLink = source.match(/class="tool-link" href="\/([^/]+)\//);
  if (!toolLink) throw new Error(`Missing tool link in guide: ${guideSlug}`);
  const config = toolI18nConfigs.find(item => item.slug === toolLink[1]);
  if (!config) throw new Error(`Missing tool locale config for guide: ${guideSlug}`);
  return { guideSlug, toolSlug: toolLink[1], source, config };
});

const allStrings = [...new Set(guideRecords.flatMap(record => [...collectStrings(normalizeSource(record.source, 'en', record.guideSlug))]))].sort();
const catalog = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, 'utf8')) : { version: 1, translations: {} };
catalog.version = 1;

const missingByLocale = Object.fromEntries(localeCodes
  .filter(item => item !== 'en')
  .map(code => [code, allStrings.filter(value => !catalog.translations[code]?.[value]).length])
  .filter(([, count]) => count > 0));

for (const record of guideRecords) {
  for (const code of localeCodes) {
    const destination = code === 'en'
      ? path.join(root, 'guides', record.guideSlug, 'index.html')
      : path.join(root, code, 'guides', record.guideSlug, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, localizeDocument(record.source, code, record.guideSlug, record.toolSlug, catalog.translations[code] || {}, record.config), 'utf8');
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\s*<!-- SFT_GUIDE_I18N_START -->[\s\S]*?<!-- SFT_GUIDE_I18N_END -->/g, '');
const guideEntries = localeCodes.filter(code => code !== 'en').flatMap(code => guideSlugs.map(guideSlug => `  <url><loc>${baseUrl}/${code}/guides/${guideSlug}/</loc><lastmod>2026-07-03</lastmod></url>`)).join('\n');
sitemap = sitemap.replace('</urlset>', `  <!-- SFT_GUIDE_I18N_START -->\n${guideEntries}\n  <!-- SFT_GUIDE_I18N_END -->\n</urlset>`);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

buildLocaleRouting(root, toolSlugs, { guideSlugs });
if (Object.keys(missingByLocale).length) {
  console.warn(`Guide translations missing for some strings; untranslated strings were kept as English: ${JSON.stringify(missingByLocale)}`);
}
console.log(`Built ${guideRecords.length * localeCodes.length} localized guide pages from ${allStrings.length} translatable strings.`);
