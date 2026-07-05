(function () {
    const presets = {
        en: {
            korean: ['Bibimbap', 'Bulgogi Bowl', 'Kimchi Stew', 'Soybean Paste Stew', 'Kimbap', 'Tteokbokki', 'Cold Noodles', 'Spicy Pork', 'Chicken Galbi', 'Soft Tofu Stew', 'Bossam', 'Japchae'],
            japanese: ['Sushi', 'Ramen', 'Udon', 'Soba', 'Katsu Curry', 'Tendon', 'Gyudon', 'Oyakodon', 'Teriyaki Chicken', 'Okonomiyaki', 'Karaage', 'Salmon Donburi'],
            chinese: ['Fried Rice', 'Mapo Tofu', 'Dumplings', 'Chow Mein', 'Sweet and Sour Pork', 'Kung Pao Chicken', 'Beef Noodle Soup', 'Hot Pot', 'Wonton Soup', 'Dan Dan Noodles', 'Xiaolongbao', 'Cantonese Roast Duck'],
            thai: ['Pad Thai', 'Thai Green Curry', 'Thai Red Curry', 'Pad Kra Pao', 'Tom Yum Soup', 'Khao Pad', 'Khao Soi', 'Massaman Curry', 'Som Tam', 'Tom Kha Gai', 'Thai Basil Chicken', 'Chicken Satay'],
            vietnamese: ['Pho', 'Banh Mi', 'Bun Cha', 'Bun Bo Hue', 'Com Tam', 'Vietnamese Spring Rolls', 'Cao Lau', 'Mi Quang', 'Banh Xeo', 'Lemongrass Chicken', 'Chicken Pho', 'Hu Tieu'],
            indian: ['Butter Chicken', 'Chicken Tikka Masala', 'Biryani', 'Palak Paneer', 'Chana Masala', 'Dal Tadka', 'Tandoori Chicken', 'Paneer Butter Masala', 'Masala Dosa', 'Aloo Gobi', 'Rogan Josh', 'Thali'],
            mexican: ['Tacos al Pastor', 'Burrito', 'Chicken Quesadilla', 'Enchiladas', 'Chilaquiles', 'Pozole', 'Carnitas Tacos', 'Fajitas', 'Tostadas', 'Tamales', 'Carne Asada', 'Taco Salad'],
            italian: ['Margherita Pizza', 'Pasta Carbonara', 'Lasagna', 'Mushroom Risotto', 'Penne Arrabbiata', 'Spaghetti Bolognese', 'Gnocchi', 'Ravioli', 'Chicken Parmigiana', 'Pesto Pasta', 'Minestrone', 'Calzone'],
            western: ['Chicken Salad', 'Club Sandwich', 'Steak Bowl', 'Fish and Chips', 'Caesar Wrap', 'Tomato Soup', 'Grilled Chicken', 'Baked Potato', 'Mac and Cheese', 'Beef Stew', 'Roast Chicken', 'Grilled Cheese'],
            fastFood: ['Cheeseburger', 'Chicken Burger', 'Fried Chicken', 'Hot Dog', 'Chicken Nuggets', 'Sub Sandwich', 'Kebab', 'Loaded Fries', 'Pizza Slice', 'Falafel Wrap', 'Fish Burger', 'Chicken Wings']
        },
        ko: {
            korean: ['비빔밥', '불고기 덮밥', '김치찌개', '된장찌개', '김밥', '떡볶이', '냉면', '제육볶음', '닭갈비', '순두부찌개', '보쌈', '잡채'],
            japanese: ['초밥', '라멘', '우동', '소바', '가츠 카레', '튀김 덮밥', '규동', '오야코동', '데리야키 치킨', '오코노미야키', '가라아게', '연어 덮밥'],
            chinese: ['볶음밥', '마파두부', '만두', '차오몐', '탕수육', '궁보계정', '우육면', '훠궈', '완탕 수프', '탄탄면', '샤오롱바오', '광둥식 오리구이'],
            thai: ['팟타이', '태국식 그린 커리', '태국식 레드 커리', '팟 끄라파오', '똠얌 수프', '카오 팟', '카오 소이', '마사만 커리', '쏨땀', '똠카가이', '태국식 바질 치킨', '치킨 사테'],
            vietnamese: ['쌀국수', '반미', '분짜', '분보후에', '껌땀', '베트남식 스프링롤', '까오러우', '미꽝', '반쎄오', '레몬그라스 치킨', '닭고기 쌀국수', '후띠우'],
            indian: ['버터 치킨', '치킨 티카 마살라', '비리야니', '팔락 파니르', '차나 마살라', '달 타드카', '탄두리 치킨', '파니르 버터 마살라', '마살라 도사', '알루 고비', '로건 조시', '탈리'],
            mexican: ['알 파스토르 타코', '부리토', '치킨 퀘사디아', '엔칠라다', '칠라킬레스', '포솔레', '카르니타스 타코', '파히타', '토스타다', '타말레', '카르네 아사다', '타코 샐러드'],
            italian: ['마르게리타 피자', '카르보나라 파스타', '라자냐', '버섯 리소토', '펜네 아라비아타', '스파게티 볼로네제', '뇨키', '라비올리', '치킨 파르미자나', '페스토 파스타', '미네스트로네', '칼초네'],
            western: ['치킨 샐러드', '클럽 샌드위치', '스테이크 덮밥', '피시 앤 칩스', '시저 랩', '토마토 수프', '구운 닭고기', '구운 감자', '맥 앤 치즈', '소고기 스튜', '로스트 치킨', '그릴드 치즈 샌드위치'],
            fastFood: ['치즈버거', '치킨버거', '프라이드치킨', '핫도그', '치킨 너겟', '서브 샌드위치', '케밥', '토핑 감자튀김', '피자 조각', '팔라펠 랩', '생선버거', '치킨 윙']
        },
        ja: {
            korean: ['ビビンバ', 'プルコギ丼', 'キムチチゲ', 'テンジャンチゲ', 'キンパ', 'トッポッキ', '冷麺', '豚肉の辛炒め', 'タッカルビ', 'スンドゥブチゲ', 'ポッサム', 'チャプチェ'],
            japanese: ['寿司', 'ラーメン', 'うどん', 'そば', 'カツカレー', '天丼', '牛丼', '親子丼', '照り焼きチキン', 'お好み焼き', '唐揚げ', 'サーモン丼'],
            chinese: ['炒飯', '麻婆豆腐', '餃子', '中華焼きそば', '酢豚', '宮保鶏丁', '牛肉麺', '火鍋', 'ワンタンスープ', '担々麺', '小籠包', '広東風ローストダック'],
            thai: ['パッタイ', 'タイグリーンカレー', 'タイレッドカレー', 'ガパオライス', 'トムヤムスープ', 'カオパット', 'カオソーイ', 'マッサマンカレー', 'ソムタム', 'トムカーガイ', 'タイバジルチキン', 'チキンサテ'],
            vietnamese: ['フォー', 'バインミー', 'ブンチャー', 'ブンボーフエ', 'コムタム', 'ベトナム春巻き', 'カオラウ', 'ミークアン', 'バインセオ', 'レモングラスチキン', '鶏肉のフォー', 'フーティウ'],
            indian: ['バターチキン', 'チキンティッカマサラ', 'ビリヤニ', 'パラクパニール', 'チャナマサラ', 'ダルタルカ', 'タンドリーチキン', 'パニールバターマサラ', 'マサラドーサ', 'アルゴビ', 'ローガンジョシュ', 'ターリー'],
            mexican: ['タコス・アル・パストール', 'ブリトー', 'チキンケサディーヤ', 'エンチラーダ', 'チラキレス', 'ポソレ', 'カルニタスタコス', 'ファヒータ', 'トスターダ', 'タマレス', 'カルネアサダ', 'タコサラダ'],
            italian: ['マルゲリータピザ', 'カルボナーラ', 'ラザニア', 'きのこリゾット', 'ペンネアラビアータ', 'ボロネーゼ', 'ニョッキ', 'ラビオリ', 'チキンパルミジャーナ', 'ペストパスタ', 'ミネストローネ', 'カルツォーネ'],
            western: ['チキンサラダ', 'クラブサンドイッチ', 'ステーキボウル', 'フィッシュ・アンド・チップス', 'シーザーラップ', 'トマトスープ', 'グリルチキン', 'ベイクドポテト', 'マカロニチーズ', 'ビーフシチュー', 'ローストチキン', 'グリルドチーズ'],
            fastFood: ['チーズバーガー', 'チキンバーガー', 'フライドチキン', 'ホットドッグ', 'チキンナゲット', 'サブサンドイッチ', 'ケバブ', 'ローデッドフライ', 'ピザスライス', 'ファラフェルラップ', 'フィッシュバーガー', 'チキンウィング']
        },
        'zh-CN': {
            korean: ['韩式拌饭', '烤牛肉盖饭', '泡菜汤', '大酱汤', '紫菜包饭', '辣炒年糕', '冷面', '辣炒猪肉', '辣炒鸡排', '嫩豆腐汤', '韩式包肉', '杂菜'],
            japanese: ['寿司', '拉面', '乌冬面', '荞麦面', '炸猪排咖喱', '天妇罗盖饭', '牛肉盖饭', '亲子盖饭', '照烧鸡肉', '大阪烧', '日式炸鸡', '三文鱼盖饭'],
            chinese: ['炒饭', '麻婆豆腐', '饺子', '炒面', '咕咾肉', '宫保鸡丁', '牛肉面', '火锅', '馄饨汤', '担担面', '小笼包', '广式烧鸭'],
            thai: ['泰式炒河粉', '泰式绿咖喱', '泰式红咖喱', '打抛饭', '冬阴功汤', '泰式炒饭', '泰北咖喱面', '马萨曼咖喱', '青木瓜沙拉', '椰奶鸡汤', '泰式罗勒鸡', '沙嗲鸡肉'],
            vietnamese: ['越南河粉', '越南法棍', '烤肉米线', '顺化牛肉粉', '碎米饭', '越南春卷', '高楼面', '广南面', '越南煎饼', '香茅鸡肉', '鸡肉河粉', '金边粿条'],
            indian: ['黄油鸡', '印度烤鸡玛萨拉', '印度香饭', '菠菜奶酪', '鹰嘴豆咖喱', '印度扁豆', '坦都里烤鸡', '黄油奶酪咖喱', '玛萨拉薄饼', '土豆花椰菜', '克什米尔羊肉咖喱', '印度拼盘'],
            mexican: ['牧羊人塔可', '墨西哥卷饼', '鸡肉芝士薄饼', '墨西哥辣酱卷', '玉米片早餐', '玉米肉汤', '慢炖猪肉塔可', '墨西哥铁板烧', '脆玉米饼', '墨西哥粽子', '烤牛肉', '塔可沙拉'],
            italian: ['玛格丽特披萨', '培根蛋面', '千层面', '蘑菇烩饭', '香辣番茄通心粉', '博洛尼亚肉酱面', '意式面疙瘩', '意式馄饨', '帕尔马鸡排', '青酱意面', '意大利蔬菜汤', '意式馅饼'],
            western: ['鸡肉沙拉', '总汇三明治', '牛排饭', '炸鱼薯条', '凯撒鸡肉卷', '番茄汤', '烤鸡肉', '烤土豆', '芝士通心粉', '炖牛肉', '烤鸡', '烤芝士三明治'],
            fastFood: ['芝士汉堡', '鸡肉汉堡', '炸鸡', '热狗', '鸡块', '潜艇三明治', '烤肉串', '浇汁薯条', '披萨片', '炸豆丸子卷', '鱼肉汉堡', '鸡翅']
        },
        es: {
            korean: ['Bibimbap', 'Bol de bulgogi', 'Estofado de kimchi', 'Estofado de pasta de soja', 'Kimbap', 'Tteokbokki', 'Fideos fríos', 'Cerdo picante', 'Pollo galbi', 'Estofado de tofu suave', 'Bossam', 'Japchae'],
            japanese: ['Sushi', 'Ramen', 'Udon', 'Soba', 'Curry con cerdo empanado', 'Tazón de tempura', 'Tazón de ternera', 'Tazón de pollo y huevo', 'Pollo teriyaki', 'Okonomiyaki', 'Pollo karaage', 'Tazón de salmón'],
            chinese: ['Arroz frito', 'Tofu mapo', 'Empanadillas', 'Fideos salteados', 'Cerdo agridulce', 'Pollo kung pao', 'Sopa de fideos con ternera', 'Olla caliente', 'Sopa wonton', 'Fideos dan dan', 'Xiaolongbao', 'Pato asado cantonés'],
            thai: ['Pad thai', 'Curry verde tailandés', 'Curry rojo tailandés', 'Pad kra pao', 'Sopa tom yum', 'Arroz frito tailandés', 'Khao soi', 'Curry massaman', 'Ensalada de papaya', 'Sopa tom kha gai', 'Pollo con albahaca tailandesa', 'Satay de pollo'],
            vietnamese: ['Pho', 'Banh mi', 'Bun cha', 'Bun bo hue', 'Arroz partido', 'Rollitos vietnamitas', 'Cao lau', 'Mi quang', 'Banh xeo', 'Pollo con hierba limón', 'Pho de pollo', 'Hu tieu'],
            indian: ['Pollo con mantequilla', 'Pollo tikka masala', 'Biryani', 'Palak paneer', 'Chana masala', 'Dal tadka', 'Pollo tandoori', 'Paneer con mantequilla', 'Masala dosa', 'Aloo gobi', 'Rogan josh', 'Thali'],
            mexican: ['Tacos al pastor', 'Burrito', 'Quesadilla de pollo', 'Enchiladas', 'Chilaquiles', 'Pozole', 'Tacos de carnitas', 'Fajitas', 'Tostadas', 'Tamales', 'Carne asada', 'Ensalada de taco'],
            italian: ['Pizza margarita', 'Pasta carbonara', 'Lasaña', 'Risotto de setas', 'Penne arrabbiata', 'Espaguetis boloñesa', 'Ñoquis', 'Raviolis', 'Pollo a la parmesana', 'Pasta al pesto', 'Minestrone', 'Calzone'],
            western: ['Ensalada de pollo', 'Sándwich club', 'Bol de filete', 'Pescado con patatas', 'Wrap César', 'Sopa de tomate', 'Pollo a la parrilla', 'Patata asada', 'Macarrones con queso', 'Estofado de ternera', 'Pollo asado', 'Sándwich de queso a la plancha'],
            fastFood: ['Hamburguesa con queso', 'Hamburguesa de pollo', 'Pollo frito', 'Perrito caliente', 'Nuggets de pollo', 'Sándwich submarino', 'Kebab', 'Patatas con cobertura', 'Porción de pizza', 'Wrap de falafel', 'Hamburguesa de pescado', 'Alitas de pollo']
        },
        de: {
            korean: ['Bibimbap', 'Bulgogi-Schale', 'Kimchi-Eintopf', 'Sojabohnenpasten-Eintopf', 'Kimbap', 'Tteokbokki', 'Kalte Nudeln', 'Scharfes Schweinefleisch', 'Hähnchen-Galbi', 'Weicher Tofu-Eintopf', 'Bossam', 'Japchae'],
            japanese: ['Sushi', 'Ramen', 'Udon', 'Soba', 'Schnitzel-Curry', 'Tempura-Schale', 'Rindfleisch-Schale', 'Hähnchen-Ei-Schale', 'Teriyaki-Hähnchen', 'Okonomiyaki', 'Karaage', 'Lachs-Schale'],
            chinese: ['Gebratener Reis', 'Mapo-Tofu', 'Teigtaschen', 'Gebratene Nudeln', 'Süß-saures Schweinefleisch', 'Kung-Pao-Hähnchen', 'Rindfleisch-Nudelsuppe', 'Feuertopf', 'Wonton-Suppe', 'Dan-Dan-Nudeln', 'Xiaolongbao', 'Kantonesische Ente'],
            thai: ['Pad Thai', 'Thailändisches grünes Curry', 'Thailändisches rotes Curry', 'Pad Kra Pao', 'Tom-Yum-Suppe', 'Thailändischer Bratreis', 'Khao Soi', 'Massaman-Curry', 'Papayasalat', 'Tom Kha Gai', 'Thai-Basilikum-Hähnchen', 'Hähnchen-Satay'],
            vietnamese: ['Pho', 'Banh Mi', 'Bun Cha', 'Bun Bo Hue', 'Bruchreis', 'Vietnamesische Frühlingsrollen', 'Cao Lau', 'Mi Quang', 'Banh Xeo', 'Zitronengras-Hähnchen', 'Hähnchen-Pho', 'Hu Tieu'],
            indian: ['Butterhähnchen', 'Hähnchen Tikka Masala', 'Biryani', 'Palak Paneer', 'Chana Masala', 'Dal Tadka', 'Tandoori-Hähnchen', 'Paneer Butter Masala', 'Masala Dosa', 'Aloo Gobi', 'Rogan Josh', 'Thali'],
            mexican: ['Tacos al Pastor', 'Burrito', 'Hähnchen-Quesadilla', 'Enchiladas', 'Chilaquiles', 'Pozole', 'Carnitas-Tacos', 'Fajitas', 'Tostadas', 'Tamales', 'Carne Asada', 'Taco-Salat'],
            italian: ['Pizza Margherita', 'Pasta Carbonara', 'Lasagne', 'Pilzrisotto', 'Penne Arrabbiata', 'Spaghetti Bolognese', 'Gnocchi', 'Ravioli', 'Hähnchen Parmigiana', 'Pesto-Pasta', 'Minestrone', 'Calzone'],
            western: ['Hähnchensalat', 'Club-Sandwich', 'Steak-Schale', 'Fish and Chips', 'Caesar-Wrap', 'Tomatensuppe', 'Gegrilltes Hähnchen', 'Ofenkartoffel', 'Käsemakkaroni', 'Rindereintopf', 'Brathähnchen', 'Gegrilltes Käsebrot'],
            fastFood: ['Cheeseburger', 'Hähnchenburger', 'Frittiertes Hähnchen', 'Hotdog', 'Hähnchen-Nuggets', 'Sub-Sandwich', 'Kebab', 'Belegte Pommes', 'Pizzastück', 'Falafel-Wrap', 'Fischburger', 'Hähnchenflügel']
        },
        fr: {
            korean: ['Bibimbap', 'Bol de bulgogi', 'Ragoût de kimchi', 'Ragoût à la pâte de soja', 'Kimbap', 'Tteokbokki', 'Nouilles froides', 'Porc épicé', 'Poulet galbi', 'Ragoût de tofu soyeux', 'Bossam', 'Japchae'],
            japanese: ['Sushis', 'Ramen', 'Udon', 'Soba', 'Curry au porc pané', 'Bol de tempura', 'Bol de bœuf', 'Bol de poulet et œuf', 'Poulet teriyaki', 'Okonomiyaki', 'Poulet karaage', 'Bol de saumon'],
            chinese: ['Riz frit', 'Tofu mapo', 'Raviolis chinois', 'Nouilles sautées', 'Porc aigre-doux', 'Poulet kung-pao', 'Soupe de nouilles au bœuf', 'Fondue chinoise', 'Soupe wonton', 'Nouilles dan dan', 'Xiaolongbao', 'Canard rôti cantonais'],
            thai: ['Pad thaï', 'Curry vert thaï', 'Curry rouge thaï', 'Pad kra pao', 'Soupe tom yum', 'Riz frit thaï', 'Khao soi', 'Curry massaman', 'Salade de papaye', 'Soupe tom kha gai', 'Poulet au basilic thaï', 'Satay de poulet'],
            vietnamese: ['Pho', 'Banh mi', 'Bun cha', 'Bun bo hue', 'Riz brisé', 'Rouleaux vietnamiens', 'Cao lau', 'Mi quang', 'Banh xeo', 'Poulet à la citronnelle', 'Pho au poulet', 'Hu tieu'],
            indian: ['Poulet au beurre', 'Poulet tikka masala', 'Biryani', 'Palak paneer', 'Chana masala', 'Dal tadka', 'Poulet tandoori', 'Paneer au beurre', 'Masala dosa', 'Aloo gobi', 'Rogan josh', 'Thali'],
            mexican: ['Tacos al pastor', 'Burrito', 'Quesadilla au poulet', 'Enchiladas', 'Chilaquiles', 'Pozole', 'Tacos de carnitas', 'Fajitas', 'Tostadas', 'Tamales', 'Carne asada', 'Salade taco'],
            italian: ['Pizza margherita', 'Pâtes carbonara', 'Lasagnes', 'Risotto aux champignons', 'Penne arrabbiata', 'Spaghettis bolognaise', 'Gnocchis', 'Raviolis', 'Poulet parmigiana', 'Pâtes au pesto', 'Minestrone', 'Calzone'],
            western: ['Salade de poulet', 'Club sandwich', 'Bol de steak', 'Poisson-frites', 'Wrap César', 'Soupe de tomate', 'Poulet grillé', 'Pomme de terre au four', 'Macaronis au fromage', 'Ragoût de bœuf', 'Poulet rôti', 'Croque au fromage'],
            fastFood: ['Cheeseburger', 'Burger au poulet', 'Poulet frit', 'Hot-dog', 'Nuggets de poulet', 'Sandwich sous-marin', 'Kebab', 'Frites garnies', 'Part de pizza', 'Wrap de falafel', 'Burger au poisson', 'Ailes de poulet']
        },
        'pt-BR': {
            korean: ['Bibimbap', 'Tigela de bulgogi', 'Ensopado de kimchi', 'Ensopado de pasta de soja', 'Kimbap', 'Tteokbokki', 'Macarrão frio', 'Porco apimentado', 'Frango galbi', 'Ensopado de tofu macio', 'Bossam', 'Japchae'],
            japanese: ['Sushi', 'Lámen', 'Udon', 'Soba', 'Curry com porco empanado', 'Tigela de tempurá', 'Tigela de carne', 'Tigela de frango e ovo', 'Frango teriyaki', 'Okonomiyaki', 'Frango karaage', 'Tigela de salmão'],
            chinese: ['Arroz frito', 'Tofu mapo', 'Guioza', 'Macarrão salteado', 'Porco agridoce', 'Frango kung pao', 'Sopa de macarrão com carne', 'Hot pot', 'Sopa wonton', 'Macarrão dan dan', 'Xiaolongbao', 'Pato assado cantonês'],
            thai: ['Pad thai', 'Curry verde tailandês', 'Curry vermelho tailandês', 'Pad kra pao', 'Sopa tom yum', 'Arroz frito tailandês', 'Khao soi', 'Curry massaman', 'Salada de mamão', 'Sopa tom kha gai', 'Frango com manjericão tailandês', 'Satay de frango'],
            vietnamese: ['Pho', 'Banh mi', 'Bun cha', 'Bun bo hue', 'Arroz quebrado', 'Rolinhos vietnamitas', 'Cao lau', 'Mi quang', 'Banh xeo', 'Frango com capim-limão', 'Pho de frango', 'Hu tieu'],
            indian: ['Frango com manteiga', 'Frango tikka masala', 'Biryani', 'Palak paneer', 'Chana masala', 'Dal tadka', 'Frango tandoori', 'Paneer com manteiga', 'Masala dosa', 'Aloo gobi', 'Rogan josh', 'Thali'],
            mexican: ['Tacos al pastor', 'Burrito', 'Quesadilla de frango', 'Enchiladas', 'Chilaquiles', 'Pozole', 'Tacos de carnitas', 'Fajitas', 'Tostadas', 'Tamales', 'Carne assada', 'Salada de taco'],
            italian: ['Pizza margherita', 'Massa carbonara', 'Lasanha', 'Risoto de cogumelos', 'Penne arrabbiata', 'Espaguete à bolonhesa', 'Nhoque', 'Ravióli', 'Frango à parmegiana', 'Massa ao pesto', 'Minestrone', 'Calzone'],
            western: ['Salada de frango', 'Sanduíche club', 'Tigela de bife', 'Peixe com batatas', 'Wrap César', 'Sopa de tomate', 'Frango grelhado', 'Batata assada', 'Macarrão com queijo', 'Ensopado de carne', 'Frango assado', 'Sanduíche de queijo grelhado'],
            fastFood: ['Hambúrguer com queijo', 'Hambúrguer de frango', 'Frango frito', 'Cachorro-quente', 'Nuggets de frango', 'Sanduíche submarino', 'Kebab', 'Batatas com cobertura', 'Fatia de pizza', 'Wrap de falafel', 'Hambúrguer de peixe', 'Asas de frango']
        }
    };

    const categories = ['korean', 'japanese', 'chinese', 'thai', 'vietnamese', 'indian', 'mexican', 'italian', 'western', 'fastFood'];
    const additions = window.SFT_LUNCH_ADDITIONS || {};
    const photoSlugLists = window.SFT_LUNCH_PHOTO_SLUGS || {};
    const photoLookups = {};

    Object.entries(presets).forEach(([localeName, locale]) => {
        categories.forEach(category => {
            locale[category].push(...(additions[localeName]?.[category] || []));
        });
        locale.mixed = Array.from({ length: 5 }, (_, index) => categories.map(category => locale[category][index])).flat();
        photoLookups[localeName] = {};
        categories.forEach(category => {
            locale[category].forEach((name, index) => {
                const photoSlug = photoSlugLists[category]?.[index];
                if (photoSlug) photoLookups[localeName][name] = photoSlug;
            });
        });
    });

    window.SFT_LUNCH_PRESETS = presets;
    window.SFT_LUNCH_PHOTOS = photoLookups;
})();
