import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = path.resolve(import.meta.dirname);
const photoDir = path.join(root, 'lunch-photos');
const headers = { 'User-Agent': 'SuperFastToolFoodPhotoBuilder/1.0 (https://superfasttool.com)' };
const cuisines = {
    korean: 'Korean',
    japanese: 'Japanese',
    chinese: 'Chinese',
    thai: 'Thai',
    vietnamese: 'Vietnamese',
    indian: 'Indian',
    mexican: 'Mexican',
    italian: 'Italian',
    western: 'Western',
    fastFood: 'fast food'
};
const stopWords = new Set(['a', 'al', 'and', 'au', 'con', 'de', 'del', 'e', 'et', 'la', 'le', 'of', 'the', 'with']);
const rejectedFiles = new Set([
    'File:Biang biang noodle f lol agin Japan Apr 16 2021 05-25PM.jpeg',
    'File:Miami Crispy, Burnage, Manchester, UK.jpg',
    'File:Huey Magoos, Valdosta.jpg',
    'File:20140809-0067 Diamond Jamboree.JPG',
    'File:Saraga International Grocery - November 2023 - Sarah Stierch 03.jpg',
    'File:Nichirei food vending machine 02 in Japan.jpg',
    'File:Fast Food Kebab (ul. Władysława IV, Gdynia) - 002.JPG',
    'File:Wine tasting - Enoteca - Feb 2019 - Stierch 09.jpg',
    'File:HK SSP 深水埗 Sham Shui Po 元州街 133 Un Chau Street 龍鳳大廈 Lung Fung Building 越式越好味 Pho Lotus Vietnamese Cuisine Restaurant food June 2021 SS2 05.jpg',
    'File:PikiWiki Israel 1281 Eating in Ramat Hasharon דוכן שוארמה ברמת השרון.jpg',
    'File:Burgerwalaa Uttara Inside Preview.jpg',
    'File:Codex Mendoza 68r Aztec foods.jpg',
    'File:Japanese fast food (2504856314).jpg',
    'File:20170801-OSEC-PJK-0468 TONED.jpg',
    'File:Biangbiangmian.png',
    'File:Classic Club Sandwich with Leafy Green Salad, Jamaica Blue Carousel, 2025 (01).jpg',
    'File:拉芝士絲拉得好長的芝士條.jpg',
    'File:Vietnamské široké rýžové nudle bánh phở 01.JPG'
]);
const queryAliases = {
    'Bulgogi Bowl': ['bulgogi rice'],
    'Soybean Paste Stew': ['doenjang jjigae'],
    'Cold Noodles': ['naengmyeon'],
    'Karaage': ['Japanese fried chicken karaage'],
    'Salmon Donburi': ['salmon don'],
    'Chirashi Sushi': ['chirashizushi'],
    'Onigiri Set': ['onigiri plate'],
    'Miso Soup Set': ['miso soup meal'],
    'Hambagu Steak': ['Japanese hamburg steak'],
    'Tomato Egg Rice': ['Chinese tomato egg rice'],
    'Scallion Pancakes': ['cong you bing'],
    'Biang Biang Noodles': ['biangbiang noodles'],
    'Chinese BBQ Skewers': ['chuanr', 'yang rou chuan'],
    'Thai Omelet Rice': ['khai jiao rice', 'khai chiao'],
    'Garlic Pork Rice': ['Thai garlic pork rice'],
    'Moo Ping': ['Thai grilled pork skewers'],
    'Roti with Curry': ['Thai roti curry'],
    'Bun Mang Vit': ['bún măng vịt', 'Vietnamese duck bamboo noodle soup'],
    'Grilled Pork Rice': ['com thit nuong'],
    'Caramelized Pork': ['Vietnamese thit kho'],
    'Lemongrass Beef': ['Vietnamese bo xao sa'],
    'Pork Chop Rice': ['com suon'],
    'Vegetarian Pho': ['vegan pho'],
    'Beef Vermicelli Salad': ['bun bo nam bo', 'Vietnamese beef noodle salad'],
    'Steamed Rice Rolls': ['banh cuon'],
    'Lamb Vindaloo': ['vindaloo curry'],
    'Chicken Saag': ['saag chicken', 'saag murgh'],
    'Kathi Roll': ['kati roll'],
    'Chicken Biryani': ['chicken biryani dish'],
    'Elote Bowl': ['esquites', 'Mexican corn cup'],
    'Caprese Panini': ['caprese sandwich'],
    'Four Cheese Pizza': ['quattro formaggi pizza'],
    'Prosciutto Pizza': ['pizza prosciutto'],
    'Chicken Pot Pie': ['chicken pie'],
    "Shepherd's Pie": ['shepherd pie'],
    'Tuna Melt': ['tuna melt sandwich'],
    'BBQ Ribs': ['barbecue ribs plate'],
    'Mashed Potato Bowl': ['mashed potatoes gravy bowl'],
    'BLT Sandwich': ['bacon lettuce tomato sandwich'],
    'Chicken Burger': ['chicken sandwich burger'],
    'Sub Sandwich': ['submarine sandwich'],
    'Loaded Fries': ['cheese loaded fries'],
    'Falafel Wrap': ['falafel sandwich wrap'],
    'Spicy Chicken Burger': ['spicy chicken sandwich'],
    'Chicken Tenders': ['chicken fingers plate'],
    'Doner Wrap': ['döner kebab wrap'],
    'Shawarma': ['shawarma plate'],
    'Burrito Combo': ['burrito plate with chips'],
    'Pepperoni Pizza Slice': ['pepperoni pizza slice'],
    'Sausage Pizza Slice': ['sausage pizza slice'],
    'Fried Fish Basket': ['fish and chips basket', 'fried fish plate'],
    'Fried Shrimp Basket': ['fried shrimp plate', 'fried prawns basket']
};
const forcedFiles = {
    'Chinese BBQ Skewers': 'File:Chinese chuan sticks.jpg',
    'Bun Mang Vit': 'File:Bún măng thịt vịt.jpg',
    'Chicken Saag': 'File:Chicken Spinach curry (4465754837).jpg',
    'Mashed Potato Bowl': 'File:KFC mashed potato.jpg',
    'Beef Chili': 'File:Bacon, ground beef, and bean chili.jpg',
    'Biang Biang Noodles': 'File:Biang Biang noodles, May 2019.jpg',
    'Club Sandwich': 'File:Turkey club sandwich and potato chips - Cambridge, MA.jpg',
    'Mozzarella Sticks': "File:2017-10-04 21 22 22 Mozzarella sticks with marinara sauce at the Applebee's on Virginia State Route 7 (Harry Byrd Highway) in Countryside, Loudoun County, Virginia.jpg",
    'Pho': 'File:Beef noodle soup (Phở bò) - Pho Hanoi Authentic 2024-12-01.jpg'
};
const finalizeOnly = process.argv.includes('--finalize');

