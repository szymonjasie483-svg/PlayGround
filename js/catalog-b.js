export const CATALOG_B = [
  {
    id: 'fungi', name: 'Grzyby i bakterie', short: 'Grzyby', icon: 'mushroom',
    hue: [22, 330], sat: [18, 62], light: [32, 66], patterns: ['spores', 'dots', 'cloud', 'ripple'],
    groups: [
      ['mushroom', ['Borowik', 'Muchomor', 'Pieczarka', 'Trufla', 'Drożdże', 'Pleśń', 'Grzybnia', 'Kurka']],
      ['bacteria', ['Escherichia coli', 'Lactobacillus', 'Streptococcus', 'Salmonella', 'Bacillus subtilis', 'Azotobacter', 'Nitrosomonas', 'Sinica bakteryjna']],
      ['microbe', ['Wirus', 'Bakteriofag', 'Archea', 'Pierwotniak', 'Ameba', 'Orzęsek', 'Drobnoustrój', 'Endospora']],
      ['fungal', ['Penicylina', 'Aspergillus', 'Fusarium', 'Candida', 'Trichoderma', 'Shiitake', 'Reishi', 'Chaga']],
      ['biofilm', ['Biofilm', 'Śluz bakteryjny', 'Kolonia bakterii', 'Zarodniki', 'Spory', 'Mikoryza', 'Porost', 'Hubiak']],
    ],
  },
  {
    id: 'animals', name: 'Zwierzęta i organizmy', short: 'Zwierzęta', icon: 'paw',
    hue: [14, 48], sat: [22, 64], light: [30, 62], patterns: ['scales', 'dots', 'strata', 'veins'],
    groups: [
      ['mammal', ['Wilk', 'Lis', 'Jeleń', 'Niedźwiedź', 'Królik', 'Jeż', 'Nietoperz', 'Wydra']],
      ['bird', ['Orzeł', 'Sowa', 'Wróbel', 'Kruk', 'Łabędź', 'Pingwin', 'Papuga', 'Koliber']],
      ['reptile', ['Wąż', 'Jaszczurka', 'Żółw', 'Krokodyl', 'Kameleon', 'Pyton', 'Gecko', 'Legwan']],
      ['insect', ['Mrówka', 'Pszczoła', 'Motyl', 'Ważka', 'Biedronka', 'Konik polny', 'Ćma', 'Termit']],
      ['aquatic_animal', ['Ryba', 'Rekin', 'Ośmiornica', 'Meduza', 'Krab', 'Delfin', 'Żaba', 'Rozgwiazda']],
    ],
  },
  {
    id: 'food', name: 'Żywność', short: 'Żywność', icon: 'apple',
    hue: [0, 62], sat: [42, 88], light: [34, 68], patterns: ['grain', 'dots', 'ripple', 'crumb'],
    groups: [
      ['fruit', ['Jabłko', 'Banan', 'Pomarańcza', 'Cytryna', 'Winogrono', 'Truskawka', 'Arbuz', 'Mango']],
      ['vegetable', ['Ogórek', 'Cebula', 'Czosnek', 'Kapusta', 'Brokuł', 'Papryka', 'Dynia', 'Bakłażan']],
      ['grain', ['Chleb', 'Makaron', 'Mąka pszenna', 'Kasza', 'Płatki owsiane', 'Bułka', 'Tortilla', 'Mąka kukurydziana']],
      ['dairy', ['Mleko', 'Ser', 'Masło', 'Jogurt', 'Śmietana', 'Twaróg', 'Lody', 'Kefir']],
      ['meat', ['Wołowina', 'Wieprzowina', 'Kurczak', 'Ryba wędzona', 'Boczek', 'Kiełbasa', 'Jajko', 'Mięso mielone']],
    ],
  },
  {
    id: 'building', name: 'Materiały budowlane', short: 'Budownictwo', icon: 'brick',
    hue: [18, 220], sat: [6, 42], light: [34, 66], patterns: ['brick', 'speckle', 'strata', 'weave'],
    groups: [
      ['binder', ['Cement', 'Beton', 'Zaprawa', 'Gips budowlany', 'Wapno', 'Asfalt', 'Żywica epoksydowa', 'Klej montażowy']],
      ['block', ['Cegła czerwona', 'Cegła silikatowa', 'Pustak', 'Beton komórkowy', 'Bloczek żużlowy', 'Płyta betonowa', 'Krawężnik', 'Kostka brukowa']],
      ['insulation', ['Wełna mineralna', 'Styropian', 'Pianka poliuretanowa', 'Korkobeton', 'Płyta gipsowo-kartonowa', 'Folia paroizolacyjna', 'Membrana dachowa', 'Papa']],
      ['roofing', ['Dachówka', 'Blacha dachowa', 'Gont', 'Łupek dachowy', 'Rynna', 'Komin', 'Kratownica', 'Belka stalowa']],
      ['finish', ['Tynk', 'Gładź', 'Farba elewacyjna', 'Tapeta', 'Płytka ceramiczna', 'Panel podłogowy', 'Listwa przypodłogowa', 'Siatka zbrojeniowa']],
    ],
  },
  {
    id: 'wood', name: 'Drewno i papier', short: 'Drewno', icon: 'rings',
    hue: [18, 46], sat: [20, 64], light: [28, 62], patterns: ['rings', 'grain', 'weave', 'strata'],
    groups: [
      ['wood', ['Drewno dębowe', 'Drewno sosnowe', 'Drewno brzozowe', 'Drewno bukowe', 'Drewno klonowe', 'Drewno orzechowe', 'Drewno teakowe', 'Drewno mahoniowe', 'Drewno balsa', 'Drewno hebanowe']],
      ['processed_wood', ['Deska', 'Sklejka', 'MDF', 'Płyta OSB', 'Płyta wiórowa', 'Laminat', 'Fornir', 'Drewno opałowe']],
      ['paper', ['Papier', 'Karton', 'Papier gazetowy', 'Papier kredowy', 'Papier pergaminowy', 'Bibuła', 'Tektura', 'Papier toaletowy']],
      ['fiber', ['Len', 'Konopie', 'Juta', 'Włókno bawełniane', 'Sisal', 'Kokos', 'Kenaf', 'Abaka']],
      ['wood_special', ['Korek', 'Drewno smołowane', 'Drewno petryfikowane', 'Trociny', 'Słoma', 'Trzcina']],
    ],
  },
  {
    id: 'plastics', name: 'Tworzywa sztuczne', short: 'Tworzywa', icon: 'hex',
    hue: [182, 328], sat: [24, 82], light: [38, 70], patterns: ['dots', 'hex', 'gloss', 'weave'],
    groups: [
      ['thermoplastic', ['Polietylen', 'Polipropylen', 'PVC', 'Polistyren', 'PET', 'ABS', 'PMMA', 'Poliwęglan', 'Nylon', 'POM']],
      ['engineering_plastic', ['PEEK', 'PTFE', 'PPS', 'PSU', 'PEI', 'LCP', 'PVDF', 'PAI']],
      ['elastomer', ['Guma naturalna', 'Guma syntetyczna', 'Silikon', 'Neopren', 'Kauczuk', 'EPDM', 'TPU', 'Lateks']],
      ['plastic_composite', ['Włókno węglowe', 'Włókno szklane', 'Kompozyt aramidowy', 'Laminat epoksydowy', 'Guma wzmocniona', 'Pianka PVC']],
      ['bioplastic', ['PLA', 'PHA', 'TPS', 'Bioplastik']],
      ['historic_plastic', ['Bakelit', 'Ebonit', 'Celuloid', 'Galalit']],
    ],
  },
  {
    id: 'glass', name: 'Szkło i ceramika', short: 'Szkło', icon: 'glass',
    hue: [168, 320], sat: [14, 58], light: [44, 82], patterns: ['gloss', 'crystal', 'mosaic', 'ripple'],
    groups: [
      ['glass', ['Szkło sodowe', 'Szkło ołowiowe', 'Szkło borokrzemowe', 'Szkło hartowane', 'Szkło laminowane', 'Szkło kwarcowe', 'Szkło barwione', 'Szkło piankowe']],
      ['ceramic', ['Porcelana', 'Fajans', 'Kamionka', 'Majolika', 'Terakota', 'Biskwit', 'Ceramika techniczna', 'Ceramika ogniotrwała']],
      ['crystal', ['Szkło kryształowe', 'Kryształ solny', 'Kryształ cukru', 'Kryształ lodu', 'Kryształ boraksu', 'Kryształ ałunu', 'Kryształ siarczanu miedzi', 'Kryształ bizmutu']],
      ['glaze', ['Szkliwo', 'Emalia', 'Glazura', 'Frita', 'Oksyda ceramiczna', 'Angoba', 'Lustr ceramiczny', 'Szkło wodne']],
      ['glass_special', ['Witraż', 'Szkło żaroodporne', 'Szkło kuloodporne', 'Szkło samoczyszczące', 'Szkło inteligentne', 'Aerogel krzemionkowy', 'Szkło próżniowe', 'Szkło fotochromowe']],
    ],
  },
  {
    id: 'ice', name: 'Śnieg i lód', short: 'Lód', icon: 'snow',
    hue: [176, 216], sat: [18, 66], light: [58, 90], patterns: ['frost', 'crystal', 'dots', 'cloud'],
    groups: [
      ['snow', ['Śnieg świeży', 'Śnieg zbity', 'Śnieg mokry', 'Śnieżynka', 'Firn', 'Lawina', 'Zaspa śnieżna', 'Śnieg arktyczny']],
      ['ice', ['Lód', 'Lód morski', 'Lód słodkowodny', 'Lód czarny', 'Lód mleczny', 'Lód lodowcowy', 'Lód biegunowy', 'Lód przejrzysty']],
      ['glacial', ['Lodowiec', 'Góra lodowa', 'Szelf lodowy', 'Morena lodowcowa', 'Kriokonit', 'Lód wieloletni', 'Jaskinia lodowa', 'Rzeka lodowa']],
      ['cryo', ['Kriolit', 'Suchy lód', 'Kriogeniczny żel', 'Sól rozmrażająca', 'Mieszanka chłodząca', 'Szron krystaliczny', 'Mgła lodowa', 'Grad lodowy']],
      ['ice_phenomenon', ['Gołoledź', 'Sople', 'Szadź', 'Zamarznięta mgła', 'Śryż', 'Krą lodowa', 'Śnieg z deszczem', 'Zamieć śnieżna']],
    ],
  },
];
