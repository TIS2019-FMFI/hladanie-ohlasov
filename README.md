# TTENBL = Automatické vyhľadávanie ohlasov na publikácie pre evidenciu publikačnej činnosti na Univerzite Komenského
Nástroj vyhľadáva publikácie a následne citácie k označeným publikáciam. Pred použitím je nutné si nainštalovať node.js.
1. Zapneme cmd, navigujeme príkazmi 'cd', do zložky s súborom index.js.
2. Zadáme príkaz node index.js (ak nám chýbajú potrebné moduly, node vyhodí chybové hlásenie, je potrebné ich doinštalovať podľa pokynov v danom hlásení)
3. Ak niesme na školskom internetovom pripojení potrebujeme nastaviť proxy.
LINUX BASH:  export ALL_PROXY="http://login:password@proxy.uniba.sk:3128"
WINDOWS : nájdeme nastavenia proxy, pridáme adresu skriptu ->  http://www.uniba.sk/proxy.pac , zmeníme nastavenia používania skript adresu na zapnutú. Ak to nefungujeme nájdeme nastavenia systemovych premenných a vytvoríme novú s názom ALL_PROXY s hodnotou http://login:password@proxy.uniba.sk:3128.
4. Otvoríme webový prehliadač, ideme na localhost:4000 (alebo iné číslo určené cez node.js)
5. Zadáme autorizačný klúč, ak ho nemáme je k dispozícii v súbore config.json (zložka private
6. Zadáme údaje podľa ktorých hladáme publikácie. Stláčíme Hladaj.
7. Z výsledkov označíme pre ktoré práce potrebujeme citácie. Stlačíme Vyhľadaj citácie.