global.window = {};
await import('./lunch-picker-food-additions.js');
await import('./lunch-picker-foods.js');

const categories = Object.keys(cuisines);
const english = window.SFT_LUNCH_PRESETS.en;
const dishes = categories.flatMap(category => english[category].map((dish, index) => ({ category, index, dish })));

function cleanHtml(value = '') {
    return value.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalize(value = '') {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokens(value) {
    return normalize(value).split(' ').filter(token => token.length > 1 && !stopWords.has(token));
}

function slugify(value) {
    return normalize(value).replace(/\s+/g, '-');
}

async function fetchWithRetry(url, options = {}) {
    for (let attempt = 0; attempt < 6; attempt += 1) {
        const response = await fetch(url, options);
        if (response.status !== 429 && response.status < 500) return response;
        await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
    return fetch(url, options);
}

function candidateScore(dish, cuisine, page, aliases = []) {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl || !/^image\/(jpeg|png|webp)$/i.test(info.mime || '')) return -1;
    if (rejectedFiles.has(page.title)) return -1;
    const metadata = info.extmetadata || {};
    const text = normalize([
        page.title,
        cleanHtml(metadata.ObjectName?.value),
        cleanHtml(metadata.ImageDescription?.value),
        cleanHtml(metadata.Categories?.value)
    ].join(' '));
    if (/logo|menu board|packaging|poster|drawing|illustration|icon/.test(text)) return -1;
    const searchNames = [dish, ...aliases];
    const nameScores = searchNames.map(name => {
        const dishTokens = tokens(name);
        const matched = dishTokens.filter(token => text.includes(token)).length;
        const ratio = dishTokens.length ? matched / dishTokens.length : 0;
        const exact = text.includes(normalize(name)) ? 0.35 : 0;
        return ratio + exact;
    });
    const nameScore = Math.max(...nameScores);
    const cuisineBonus = text.includes(normalize(cuisine)) ? 0.12 : 0;
    return nameScore + cuisineBonus;
}

async function findPhoto(item) {
    const aliases = queryAliases[item.dish] || [];
    if (forcedFiles[item.dish]) {
        const params = new URLSearchParams({
            action: 'query',
            titles: forcedFiles[item.dish],
            prop: 'imageinfo',
            iiprop: 'url|mime|extmetadata',
            iiurlwidth: '256',
            format: 'json',
            origin: '*'
        });
        const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${params}`, { headers });
        if (!response.ok) throw new Error(`Commons API ${response.status}`);
        const data = await response.json();
        const page = Object.values(data.query?.pages || {})[0];
        if (page?.imageinfo?.[0]?.thumburl) return { page, score: 2 };
    }
    const searchNames = [item.dish, ...aliases];
    let best = null;
    for (const name of searchNames) {
        for (const query of [`"${name}"`, `${name} plated food`]) {
            const params = new URLSearchParams({
                action: 'query',
                generator: 'search',
                gsrsearch: query,
                gsrnamespace: '6',
                gsrlimit: '10',
                prop: 'imageinfo',
                iiprop: 'url|mime|extmetadata',
                iiurlwidth: '256',
                format: 'json',
                origin: '*'
            });
            const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${params}`, { headers });
            if (!response.ok) throw new Error(`Commons API ${response.status}`);
            const data = await response.json();
            const pages = Object.values(data.query?.pages || {});
            const ranked = pages.map(page => ({ page, score: candidateScore(item.dish, cuisines[item.category], page, aliases) })).sort((a, b) => b.score - a.score);
            if (ranked[0] && (!best || ranked[0].score > best.score)) best = ranked[0];
            if (best?.score >= 1.1) return best;
        }
    }
    return best?.score >= 0.62 ? best : null;
}

