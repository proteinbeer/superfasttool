import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const version = 'v1.2.334';
const today = '2026-06-24';

const posts = [
  {
    slug: 'browser-based-file-converters',
    title: 'Browser-Based File Converters: Why Local Processing Matters',
    description: 'A quick look at why browser-based converters are useful for small everyday file tasks, privacy, and fast previews.',
    icon: '🧰',
    toolHref: '/image-cropper/',
    toolLabel: 'Open Image Tools',
    sections: [
      ['Why this matters', 'Many quick file tasks do not need a heavy desktop app or an upload queue. When a converter runs in the browser, the user can preview a result, change one setting, and download a copy without leaving the page. That makes browser tools useful for screenshots, short clips, small audio edits, simple text conversion, and everyday cleanup work.'],
      ['Local-first is the useful part', 'A local-first workflow means the browser does as much work as possible on the device. This can reduce waiting time and avoids sending ordinary working files to a separate app just to make a small change. It is still smart to keep the original file until the output has been opened and checked.'],
      ['Where browser tools have limits', 'Large videos, unusual codecs, damaged files, and memory-heavy operations can still fail or run slowly. A professional editor is better for long projects, batch work, color grading, layered audio, or exact export control. The sweet spot is quick, focused work where speed matters more than a full production timeline.']
    ]
  },
  {
    slug: 'png-jpg-webp-format-choice',
    title: 'PNG, JPG, and WebP: Choosing the Right Image Format',
    description: 'A practical guide to choosing image formats for screenshots, photos, transparency, and smaller web files.',
    icon: '🖼️',
    toolHref: '/png-to-jpg-converter/',
    toolLabel: 'Open Image Converter',
    sections: [
      ['The simple rule', 'Use PNG when transparency, sharp edges, or screenshots matter. Use JPG when a photo needs broad compatibility and small size. Use WebP when modern web delivery is the target and the audience uses current browsers.'],
      ['Why the choice changes quality', 'PNG is lossless for many common image workflows, so it can preserve sharp text and flat graphics well. JPG is lossy and can create artifacts around text or hard edges, but it is often much smaller for photographs. WebP can be efficient, but some older apps still prefer PNG or JPG.'],
      ['A practical workflow', 'Start from the original file, export a copy, then compare file size and visual quality side by side. If the image has transparency, check the background after conversion. If the image has text, zoom in before publishing.']
    ]
  },
  {
    slug: 'video-to-gif-file-size',
    title: 'Video to GIF Workflows: Keeping Files Small',
    description: 'A light workflow note about trimming video clips, choosing dimensions, and avoiding oversized GIF downloads.',
    icon: '🎞️',
    toolHref: '/video-to-gif-converter/',
    toolLabel: 'Open Video to GIF',
    sections: [
      ['Shorter is usually better', 'GIF files can become large quickly because they are not as efficient as modern video formats. A short clip, smaller width, and practical frame rate usually matter more than any single quality setting.'],
      ['Trim before converting', 'Choose only the part that needs to loop. Removing quiet lead-in frames and unnecessary ending frames can reduce size while making the animation feel tighter. For social posts or documentation, a focused action is easier to understand than a long recording.'],
      ['Check motion and text', 'Low frame rates reduce file size but can make motion feel choppy. Smaller dimensions save space but can make interface text unreadable. The best setting depends on what the viewer needs to notice.']
    ]
  },
  {
    slug: 'audio-trimming-browser-workflow',
    title: 'Audio Trimming in the Browser: Quick Edits Without an App',
    description: 'A simple workflow for cutting short audio clips in the browser while keeping the original file safe.',
    icon: '✂️',
    toolHref: '/audio-trimmer/',
    toolLabel: 'Open Audio Trimmer',
    sections: [
      ['Good for small cuts', 'Browser audio trimming is useful for cutting a voice memo, isolating a short sound effect, or removing empty space from the start and end of a clip. It keeps the task focused: load, select, preview, download.'],
      ['Use the waveform', 'A waveform makes it easier to find silence, speech starts, loud peaks, and natural break points. Cutting directly through a loud waveform can create a click, so it is usually better to trim near a quieter boundary.'],
      ['Keep a clean original', 'The downloaded file should be treated as a new copy. Keep the original recording until the edited version has been opened in the app or platform where it will actually be used.']
    ]
  },
  {
    slug: 'password-generator-safer-logins',
    title: 'Password Generators and Safer Everyday Logins',
    description: 'A short note on why long unique passwords matter and how password generators fit into a safer login workflow.',
    icon: '🔐',
    toolHref: '/password-generator/',
    toolLabel: 'Open Password Generator',
    sections: [
      ['Uniqueness beats cleverness', 'A password that is reused across websites is risky even if it feels clever. If one service leaks it, attackers can try it elsewhere. A generator helps create a different password for each account.'],
      ['Length does heavy work', 'Long random passwords are usually stronger than short complex-looking passwords. Symbols can help, but length and unpredictability are the foundation. A password manager makes long unique passwords practical.'],
      ['A generator is one part', 'A generated password still needs safe storage, careful use, and protection against phishing. Multi-factor authentication adds another layer when a service supports it.']
    ]
  },
  {
    slug: 'timestamp-conversion-data-review',
    title: 'Timestamp Conversion for Developers and Data Review',
    description: 'A quick explanation of why timestamp conversion is useful for logs, subtitles, data checks, and AI review work.',
    icon: '⏱️',
    toolHref: '/timestamp-converter/',
    toolLabel: 'Open Timestamp Converter',
    sections: [
      ['Why timestamps appear everywhere', 'Timestamps show up in logs, exported datasets, subtitles, analytics, moderation queues, and system records. Converting them into readable dates can make a row of data much easier to inspect.'],
      ['Seconds or milliseconds', 'A 10-digit Unix timestamp is usually seconds, while a 13-digit value is often milliseconds. Mixing those two is a common reason dates appear far in the past or future.'],
      ['Time zones matter', 'Unix time is based on UTC, but humans often read dates in local time. A timestamp converter should make that difference clear so the same moment is not confused with a different local calendar time.']
    ]
  },
  {
    slug: 'color-formats-web-design',
    title: 'Color Formats for Web Design: HEX, RGB, HSL, and Alpha',
    description: 'A practical note on common web color formats and why designers and developers often convert between them.',
    icon: '🎨',
    toolHref: '/color-converter-picker/',
    toolLabel: 'Open Color Converter',
    sections: [
      ['Different names, same color', 'HEX, RGB, and HSL can describe the same color in different ways. Developers often use HEX for compact CSS values, RGB when alpha is needed, and HSL when adjusting hue, saturation, or lightness feels more natural.'],
      ['Alpha is transparency', 'RGBA and HSLA include an alpha value that controls opacity. It does not make the color itself lighter; it changes how much of the background shows through. That is why the same transparent color can look different on different backgrounds.'],
      ['Use conversion for handoff', 'Color conversion is useful when moving between design tools, CSS frameworks, documentation, and quick prototypes. Always check contrast when the color is used for text or important controls.']
    ]
  },
  {
    slug: 'random-name-generators-creative-projects',
    title: 'Random Name Generators for Games and Creative Projects',
    description: 'A light note on using random name generators for fantasy worlds, sci-fi projects, usernames, and prototypes.',
    icon: '🎲',
    toolHref: '/fantasy-person-name-generator/',
    toolLabel: 'Open Name Generator',
    sections: [
      ['Random is a starting point', 'A name generator is best used as a spark, not a final authority. Generate several options, save the strongest ones, then edit rhythm, spelling, and tone until the name fits the world.'],
      ['Different projects need different rules', 'Fantasy people, fantasy places, sci-fi people, sci-fi locations, usernames, and business names all have different expectations. A place name can be longer and stranger than a username, while a business name needs to be clearer and easier to say.'],
      ['Avoid accidental repetition', 'When a generator produces many names, scan for repeated syllables and similar endings. Small edits can make a list feel more intentional while keeping the speed advantage of random generation.']
    ]
  },
  {
    slug: 'quick-unit-conversion-tips',
    title: 'Quick Unit Conversion Tips for Everyday Work',
    description: 'A short note on avoiding common mistakes when converting length, weight, temperature, storage, and speed.',
    icon: '🔁',
    toolHref: '/unit-converter/',
    toolLabel: 'Open Unit Converter',
    sections: [
      ['Check the unit family first', 'Length, weight, temperature, area, volume, storage, and speed do not all convert the same way. Temperature needs offsets, area squares linear factors, and storage labels can use decimal or binary conventions.'],
      ['Round at the end', 'Rounding too early can create small but annoying differences. Keep extra precision while comparing values, then round the final answer to the number of decimals needed for the task.'],
      ['Reverse the conversion', 'A quick sanity check is to convert the answer back to the original unit. If the value does not return close to the starting point, the selected unit or input may be wrong.']
    ]
  },
  {
    slug: 'lightweight-browser-games-breaks',
    title: 'Lightweight Browser Games as Small Break Tools',
    description: 'A quick note on why tiny browser games can fit naturally beside utility tools when they load fast and stay simple.',
    icon: '⚔️',
    toolHref: '/memory-card-game/',
    toolLabel: 'Open Memory Game',
    sections: [
      ['Small games can still be useful', 'A short browser game can be a quick reset between tasks. If it loads instantly, works on mobile, and does not require an account, it behaves more like a tiny break tool than a full gaming platform.'],
      ['Keep the loop clear', 'The best small games have an obvious action, quick feedback, and a simple restart. Memory games, reaction tests, choice games, and short platformers work well because the player understands the goal immediately.'],
      ['Performance matters', 'A lightweight game should not make the rest of the site feel heavy. Small assets, simple logic, and browser-native rendering help keep the experience fast.']
    ]
  }
];

