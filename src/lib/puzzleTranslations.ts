// Puzzle question template translations for language-independent puzzles
// Only math, patterns, visual, spatial, and some trivia/logic puzzles are translated
// Word puzzles, cipher puzzles, and English-wordplay logic puzzles are NOT translated

export type PuzzleLang = "en" | "hu" | "la" | "el" | "zh";

const templates: Record<string, Record<PuzzleLang, string>> = {
  // Math
  "what_is": { en: "What is", hu: "Mennyi", la: "Quantum est", el: "Πόσο είναι", zh: "计算" },
  "fill_blank": { en: "Fill in the blank:", hu: "Töltsd ki az üres helyet:", la: "Imple vacuum:", el: "Συμπλήρωσε το κενό:", zh: "填空：" },
  "what_is_pct_of": { en: "What is {pct}% of {base}?", hu: "Mennyi a {base} {pct}%-a?", la: "Quantum est {pct}% de {base}?", el: "Πόσο είναι το {pct}% του {base};", zh: "{base}的{pct}%是多少？" },
  "what_is_sqrt": { en: "What is √{n}?", hu: "Mennyi √{n}?", la: "Quantum est √{n}?", el: "Πόσο είναι √{n};", zh: "√{n}等于多少？" },
  "what_is_power": { en: "What is {base}^{exp}?", hu: "Mennyi {base}^{exp}?", la: "Quantum est {base}^{exp}?", el: "Πόσο είναι {base}^{exp};", zh: "{base}的{exp}次方是多少？" },
  "fraction_add": { en: "What is {a}/{b} + {c}/{d}? (answer as fraction like 3/4)", hu: "Mennyi {a}/{b} + {c}/{d}? (válaszolj törtben pl. 3/4)", la: "Quantum est {a}/{b} + {c}/{d}? (fractione responde)", el: "Πόσο είναι {a}/{b} + {c}/{d}; (απάντηση ως κλάσμα)", zh: "{a}/{b} + {c}/{d} 等于多少？(用分数回答)" },
  "remainder": { en: "What is the remainder when {a} is divided by {b}?", hu: "Mennyi a maradék ha {a}-t elosztjuk {b}-vel?", la: "Quantum residuum {a} divisum per {b}?", el: "Ποιο είναι το υπόλοιπο όταν το {a} διαιρεθεί με {b};", zh: "{a}除以{b}的余数是多少？" },
  "solve_x": { en: "Solve for x:", hu: "Oldd meg x-re:", la: "Solve pro x:", el: "Λύσε για x:", zh: "求x：" },
  "larger_root": { en: "What is the larger root?", hu: "Melyik a nagyobb gyök?", la: "Quae est radix maior?", el: "Ποια είναι η μεγαλύτερη ρίζα;", zh: "较大的根是多少？" },
  "log_base": { en: "What is log base {base} of {val}?", hu: "Mennyi log {base} alapú {val}?", la: "Quantum est logarithmus basis {base} de {val}?", el: "Πόσο είναι log με βάση {base} του {val};", zh: "以{base}为底{val}的对数是多少？" },
  "factorial": { en: "What is {n}! ({n} factorial)?", hu: "Mennyi {n}! ({n} faktoriális)?", la: "Quantum est {n}! ({n} factorialis)?", el: "Πόσο είναι {n}! ({n} παραγοντικό);", zh: "{n}的阶乘({n}!)是多少？" },
  "gcd_of": { en: "What is the GCD (greatest common divisor) of {a} and {b}?", hu: "Mennyi {a} és {b} legnagyobb közös osztója?", la: "Quantum est maximus communis divisor {a} et {b}?", el: "Ποιος είναι ο ΜΚΔ των {a} και {b};", zh: "{a}和{b}的最大公约数是多少？" },
  "choose_items": { en: "How many ways can you choose {r} items from {n}? ({n}C{r})", hu: "Hányféleképpen lehet {r} elemet választani {n}-ből? ({n}C{r})", la: "Quot modis potes eligere {r} ex {n}? ({n}C{r})", el: "Με πόσους τρόπους μπορείς να διαλέξεις {r} από {n}; ({n}C{r})", zh: "从{n}中选{r}个有多少种方式？({n}C{r})" },
  "abs_value": { en: "What is |{a} − {b}|?", hu: "Mennyi |{a} − {b}|?", la: "Quantum est |{a} − {b}|?", el: "Πόσο είναι |{a} − {b}|;", zh: "|{a} − {b}|等于多少？" },

  // Patterns
  "what_comes_next": { en: "What comes next:", hu: "Mi jön ezután:", la: "Quid sequitur:", el: "Τι ακολουθεί:", zh: "下一个是什么：" },

  // Visual
  "how_many_shapes": { en: "How many {shape} are in this image?", hu: "Hány {shape} van ezen a képen?", la: "Quot {shape} sunt in hac imagine?", el: "Πόσα {shape} υπάρχουν στην εικόνα;", zh: "图中有多少个{shape}？" },
  "circles": { en: "circles", hu: "kör", la: "circuli", el: "κύκλοι", zh: "圆" },
  "squares": { en: "squares", hu: "négyzet", la: "quadrata", el: "τετράγωνα", zh: "正方形" },
  "what_color_replace": { en: "What color should replace the \"?\" (purple, cyan, or yellow)?", hu: "Milyen sz\u00EDnnel kell helyettes\u00EDteni a \"?\"-et? (lila, ci\u00E1n, s\u00E1rga)", la: "Quem colorem debet substituere \"?\"? (purpureus, cyaneus, flavus)", el: "\u03A0\u03BF\u03B9\u03BF \u03C7\u03C1\u03CE\u03BC\u03B1 \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B1\u03BD\u03C4\u03B9\u03BA\u03B1\u03C4\u03B1\u03C3\u03C4\u03AE\u03C3\u03B5\u03B9 \u03C4\u03BF \"?\";", zh: "\u5E94\u8BE5\u7528\u4EC0\u4E48\u989C\u8272\u66FF\u6362\u201C?\u201D\uFF1F" },
  "bar_value": { en: "What is the value of the highlighted bar ({label})?", hu: "Mennyi a kiemelt oszlop ({label}) értéke?", la: "Quantum est valor columnae {label}?", el: "Ποια είναι η τιμή της επισημασμένης στήλης ({label});", zh: "高亮柱({label})的值是多少？" },
  "bar_sum": { en: "What is the total sum of all bars?", hu: "Mennyi az összes oszlop összege?", la: "Quantum est summa omnium columnarum?", el: "Ποιο είναι το συνολικό άθροισμα;", zh: "所有柱的总和是多少？" },
  "bar_diff": { en: "What is the difference between the tallest and shortest bar?", hu: "Mennyi a különbség a legmagasabb és legalacsonyabb oszlop között?", la: "Quanta est differentia inter maximam et minimam columnam?", el: "Ποια είναι η διαφορά μεταξύ ψηλότερης και κοντύτερης στήλης;", zh: "最高和最矮柱之间的差是多少？" },
  "dice_total": { en: "What is the total shown on the dice?", hu: "Mennyi a dobókockákon látható összeg?", la: "Quantum est summa tesserarum?", el: "Ποιο είναι το σύνολο στα ζάρια;", zh: "骰子的总数是多少？" },
  "dice_product": { en: "What is the product of the dice values?", hu: "Mennyi a dobókockák értékeinek szorzata?", la: "Quantum est productum valorum?", el: "Ποιο είναι το γινόμενο των τιμών;", zh: "骰子值的乘积是多少？" },
  "clock_hour": { en: "The minute hand (cyan) points to 12. What number does the hour hand (yellow) point to?", hu: "A percmutató (cián) a 12-re mutat. Hányas számra mutat az óramutató (sárga)?", la: "Manus minutalis (cyana) ad 12 indicat. Ad quem numerum manus horaria (flava) indicat?", el: "Ο λεπτοδείκτης (κυανός) δείχνει στο 12. Σε ποιον αριθμό δείχνει ο ωροδείκτης (κίτρινος);", zh: "分针（青色）指向12。时针（黄色）指向几？" },
  "maze_turns": { en: "How many turns does the path from S to E make?", hu: "Hány kanyart tesz az útvonal S-ből E-be?", la: "Quot flexus facit via ab S ad E?", el: "Πόσες στροφές κάνει η διαδρομή από S σε E;", zh: "从S到E的路径有多少个转弯？" },
  "largest_segment": { en: "Which segment is the largest?", hu: "Melyik szegmens a legnagyobb?", la: "Quae pars est maxima?", el: "Ποιο τμήμα είναι το μεγαλύτερο;", zh: "哪个扇区最大？" },
  "colored_cells": { en: "If the right side mirrors the left, how many colored (non-black) cells are there in total?", hu: "Ha a jobb oldal tükrözi a balt, összesen hány színes (nem fekete) cella van?", la: "Si dextra sinistram spectat, quot cellulae coloratae sunt?", el: "Αν η δεξιά πλευρά αντικατοπτρίζει την αριστερή, πόσα χρωματιστά κελιά υπάρχουν;", zh: "如果右侧镜像左侧，总共有多少个有色单元格？" },
  "count_dots": { en: "How many {color} dots are there?", hu: "Hány {color} pont van?", la: "Quot puncta {color} sunt?", el: "Πόσες {color} κουκκίδες υπάρχουν;", zh: "有多少个{color}点？" },
  "row_sum_missing": { en: "Each row sums to 15. What number replaces the \"?\"?", hu: "Minden sor \u00F6sszege 15. Melyik sz\u00E1m helyettes\u00EDti a \"?\"-et?", la: "Summa cuiusque ordinis est 15. Quis numerus \"?\" substituit?", el: "\u039A\u03AC\u03B8\u03B5 \u03C3\u03B5\u03B9\u03C1\u03AC \u03B1\u03B8\u03C1\u03BF\u03AF\u03B6\u03B5\u03B9 15. \u03A0\u03BF\u03B9\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 \u03B1\u03BD\u03C4\u03B9\u03BA\u03B1\u03B8\u03B9\u03C3\u03C4\u03AC \u03C4\u03BF \"?\";", zh: "\u6BCF\u884C\u4E4B\u548C\u4E3A15\u3002\u201C?\u201D\u5E94\u8BE5\u662F\u591A\u5C11\uFF1F" },
  "larger_area": { en: "Which shape has a larger area? (Use π ≈ 3.14)", hu: "Melyik alakzatnak nagyobb a területe? (π ≈ 3.14)", la: "Quae forma maiorem aream habet? (π ≈ 3.14)", el: "Ποιο σχήμα έχει μεγαλύτερο εμβαδόν; (π ≈ 3.14)", zh: "哪个图形的面积更大？(π ≈ 3.14)" },
  "highest_day": { en: "On which day was the value highest?", hu: "Melyik napon volt a legmagasabb az érték?", la: "Quo die valor maximus erat?", el: "Ποια μέρα ήταν η τιμή υψηλότερη;", zh: "哪天的值最高？" },
  "average_value": { en: "What is the average value (rounded)?", hu: "Mennyi az átlagérték (kerekítve)?", la: "Quantum est media valor (rotundata)?", el: "Ποια είναι η μέση τιμή (στρογγυλοποιημένη);", zh: "平均值是多少（四舍五入）？" },
  "biggest_increase": { en: "What is the biggest increase between consecutive days?", hu: "Mennyi a legnagyobb növekedés egymást követő napok között?", la: "Quantum est maximum incrementum inter dies consecutivos?", el: "Ποια είναι η μεγαλύτερη αύξηση μεταξύ διαδοχικών ημερών;", zh: "连续两天之间的最大增幅是多少？" },

  // Spatial
  "paper_holes": { en: "A paper is folded {n} time(s) in half, then a hole is punched. How many holes when unfolded?", hu: "Egy papírt {n}-szer félbehajtunk, majd lyukat ütünk. Hány lyuk lesz kiterítve?", la: "Charta {n} vicibus complicata, foramen fit. Quot foramina ubi explicata?", el: "Ένα χαρτί διπλώνεται {n} φορές και ανοίγεται μια τρύπα. Πόσες τρύπες όταν ξεδιπλωθεί;", zh: "纸对折{n}次后打一个洞。展开后有多少个洞？" },
  "total_blocks": { en: "How many blocks are there in total?", hu: "Összesen hány kocka van?", la: "Quot cubi sunt in summa?", el: "Πόσα τουβλάκια υπάρχουν συνολικά;", zh: "总共有多少个方块？" },
  "cube_faces": { en: "In this cube net, how many faces does a cube have?", hu: "Ebben a kocka hálóban hány lapja van egy kockának?", la: "In hac rete cubi, quot facies habet cubus?", el: "Σε αυτό το ανάπτυγμα κύβου, πόσες πλευρές έχει ένας κύβος;", zh: "在这个立方体展开图中，一个立方体有多少个面？" },
  "mirror_letter": { en: "What letter appears when \"{letter}\" is mirrored horizontally?", hu: "Milyen betű jelenik meg ha \"{letter}\"-t vízszintesen tükrözzük?", la: "Quae littera apparet cum \"{letter}\" horizontaliter reflectitur?", el: "Ποιο γράμμα εμφανίζεται όταν το \"{letter}\" αντικατοπτρίζεται οριζόντια;", zh: "将\"{letter}\"水平镜像后是什么字母？" },

  // Trivia (language-independent ones)
  "trivia.red_planet": { en: "What planet is known as the Red Planet?", hu: "Melyik bolygó ismert Vörös Bolygóként?", la: "Quae planeta est Rubra Planeta?", el: "Ποιος πλανήτης είναι γνωστός ως ο Κόκκινος Πλανήτης;", zh: "哪个行星被称为红色星球？" },
  "trivia.bones": { en: "How many bones does an adult human body have?", hu: "Hány csontja van egy felnőtt emberi testnek?", la: "Quot ossa habet corpus humanum adultum?", el: "Πόσα οστά έχει το ενήλικο ανθρώπινο σώμα;", zh: "成年人体有多少块骨头？" },
  "trivia.gold_symbol": { en: "What is the chemical symbol for gold?", hu: "Mi az arany vegyjele?", la: "Quod est symbolum chemicum auri?", el: "Ποιο είναι το χημικό σύμβολο του χρυσού;", zh: "金的化学符号是什么？" },
  "trivia.titanic": { en: "In what year did the Titanic sink?", hu: "Melyik évben süllyedt el a Titanic?", la: "Quo anno Titanic demersit?", el: "Σε ποιο έτος βυθίστηκε ο Τιτανικός;", zh: "泰坦尼克号是哪一年沉没的？" },
  "trivia.smallest_prime": { en: "What is the smallest prime number?", hu: "Melyik a legkisebb prímszám?", la: "Quis est minimus numerus primus?", el: "Ποιος είναι ο μικρότερος πρώτος αριθμός;", zh: "最小的质数是多少？" },
  "trivia.continents": { en: "How many continents are there?", hu: "Hány kontinens van?", la: "Quot continentes sunt?", el: "Πόσες ήπειροι υπάρχουν;", zh: "有几个大洲？" },
  "trivia.plant_gas": { en: "What gas do plants absorb from the atmosphere?", hu: "Milyen gázt szívnak fel a növények a légkörből?", la: "Quem gas plantae ex atmosphaera absorbent?", el: "Ποιο αέριο απορροφούν τα φυτά από την ατμόσφαιρα;", zh: "植物从大气中吸收什么气体？" },
  "trivia.diamond": { en: "What is the hardest natural substance on Earth?", hu: "Mi a legkeményebb természetes anyag a Földön?", la: "Quae est durissima substantia naturalis in Terra?", el: "Ποια είναι η σκληρότερη φυσική ουσία στη Γη;", zh: "地球上最硬的天然物质是什么？" },
  "trivia.hexagon": { en: "How many sides does a hexagon have?", hu: "Hány oldala van egy hatszögnek?", la: "Quot latera habet hexagonum?", el: "Πόσες πλευρές έχει ένα εξάγωνο;", zh: "六边形有多少条边？" },
  "trivia.oxygen": { en: "What element does 'O' represent on the periodic table?", hu: "Milyen elemet jelöl az 'O' a periódusos rendszerben?", la: "Quod elementum 'O' repraesentat in tabula periodica?", el: "Ποιο στοιχείο αντιπροσωπεύει το 'O' στον περιοδικό πίνακα;", zh: "'O'在元素周期表中代表什么元素？" },
  "trivia.boiling": { en: "What is the boiling point of water in Celsius?", hu: "Mi a víz forráspontja Celsiusban?", la: "Quis est punctum ebullitionis aquae in Celsius?", el: "Ποιο είναι το σημείο βρασμού του νερού σε Κελσίου;", zh: "水的沸点是多少摄氏度？" },
  "trivia.teeth": { en: "How many teeth does an adult human typically have?", hu: "Hány foga van általában egy felnőtt embernek?", la: "Quot dentes habet homo adultus?", el: "Πόσα δόντια έχει συνήθως ένας ενήλικας;", zh: "成年人通常有多少颗牙齿？" },
  "trivia.pacific": { en: "What is the largest ocean on Earth?", hu: "Melyik a legnagyobb óceán a Földön?", la: "Quod est maximum oceanum in Terra?", el: "Ποιος είναι ο μεγαλύτερος ωκεανός στη Γη;", zh: "地球上最大的海洋是什么？" },
  "trivia.planets": { en: "How many planets are in our solar system?", hu: "Hány bolygó van a Naprendszerünkben?", la: "Quot planetae sunt in systemate solari nostro?", el: "Πόσοι πλανήτες υπάρχουν στο ηλιακό μας σύστημα;", zh: "我们的太阳系有多少颗行星？" },
  "trivia.h2o": { en: "What is the chemical formula for water?", hu: "Mi a víz kémiai képlete?", la: "Quae est formula chemica aquae?", el: "Ποιος είναι ο χημικός τύπος του νερού;", zh: "水的化学式是什么？" },
  "trivia.carbon": { en: "What is the atomic number of carbon?", hu: "Mi a szén rendszáma?", la: "Quis est numerus atomicus carbonis?", el: "Ποιος είναι ο ατομικός αριθμός του άνθρακα;", zh: "碳的原子序数是多少？" },
  "trivia.chromosomes": { en: "How many chromosomes do humans have?", hu: "Hány kromoszómája van az embernek?", la: "Quot chromosomata habent homines?", el: "Πόσα χρωμοσώματα έχουν οι άνθρωποι;", zh: "人类有多少条染色体？" },
  "trivia.nitrogen": { en: "What is the most abundant gas in Earth's atmosphere?", hu: "Mi a legelterjedtebb gáz a Föld légkörében?", la: "Quod gas est copiosissimum in atmosphaera Terrae?", el: "Ποιο είναι το πιο άφθονο αέριο στην ατμόσφαιρα;", zh: "地球大气中最丰富的气体是什么？" },
  "trivia.sqrt256": { en: "What is the square root of 256?", hu: "Mennyi 256 négyzetgyöke?", la: "Quantum est radix quadrata 256?", el: "Ποια είναι η τετραγωνική ρίζα του 256;", zh: "256的平方根是多少？" },

  // Code output
  "what_prints": { en: "What does this print?", hu: "Mit ír ki ez?", la: "Quid hoc imprimit?", el: "Τι εκτυπώνει αυτό;", zh: "这段代码输出什么？" },
  "code_output": { en: "What is the output? (space-separated)", hu: "Mi a kimenet? (szóközzel elválasztva)", la: "Quid est exitus?", el: "Ποια είναι η έξοδος;", zh: "输出是什么？（空格分隔）" },
  "how_many_chars": { en: "How many '{c}' characters?", hu: "Hány '{c}' karakter van?", la: "Quot '{c}' characteres?", el: "Πόσοι χαρακτήρες '{c}';", zh: "有多少个'{c}'字符？" },
  "time_complexity": { en: "What is the time complexity?", hu: "Mi az időkomplexitás?", la: "Quae est complexitas temporis?", el: "Ποια είναι η χρονική πολυπλοκότητα;", zh: "时间复杂度是多少？" },
  "debug_error": { en: "This code has a bug. What kind of error occurs? (index/name/type)", hu: "Ebben a kódban hiba van. Milyen típusú hiba lép fel? (index/name/type)", la: "Hic codex vitium habet. Quod genus erroris?", el: "Αυτός ο κώδικας έχει σφάλμα. Τι είδους σφάλμα;", zh: "这段代码有bug。什么类型的错误？(index/name/type)" },
  "should_add_bug": { en: "This function should add, but prints the wrong result. What does it actually print?", hu: "Ez a függvény összeadna, de rossz eredményt ír ki. Mit ír ki valójában?", la: "Haec functio addere debet sed malum imprimit. Quid revera imprimit?", el: "Αυτή η συνάρτηση πρέπει να προσθέτει, αλλά εκτυπώνει λάθος. Τι εκτυπώνει;", zh: "这个函数应该做加法，但输出了错误结果。实际输出什么？" },
  "string_concat": { en: "What does this print? (hint: string concatenation)", hu: "Mit ír ki? (tipp: szöveg összefűzés)", la: "Quid imprimit? (admonitio: concatenatio)", el: "Τι εκτυπώνει; (υπόδειξη: συνένωση)", zh: "输出什么？（提示：字符串拼接）" },
};

export function pt(key: string, lang: PuzzleLang, vars?: Record<string, string | number>): string {
  const tmpl = templates[key];
  if (!tmpl) return key;
  let result = tmpl[lang] || tmpl.en;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.split(`{${k}}`).join(String(v));
    }
  }
  return result;
}