async function downloadPhoto(item, match) {
    const slug = slugify(item.dish);
    const destination = path.join(photoDir, `${slug}.webp`);
    const info = match.page.imageinfo[0];
    const response = await fetchWithRetry(info.thumburl, { headers });
    if (!response.ok) throw new Error(`Thumbnail ${response.status}`);
    const input = Buffer.from(await response.arrayBuffer());
    await sharp(input)
        .rotate()
        .resize(96, 96, { fit: 'cover', position: 'centre' })
        .webp({ quality: 66, alphaQuality: 88, effort: 6 })
        .toFile(destination);
    const metadata = info.extmetadata || {};
    return {
        slug,
        dish: item.dish,
        category: item.category,
        file: match.page.title,
        page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(match.page.title.replaceAll(' ', '_'))}`,
        author: cleanHtml(metadata.Artist?.value) || 'See source page',
        license: cleanHtml(metadata.LicenseShortName?.value) || cleanHtml(metadata.UsageTerms?.value) || 'See source page',
        licenseUrl: metadata.LicenseUrl?.value || '',
        score: Number(match.score.toFixed(2))
    };
}

fs.mkdirSync(photoDir, { recursive: true });
const mapping = Object.fromEntries(categories.map(category => [category, Array(english[category].length).fill(null)]));
const creditsPath = path.join(photoDir, 'credits.json');
const existingCredits = fs.existsSync(creditsPath) ? JSON.parse(fs.readFileSync(creditsPath, 'utf8')).photos || [] : [];
const credits = existingCredits.filter(photo => !rejectedFiles.has(photo.file) && fs.existsSync(path.join(photoDir, `${photo.slug}.webp`)));
credits.forEach(photo => {
    const index = english[photo.category]?.indexOf(photo.dish) ?? -1;
    if (index >= 0) mapping[photo.category][index] = photo.slug;
});
const pendingDishes = finalizeOnly ? [] : dishes.filter(item => !mapping[item.category][item.index]);
let cursor = 0;

async function worker() {
    while (cursor < pendingDishes.length) {
        const item = pendingDishes[cursor++];
        try {
            const match = await findPhoto(item);
            if (match) {
                const credit = await downloadPhoto(item, match);
                mapping[item.category][item.index] = credit.slug;
                credits.push(credit);
            }
        } catch (error) {
            console.error(`Skipped ${item.dish}: ${error.message}`);
        }
        if (cursor % 20 === 0) console.log(`Checked ${Math.min(cursor, pendingDishes.length)} / ${pendingDishes.length}`);
        await new Promise(resolve => setTimeout(resolve, 550));
    }
}

console.log(`Resuming with ${credits.length} photos; checking ${pendingDishes.length} dishes.`);
await worker();
credits.sort((a, b) => a.dish.localeCompare(b.dish));

const mapSource = `(function () {\n    window.SFT_LUNCH_PHOTO_SLUGS = ${JSON.stringify(mapping, null, 4)};\n})();\n`;
fs.writeFileSync(path.join(root, 'lunch-picker-photo-map.js'), mapSource);
fs.writeFileSync(creditsPath, `${JSON.stringify({ source: 'Wikimedia Commons', generated: new Date().toISOString(), photos: credits }, null, 2)}\n`);

const rows = credits.map(photo => `<tr><td>${photo.dish}</td><td><a href="${photo.page}">${photo.file.replace(/^File:/, '')}</a></td><td>${photo.author}</td><td>${photo.licenseUrl ? `<a href="${photo.licenseUrl}">${photo.license}</a>` : photo.license}</td></tr>`).join('');
const creditsHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lunch Picker Photo Credits</title><style>body{font:14px/1.5 Arial,sans-serif;max-width:1100px;margin:40px auto;padding:0 20px;color:#27272a}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #e4e4e7;text-align:left}a{color:#c2410c}</style></head><body><h1>Lunch Picker Photo Credits</h1><p>Food photographs are sourced from Wikimedia Commons. Each item retains its source, author and license information below.</p><table><thead><tr><th>Menu item</th><th>Source</th><th>Author</th><th>License</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
fs.writeFileSync(path.join(photoDir, 'credits.html'), creditsHtml);

const activeSlugs = new Set(credits.map(photo => photo.slug));
fs.readdirSync(photoDir).filter(file => file.endsWith('.webp')).forEach(file => {
    if (!activeSlugs.has(file.slice(0, -5))) fs.unlinkSync(path.join(photoDir, file));
});
const bytes = fs.readdirSync(photoDir).filter(file => file.endsWith('.webp')).reduce((sum, file) => sum + fs.statSync(path.join(photoDir, file)).size, 0);
console.log(`Saved ${credits.length} matched photos (${(bytes / 1024 / 1024).toFixed(2)} MB).`);