const newsItems = [
  {
    slug: 'canva-ai-2-agentic-editing-workflows',
    title: 'Canva AI 2.0 Introduces Layered Editing and Agentic Creative Workflows',
    description: 'Canva AI 2.0 combines conversational design, editable layered output, persistent memory, connectors, scheduling, web research, and new AI-assisted creation workflows.',
    dateDisplay: 'June 27, 2026',
    datePublished: '2026-06-27',
    icon: '&#128240;',
    toolHref: '/image-cropper/',
    toolLabel: 'Open Image Tools',
    sections: [
      ['What Canva announced', 'Canva introduced Canva AI 2.0 as a research preview on April 16, 2026. The company describes it as a conversational and agentic layer across its Visual Suite, designed to move from an idea to editable creative work without treating every prompt as a separate one-off generation.'],
      ['Editable output instead of one flat image', 'Canva says its layered object intelligence builds generated designs from individual editable objects. That means a user can ask to replace an image, revise a headline, or adjust another element without regenerating the entire design. This distinction matters for practical work because a draft remains open to direct human editing.'],
      ['Automation and connected context', 'The preview also includes connectors, scheduling, web research, brand intelligence, Sheets AI, Canva Code 2.0, and a Memory Library. Canva says connectors can bring context from services such as Gmail, Google Drive, Slack, Notion, Zoom, and Microsoft tools, while scheduling can run recurring creative tasks in the background. Availability may vary while preview features roll out.'],
      ['What it means for focused tools', 'Canva is bringing generation, editing, research, data, and automation into one large workspace. Small browser utilities still solve a different problem: completing a clearly defined crop, conversion, resize, calculation, or export with minimal setup. The useful dividing line is whether the task needs a connected creative workflow or one immediate, verifiable result.']
    ],
    sources: [
      ['Canva Newsroom: Introducing Canva AI 2.0', 'https://www.canva.com/newsroom/news/canva-create-2026-ai/'],
      ['Fortune: Canva unveils its agentic design suite', 'https://fortune.com/2026/04/16/canva-ai-agentic-design-suite-coo-cliff-obrecht/']
    ]
  },
  {
    slug: 'firefox-152-redesigned-settings',
    title: 'Firefox 152 Redesigns Settings for Faster Navigation and Clearer Controls',
    description: 'Firefox 152 reorganizes browser settings into clearer sections while adding easier navigation and retaining existing user preferences.',
    dateDisplay: 'June 27, 2026',
    datePublished: '2026-06-27',
    icon: '&#128240;',
    toolHref: '/password-generator/',
    toolLabel: 'Open Browser Tools',
    sections: [
      ['What changed in Firefox 152', 'Mozilla released Firefox 152 on June 16, 2026 with a redesigned Settings experience. The update uses a cleaner layout, clearer labels, revised navigation, and more specific categories intended to make browser controls easier to locate and understand.'],
      ['The General page has been reorganized', 'Options that previously lived under the broad General page now appear in focused areas such as Appearance, Accessibility, Languages, and Tabs and browsing. Mozilla says existing preferences remain unchanged, and the Settings search bar can still locate controls that have moved.'],
      ['The release includes more than a visual update', 'Firefox 152 release notes also list experimental JPEG XL support, an address-bar action that can mute audio across browser windows, and a temporary option to relax tracker blocking for a Private Browsing tab when a site breaks. These are separate controls within the same release rather than parts of the Settings redesign itself.'],
      ['Why settings design matters', 'Browser utilities depend on users being able to understand permissions, downloads, privacy controls, and file behavior. A better organized settings interface does not change what a tool calculates or converts, but it can make the surrounding browser workflow easier to inspect and control.']
    ],
    sources: [
      ['Mozilla Blog: Firefox is easier than ever to customize', 'https://blog.mozilla.org/en/firefox/firefox-settings/'],
      ['Firefox 152 release notes', 'https://www.firefox.com/en-US/firefox/152.0/releasenotes/']
    ]
  },
  {
    slug: 'lightroom-generate-video-from-photos',
    title: 'Lightroom Adds AI Video Generation From Edited Photos',
    description: 'Adobe Lightroom can now turn an edited photo into a short AI-generated video using Firefly Video or supported Google Veo models.',
    dateDisplay: 'June 26, 2026',
    datePublished: '2026-06-26',
    icon: '&#128240;',
    toolHref: '/video-to-gif-converter/',
    toolLabel: 'Open Video Tools',
    sections: [
      ['What Lightroom added', 'Adobe added Generate Video to Lightroom as part of its June 2026 Creative Cloud updates. The feature applies AI-generated motion to an edited photo and produces a short video or reel without requiring the image to be exported to a separate application first.'],
      ['Models and controls', 'Adobe documentation lists Firefly Video, Google Veo 3.1, and Google Veo 3.1 Fast as model choices. Users can select an aspect ratio, resolution, and duration, then describe the intended motion with a prompt or start from presets such as Slow pan, Subtle motion, or Hyperlapse.'],
      ['Generation uses credits', 'Generate Video uses Adobe generative credits, and credit use can differ when partner models are selected. The generated result can be grouped with the original photo in a stack when cloud-based stacking is available. Users should check the current plan and credit terms before relying on the feature for repeated production work.'],
      ['Where lightweight video tools fit', 'AI photo animation creates new motion, while a converter or trimmer works with media the user already has. These are different jobs. Browser tools remain practical for cutting a clip, converting a format, extracting audio, or making a GIF after the source video has been created.']
    ],
    sources: [
      ['Adobe Lightroom Help: Generate videos from images', 'https://helpx.adobe.com/lightroom-cc/using/generate-videos-from-images.html'],
      ['Adobe Blog: June 2026 Creative Cloud innovations', 'https://blog.adobe.com/en/publish/2026/06/15/from-culling-to-compositing-new-creative-cloud-innovations-across-every-stage-of-your-workflow'],
      ['Digital Camera World: Lightroom Generate Video overview', 'https://www.digitalcameraworld.com/photography/photo-editing/lightroom-has-just-gained-the-ability-to-turn-photos-into-videos-but-its-the-first-adobe-made-tool-to-use-generative-credits-inside-lightroom']
    ]
  },
  {
    slug: 'aurora-tool-using-agent-video-editing-research',
    title: 'Aurora Research Explores Tool-Using AI Agents for Video Editing',
    description: 'The Aurora research framework uses a vision-language agent to turn incomplete video-editing requests into structured plans for a unified video diffusion model.',
    dateDisplay: 'June 26, 2026',
    datePublished: '2026-06-26',
    icon: '&#128240;',
    toolHref: '/video-trimmer/',
    toolLabel: 'Open Video Tools',
    sections: [
      ['What Aurora is', 'Aurora is a research framework described in a preprint first submitted in May 2026, not a general-purpose consumer editor. It pairs a tool-augmented vision-language model agent with a unified video diffusion transformer to plan and perform several kinds of video edits.'],
      ['The problem it is designed to address', 'A video model may need precise text instructions, reference images, masks, or spatial grounding, while an ordinary request often leaves those details out. Aurora uses its agent to interpret the raw request, select or prepare supporting inputs, and map the request into a structured edit plan aligned with the video model.'],
      ['How the researchers evaluated it', 'The authors introduced AgentEdit-Bench to test editing requests with missing textual or visual details. They report that Aurora improved results over instruction-only baselines on that benchmark and on two existing video-editing benchmarks, and that the agent could also transfer to compatible frozen editing models. These are reported research results rather than independent product testing.'],
      ['Why this direction matters', 'The paper illustrates a shift from asking one model to infer every missing detail toward using an agent to organize tools and inputs before generation. For everyday browser utilities, the comparable lesson is simpler: automation is most useful when its steps and output remain understandable enough for the user to verify.']
    ],
    sources: [
      ['arXiv: Aurora: Unified Video Editing with a Tool-Using Agent', 'https://arxiv.org/abs/2605.18748'],
      ['Aurora project page', 'https://yeates.github.io/Aurora-Page/']
    ]
  },
  {
    slug: 'adobe-firefly-elements-projects-consistent-ai-assets',
    title: 'Adobe Firefly Adds Reusable Elements and Projects for More Consistent AI Creations',
    description: 'Adobe is redesigning Firefly around reusable characters, objects, locations, and organized project context to make AI-assisted creative work more consistent.',
    dateDisplay: 'June 24, 2026',
    datePublished: '2026-06-24',
    icon: '&#128240;',
    toolHref: '/image-cropper/',
    toolLabel: 'Open Image Tools',
    sections: [
      ['What Adobe is changing', 'Adobe has introduced a redesigned Firefly AI studio in private beta. Its new Elements feature lets creators save reference-based characters, objects, and locations, assign names to them, and reuse them in later generations. Projects keeps generated assets and creative context together so work can continue without rebuilding the same setup each time.'],
      ['Why reusable elements matter', 'Generative image and video tools can produce a strong result once but struggle to repeat the same character, environment, or visual identity in another scene. Reusable elements target that problem directly. They can reduce repeated prompt writing and make storyboards, campaigns, product concepts, and short-form video sequences easier to keep visually connected.'],
      ['More than image generation', 'The updated Firefly assistant can also create brand-kit concepts such as logos and color palettes, assemble clips with Quick Cut, help create storyboards, and turn image-based ideas into short-form video. Adobe is positioning the assistant as a workflow partner while keeping manual editing available in Firefly and Creative Cloud applications.'],
      ['What this means for focused browser tools', 'Large creative platforms are combining generation, organization, and editing in one workspace. Focused browser tools still serve a different need: making one crop, conversion, resize, compression, or format change quickly. As AI suites become broader, small tools remain useful when their result is immediate, understandable, and easy to verify.']
    ],
    sources: [
      ['The Verge', 'https://www.theverge.com/tech/952104/adobe-firefly-ai-agent-elements-projects-update'],
      ['Creative Bloq', 'https://www.creativebloq.com/ai/adobe-solves-one-of-ais-most-maddening-problems-amongst-a-ton-of-other-announcements']
    ]
  },
  {
    slug: 'davinci-resolve-21-photo-page-ai-tools',
    title: 'DaVinci Resolve 21 Expands Into Photo Editing With a New Generation of AI Tools',
    description: 'DaVinci Resolve 21 adds a dedicated Photo page alongside AI tools for media search, focus adjustment, sharpening, motion deblur, speech generation, and more.',
    dateDisplay: 'June 24, 2026',
    datePublished: '2026-06-24',
    icon: '&#128240;',
    toolHref: '/video-trimmer/',
    toolLabel: 'Open Video Tools',
    sections: [
      ['What is new in Resolve 21', 'Blackmagic Design says DaVinci Resolve 21 introduces a dedicated Photo page that connects still-image management with the software’s node-based color workflow. The release also adds AI-assisted tools across media organization, image correction, speech generation, face processing, focus control, and metadata handling.'],
      ['Finding media with IntelliSearch', 'AI IntelliSearch analyzes project media and lets editors search for people, faces, objects, scenes, or words spoken in dialogue. The same plain-language search can be used across photo albums. This is designed to reduce manual tagging and shorten the time spent finding a specific shot or image in a large library.'],
      ['Repair and focus tools', 'AI CineFocus can redefine the focal area and simulate depth-of-field adjustments, while AI UltraSharpen is intended to improve soft or upscaled footage. AI Motion Deblur analyzes source media to reduce streaking and softness caused by motion. These tools can help with imperfect material, although important footage still needs visual review after processing.'],
      ['Photo, video, and audio in one workspace', 'The Photo page supports original-resolution cropping, node-based grading, albums, LightBox review, effects, and cloud collaboration. Resolve 21 also adds an AI Speech Generator, improved Fairlight track organization, Lottie support, vertical social-media resolutions, and expanded export workflows. The update shows professional editors moving toward a single workspace for multiple media types.'],
      ['Where quick browser tools still fit', 'Resolve is designed for complete productions and detailed control. A browser tool is better suited to a small task such as trimming one clip, extracting audio, making a GIF, or converting a format. The two approaches are complementary: use a focused utility for speed and a full editor when the project needs timelines, grading, effects, collaboration, or precise delivery settings.']
    ],
    sources: [
      ['Blackmagic Design: What’s New in DaVinci Resolve 21', 'https://www.blackmagicdesign.com/products/davinciresolve/whatsnew'],
      ['TechRadar review', 'https://www.techradar.com/pro/software-services/davinci-resolve-studio-21-video-editing-software-review']
    ]
  },
  {
    slug: 'adobe-ai-assistants-photoshop-premiere',
    title: 'Adobe Adds AI Assistants to Photoshop and Premiere: What It Means for Quick Browser Tools',
    description: 'Adobe has started rolling out AI assistants across major Creative Cloud apps, showing how routine image and video tasks are becoming more automated.',
    dateDisplay: 'June 23, 2026',
    datePublished: '2026-06-23',
    icon: '&#128240;',
    toolHref: '/video-to-gif-converter/',
    toolLabel: 'Open Video Tools',
    sections: [
      ['What happened', 'Adobe has started rolling out AI assistants for major Creative Cloud apps including Photoshop, Premiere, Illustrator, InDesign, and Frame.io as part of a public beta. Reports describe these assistants as app-specific helpers that use natural language prompts to organize work and automate routine editing tasks.'],
      ['Why it matters for everyday tools', 'The update points to a broader shift: people want less manual clicking for repetitive creative work. In professional apps, that means timeline organization, layer cleanup, background changes, asset naming, and guided multi-step actions. In lightweight browser tools, the same desire appears as quick crop, convert, trim, resize, compress, and calculate actions that should finish without a long setup.'],
      ['Professional automation vs quick browser tasks', 'Adobe tools are built for deep creative projects with layers, timelines, brand systems, and production workflows. A browser utility is different. It is most useful when the task is small, clear, and immediate: convert one image, trim one audio clip, check a timestamp, make a short GIF, or calculate one result. Both approaches reduce friction, but they serve different moments.'],
      ['What to watch next', 'If major creative apps keep adding assistants, users may expect simpler controls everywhere else too. Small tools can stay useful by being fast, transparent, and focused. The best quick tools do not need to imitate a full editor; they need to make one small job feel almost effortless.']
    ],
    sources: [
      ['The Verge', 'https://www.theverge.com/tech/952099/adobe-ai-assistants-photoshop-premiere-illustrator-beta-launch'],
      ['Digital Camera World', 'https://www.digitalcameraworld.com/photography/photo-editing/ai-can-now-handle-the-boring-parts-of-photo-and-video-editing-for-you-as-adobes-ai-assistant-officially-arrives-inside-photoshop-and-premiere']
    ]
  }
];

const esc = value => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function renderPost(post) {
  const canonical = `https://superfasttool.com/blog/${post.slug}/`;
  const sections = post.sections.map(([heading, body]) => `<section><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join('\n');
  const socialImage = post.heroImage
    ? `<meta property="og:image" content="${esc(post.heroImage)}"><meta property="og:image:width" content="960"><meta property="og:image:height" content="540"><meta property="og:image:alt" content="${esc(post.heroAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(post.title)}"><meta name="twitter:description" content="${esc(post.description)}"><meta name="twitter:image" content="${esc(post.heroImage)}">`
    : '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: today,
    dateModified: today,
    author: { '@type': 'Organization', name: 'Super Fast Tool', url: 'https://superfasttool.com/' },
    ...(post.heroImage ? { image: [post.heroImage] } : {}),
    mainEntityOfPage: canonical
  };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="google-site-verification" content="8d_Vnu3iaxG7ZllKTxo-UgBmCC2CyfzN9JuvQCTdqK8"><title>${esc(post.title)} | Super Fast Tool</title><meta name="description" content="${esc(post.description)}"><link rel="canonical" href="${canonical}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(post.title)}"><meta property="og:description" content="${esc(post.description)}"><meta property="og:url" content="${canonical}">${socialImage}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4400508127713059" crossorigin="anonymous"></script>
<style>*{box-sizing:border-box}body{margin:0;color:#27272a;background-color:#fafafa;background-image:linear-gradient(#e4e4e7 1px,transparent 1px),linear-gradient(90deg,#e4e4e7 1px,transparent 1px);background-size:32px 32px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75}header{background:rgba(255,255,255,.94);border-bottom:1px solid #e4e4e7}.header-inner,main,footer{width:min(920px,calc(100% - 32px));margin:auto}.header-inner{min-height:74px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{font-size:19px;font-weight:900;color:#18181b;text-decoration:none;display:flex;align-items:center;gap:8px}.logo-bolt,.logo-letter,.logo-word,.logo-sub-letter,.guide-wave-emoji{display:inline-block;transform-origin:center}.logo-text{position:relative;display:inline-block;overflow:hidden;vertical-align:bottom}.logo-word+.logo-word{margin-left:.28em}.logo-sub-name{color:#a1a1aa;white-space:nowrap}.logo-text:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(249,115,22,.06) 22%,rgba(250,204,21,.28) 48%,rgba(249,115,22,.06) 74%,transparent 100%);mix-blend-mode:multiply;transform:translateX(-120%) skewX(-16deg);pointer-events:none}body.logo-cycle .logo-bolt{animation:boltFlash 4.2s ease-in-out 1}body.logo-cycle .logo-text:after{animation:logoElectricWave 4.2s ease-in-out 1}body.logo-cycle .logo-letter{animation:logoLetterShock 4.2s ease-in-out 1}body.logo-cycle .logo-sub-letter{animation:logoSubShock 4.2s ease-in-out 1}.emoji-wave-pop{animation:emojiWavePop .48s cubic-bezier(.2,.85,.25,1.25) 1}.translate-control{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:6px;border:1px solid #e4e4e7;border-radius:16px;background:rgba(244,244,245,.9);box-shadow:inset 0 1px 2px rgba(24,24,27,.06)}.lang-toggle{position:relative;width:40px;height:20px;padding:2px;border:0;border-radius:999px;background:#18181b;cursor:pointer}.toggle-handle{display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transform:translateX(20px);transition:transform .2s ease}.lang-toggle.is-off{background:#d4d4d8}.lang-toggle.is-off .toggle-handle{transform:translateX(0)}.translate-icon{display:flex;align-items:center;padding:2px}.translate-icon img{display:block;width:20px;height:20px;object-fit:contain}.translate-control.is-loading{opacity:.5;pointer-events:none}.tool-link{display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font-weight:800;border-radius:8px;background:#18181b;color:#fff;padding:11px 16px;margin:6px 0 14px}.tool-link:hover{background:#3f3f46}main{padding:44px 0}.article{background:#fff;border:1px solid #e4e4e7;border-radius:8px;padding:clamp(24px,5vw,54px);box-shadow:0 12px 36px rgba(24,24,27,.07)}.article-icon{display:flex;width:48px;height:48px;align-items:center;justify-content:center;margin-bottom:18px;border:1px solid #ffedd5;border-radius:8px;background:#fff7ed;font-size:24px}.article-hero{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;margin:20px 0 22px;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa}.eyebrow{color:#ea580c;font-size:12px;font-weight:900;text-transform:uppercase}h1{font-size:clamp(30px,5vw,52px);line-height:1.08;margin:8px 0 18px;letter-spacing:0}h2{font-size:23px;line-height:1.25;margin:34px 0 10px}p{margin:0 0 14px;color:#52525b}a{color:#c2410c}.note{background:#fff7ed;border-left:4px solid #f97316;padding:15px 17px;margin:24px 0;color:#44403c}footer{padding:0 0 42px;color:#71717a;font-size:12px;text-align:center}.version{margin-top:8px;color:#a1a1aa}@keyframes boltFlash{0%,78%,100%{color:inherit;filter:none;transform:translateY(0) rotate(0) scale(1)}81%{color:#f97316;filter:drop-shadow(0 0 8px rgba(249,115,22,.75));transform:translateY(-3px) rotate(-12deg) scale(1.3)}84%{color:#facc15;filter:drop-shadow(0 0 13px rgba(250,204,21,.9));transform:translateY(1px) rotate(10deg) scale(1.12)}87%{color:#fb923c;filter:drop-shadow(0 0 9px rgba(251,146,60,.72));transform:translateY(0) rotate(0) scale(1.18)}}@keyframes logoElectricWave{0%,82%,100%{transform:translateX(-120%) skewX(-16deg);opacity:0}86%{opacity:1}94%{transform:translateX(120%) skewX(-16deg);opacity:0}}@keyframes logoLetterShock{0%,82%,100%{color:inherit;text-shadow:none;transform:translateY(0)}86%{color:#27272a;text-shadow:0 0 5px rgba(249,115,22,.22);transform:translateY(-1px)}90%{color:#18181b;text-shadow:0 0 6px rgba(250,204,21,.24);transform:translateY(1px)}94%{color:inherit;text-shadow:none;transform:translateY(0)}}@keyframes logoSubShock{0%,82%,100%{color:#a1a1aa;text-shadow:none;transform:translateY(0)}86%{color:#71717a;text-shadow:0 0 4px rgba(249,115,22,.18);transform:translateY(-1px)}90%{color:#52525b;text-shadow:0 0 5px rgba(250,204,21,.2);transform:translateY(1px)}94%{color:#a1a1aa;text-shadow:none;transform:translateY(0)}}@keyframes emojiWavePop{0%,100%{transform:translateY(0) scale(1) rotate(0);filter:none}18%{transform:translateY(-2px) scale(1.08) rotate(-7deg);filter:drop-shadow(0 2px 4px rgba(249,115,22,.14))}38%{transform:translateY(1px) scale(1.04) rotate(6deg);filter:drop-shadow(0 1px 3px rgba(250,204,21,.12))}58%{transform:translateY(-1px) scale(1.06) rotate(-4deg);filter:drop-shadow(0 2px 4px rgba(249,115,22,.12))}78%{transform:translateY(0) scale(1.02) rotate(3deg);filter:none}}@media(max-width:600px){.header-inner{min-height:64px}.brand{font-size:16px}.logo-sub-name{font-size:12px}main{padding:22px 0}.article{padding:24px 20px}h1{font-size:32px}h2{font-size:20px}}</style>
<style>body.page-fade-out{pointer-events:none}.page-fade-layer{position:fixed;inset:0;z-index:9999;background:#fff;pointer-events:none;opacity:0;transition:opacity .04s ease}body.app-loading .page-fade-layer,body.page-fade-out .page-fade-layer,body.history-fade-ready .page-fade-layer{opacity:1}body.history-fade-revealing .page-fade-layer{transition-duration:.04s}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script></head>
<body class="app-loading"><div id="pageFadeLayer" class="page-fade-layer" aria-hidden="true"></div><header><div class="header-inner"><a class="brand" href="/"><span class="logo-bolt">&#9889;</span><span class="logo-text" aria-label="Super Fast Tool"><span class="logo-word" aria-hidden="true"><span class="logo-letter">S</span><span class="logo-letter">u</span><span class="logo-letter">p</span><span class="logo-letter">e</span><span class="logo-letter">r</span></span><span class="logo-word" aria-hidden="true"><span class="logo-letter">F</span><span class="logo-letter">a</span><span class="logo-letter">s</span><span class="logo-letter">t</span></span><span class="logo-word" aria-hidden="true"><span class="logo-letter">T</span><span class="logo-letter">o</span><span class="logo-letter">o</span><span class="logo-letter">l</span></span></span><span class="logo-sub-name" aria-label="Tool Notes"><span class="logo-sub-letter">-</span><span class="logo-sub-letter">&nbsp;</span><span class="logo-sub-letter">T</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">l</span><span class="logo-sub-letter">&nbsp;</span><span class="logo-sub-letter">N</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">t</span><span class="logo-sub-letter">e</span><span class="logo-sub-letter">s</span></span></a><div class="translate-control"><button class="lang-toggle" type="button" aria-label="Toggle translation"><span class="toggle-handle"></span></button><div class="translate-icon"><img class="guide-wave-emoji" src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/12/Google-translate-logo-design-clipart-PNG.png" alt="Translate"></div></div></div></header>
<main><article class="article"><div class="article-icon" aria-hidden="true"><span class="guide-wave-emoji">${post.icon}</span></div><div class="eyebrow">Tool notes</div><h1>${esc(post.title)}</h1><p>${esc(post.description)} This short article connects the topic to practical browser-based tools and everyday workflows.</p><a class="tool-link" href="${post.toolHref}"><span class="guide-wave-emoji" aria-hidden="true">&#9889;</span>${esc(post.toolLabel)}</a>
${sections}
<div class="note">This article is general information for everyday tool use, not professional advice. Always check important files, calculations, and published work before relying on them.</div>
<section><h2>Related tool</h2><p>Try the related Super Fast Tool page when you want to apply the idea immediately.</p><a class="tool-link" href="${post.toolHref}"><span class="guide-wave-emoji" aria-hidden="true">&#9889;</span>${esc(post.toolLabel)}</a></section></article></main>
<footer><a href="/">All Tools</a> | <a href="/privacy.html">Privacy</a><p class="version">${version}</p></footer><script>(()=>{const control=document.querySelector('.translate-control');const toggle=document.querySelector('.lang-toggle');const nodes=Array.from(document.querySelectorAll('.article h1,.article h2,.article p,.article .eyebrow')).filter(node=>!node.querySelector('a,strong,code,span'));const originals=nodes.map(node=>node.textContent);let translations=[];let translated=true;const language=(navigator.language||'en').split('-')[0];async function fetchText(text){if(language==='en'||!text.trim())return text;const url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl='+encodeURIComponent(language)+'&dt=t&q='+encodeURIComponent(text);try{const response=await fetch(url);const data=await response.json();return data[0].map(part=>part[0]).join('')}catch{return text}}async function translate(){if(language==='en')return;control.classList.add('is-loading');translations=await Promise.all(originals.map(fetchText));nodes.forEach((node,index)=>node.textContent=translations[index]||originals[index]);control.classList.remove('is-loading')}toggle.addEventListener('click',async()=>{if(control.classList.contains('is-loading'))return;if(translated){nodes.forEach((node,index)=>node.textContent=originals[index]);toggle.classList.add('is-off');translated=false}else{if(!translations.length)await translate();else nodes.forEach((node,index)=>node.textContent=translations[index]||originals[index]);toggle.classList.remove('is-off');translated=true}});translate()})();</script><script>(()=>{const animationMs=4200;let waveEnd=0;const visible=element=>element&&element.offsetParent!==null;function configure(){let delay=0;document.querySelectorAll('.logo-word').forEach(word=>{word.querySelectorAll('.logo-letter').forEach(letter=>{letter.style.animationDelay=delay.toFixed(3)+'s';delay+=.035});delay+=.16});waveEnd=Math.max(delay-.16,0);const subStart=waveEnd+.22;document.querySelectorAll('.logo-sub-letter').forEach((letter,index)=>letter.style.animationDelay=(subStart+index*.025).toFixed(3)+'s')}function emojiWave(){const icons=Array.from(document.querySelectorAll('.guide-wave-emoji')).filter(visible);let delay=0;icons.forEach(icon=>{setTimeout(()=>{icon.classList.remove('emoji-wave-pop');void icon.offsetWidth;icon.classList.add('emoji-wave-pop');setTimeout(()=>icon.classList.remove('emoji-wave-pop'),540)},delay);delay+=76});return delay+540}function cycle(){document.body.classList.remove('logo-cycle');void document.body.offsetWidth;document.body.classList.add('logo-cycle');const letters=Array.from(document.querySelectorAll('.logo-letter,.logo-sub-letter')).filter(visible);const maxDelay=letters.reduce((max,letter)=>Math.max(max,parseFloat(getComputedStyle(letter).animationDelay)||0),waveEnd);setTimeout(()=>{document.body.classList.remove('logo-cycle');const duration=emojiWave();setTimeout(cycle,duration+4000)},Math.ceil(maxDelay*1000+animationMs+500))}configure();cycle()})();</script><script>(()=>{function preparePageForHistoryRestore(){document.body.classList.remove("page-fade-out","history-fade-revealing");document.body.classList.add("history-fade-ready")}function revealPageAfterHistoryRestore(event){document.body.classList.remove("page-fade-out");const entry=performance.getEntriesByType("navigation")[0];const prepared=document.body.classList.contains("history-fade-ready");if(!(event.persisted||entry?.type==="back_forward"||prepared)||!prepared){document.body.classList.remove("history-fade-ready","history-fade-revealing");return}document.body.classList.add("history-fade-revealing");const layer=document.getElementById("pageFadeLayer");if(layer)void layer.offsetWidth;requestAnimationFrame(()=>requestAnimationFrame(()=>{document.body.classList.remove("history-fade-ready");setTimeout(()=>document.body.classList.remove("history-fade-revealing"),80)}))}if(performance.getEntriesByType("navigation")[0]?.type==="back_forward")document.body.classList.add("history-fade-ready");window.addEventListener("pagehide",preparePageForHistoryRestore);window.addEventListener("pageshow",revealPageAfterHistoryRestore);document.addEventListener("click",event=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const link=event.target.closest("a[href]");if(!link||link.target||link.hasAttribute("download"))return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.href===location.href||url.hash&&url.pathname===location.pathname)return;event.preventDefault();document.body.classList.add("page-fade-out");setTimeout(()=>location.assign(url.href),40)});requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.remove("app-loading")))})();</script></body></html>`;
}

function renderNews(item) {
  const canonical = `https://superfasttool.com/news/${item.slug}/`;
  const heroImage = 'https://superfasttool.com/assets/news/tool-news-abstract.webp';
  const heroAlt = 'Abstract browser image and video editing workflow';
  const sections = item.sections.map(([heading, body]) => `<section><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`).join('\n');
  const sources = item.sources.map(([label, href]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('');
  const toolLink = `<a class="tool-link" href="${item.toolHref}"><span class="guide-wave-emoji" aria-hidden="true">&#9889;</span>${esc(item.toolLabel)}</a>`;
  return renderPost({
    ...item,
    slug: item.slug,
    description: item.description,
    icon: item.icon,
    heroImage,
    heroAlt,
    sections: []
  })
    .replace(/https:\/\/superfasttool\.com\/blog\/[^/]+\//g, canonical)
    .replace(/\/blog\/[^/]+\//g, `/news/${item.slug}/`)
    .replace('"@type":"Article"', '"@type":"NewsArticle"')
    .replace(`datePublished":"${today}"`, `datePublished":"${item.datePublished}"`)
    .replace(`dateModified":"${today}"`, `dateModified":"${item.datePublished}"`)
    .replace('<span class="logo-sub-letter">T</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">l</span><span class="logo-sub-letter">&nbsp;</span><span class="logo-sub-letter">N</span><span class="logo-sub-letter">o</span><span class="logo-sub-letter">t</span><span class="logo-sub-letter">e</span><span class="logo-sub-letter">s</span>', '<span class="logo-sub-letter">N</span><span class="logo-sub-letter">e</span><span class="logo-sub-letter">w</span><span class="logo-sub-letter">s</span>')
    .replace('aria-label="Tool Notes"', 'aria-label="News"')
    .replace('.eyebrow{color:#ea580c;font-size:12px;font-weight:900;text-transform:uppercase}', '.eyebrow{color:#ea580c;font-size:12px;font-weight:900;text-transform:uppercase}.article-date{margin:0 0 8px;color:#a1a1aa;font-size:12px;font-weight:800;letter-spacing:.02em}')
    .replace(`<div class="eyebrow">Tool notes</div><h1>${esc(item.title)}</h1>`, `<div class="eyebrow">Tool news</div><p class="article-date">${esc(item.dateDisplay)}</p><h1>${esc(item.title)}</h1>`)
    .replace(`${esc(item.description)} This short article connects the topic to practical browser-based tools and everyday workflows.</p>`, `${esc(item.description)} This short news note connects the update to lightweight browser-based utility workflows.</p><img class="article-hero" src="/assets/news/tool-news-abstract.webp" width="960" height="540" alt="${esc(heroAlt)}" decoding="async">`)
    .replace(`${toolLink}\n\n<div class="note">`, `${sections}\n<section><h2>Further reading</h2><ul>${sources}</ul></section>\n<div class="note">`);
}

for (const post of posts) {
  const dir = path.join(root, 'blog', post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPost(post));
}

for (const item of newsItems) {
  const dir = path.join(root, 'news', item.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderNews(item));
}

const latest = [
  ...newsItems.map(item => ({ title: item.title, href: `/news/${item.slug}/`, type: 'NEWS', icon: '&#128240;', className: 'is-news' })),
  ...posts.map(post => ({ title: post.title, href: `/blog/${post.slug}/`, type: 'NOTE', icon: '&#128221;', className: 'is-note' }))
].slice(0, 10);
const tickerLinks = [...latest, ...latest].map((item, index) => {
  const hidden = index >= latest.length ? ' aria-hidden="true" tabindex="-1"' : '';
  return `                    <a class="guide-ticker-link ${item.className}" href="${item.href}"${hidden}><span class="ticker-type">${item.type}</span><span class="ticker-icon" aria-hidden="true">${item.icon}</span><span class="ticker-title">${esc(item.title)}</span></a>`;
}).join('\n');

const indexFile = path.join(root, 'index.html');
let index = fs.readFileSync(indexFile, 'utf8');
index = index.replace(/(<div class="guide-ticker-track">\r?\n)[\s\S]*?(\r?\n\s*<\/div>\r?\n\s*<\/div>)/, `$1${tickerLinks}$2`);
fs.writeFileSync(indexFile, index);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const existingLocations = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
const entries = posts
  .map(post => `https://superfasttool.com/blog/${post.slug}/`)
  .concat(newsItems.map(item => `https://superfasttool.com/news/${item.slug}/`))
  .filter(url => !existingLocations.has(url))
  .map(url => `  <url><loc>${url}</loc></url>`)
  .join('\n');
if (entries) sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`);
fs.writeFileSync(sitemapFile, sitemap);

console.log(`Prepared ${posts.length} tool note posts, ${newsItems.length} news posts, and updated the hub ticker.`);
