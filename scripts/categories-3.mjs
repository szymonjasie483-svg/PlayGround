// Kategorie 11–15.
export default [
  {
    slug: 'zwierzeta',
    name: 'Zwierzęta i organizmy',
    short: 'Zwierzęta',
    color: '#f2a65a',
    icon: 'paw',
    groups: {
      insect: ['Mrówka', 'Pszczoła', 'Osa', 'Termit', 'Żuk', 'Motyl', 'Ważka'],
      insect2: ['Konik polny', 'Biedronka', 'Świetlik'],
      arachnid: ['Pająk', 'Skorpion'],
      myriapod: ['Krocionóg'],
      mollusk: ['Ślimak', 'Pomrów'],
      worm: ['Dżdżownica', 'Pijawka'],
      jelly: ['Meduza', 'Polip koralowy'],
      echinoderm: ['Rozgwiazda', 'Jeżowiec'],
      crustacean: ['Krab', 'Homar', 'Krewetka'],
      cephalopod: ['Ośmiornica', 'Kałamarnica'],
      fish: ['Ryba', 'Rekin'],
      marine: ['Wieloryb', 'Delfin'],
      bird: ['Pingwin', 'Ptak'],
      amphibian: ['Żaba', 'Salamandra'],
      reptile: ['Jaszczurka', 'Wąż'],
      material: ['Pióro', 'Futro ssaka', 'Kość'],
      shell: ['Muszla', 'Chityna'],
      other: ['Tardigrada']
    }
  },
  {
    slug: 'zywnosc',
    name: 'Żywność',
    short: 'Żywność',
    color: '#ff6b8a',
    icon: 'food',
    groups: {
      fruit: ['Jabłko', 'Banan', 'Pomarańcza', 'Cytryna', 'Winogrono', 'Truskawka', 'Jagoda', 'Malina', 'Wiśnia'],
      fruit2: ['Ananas', 'Arbuz', 'Melon', 'Kiwi', 'Kokos'],
      vegetable: ['Pomidor', 'Ziemniak', 'Marchew', 'Cebula', 'Czosnek', 'Kapusta', 'Sałata', 'Brokuł', 'Ogórek'],
      grain: ['Pieczywo', 'Makaron', 'Mąka'],
      sweet: ['Cukier', 'Czekolada', 'Karmel', 'Marshmallow'],
      dairy: ['Masło', 'Ser', 'Jogurt', 'Śmietana'],
      sauce: ['Majonez', 'Ketchup', 'Musztarda'],
      beverage: ['Piwo', 'Kawa'],
      nut: ['Orzech włoski', 'Migdał', 'Pistacja']
    }
  },
  {
    slug: 'budowlane',
    name: 'Materiały budowlane',
    short: 'Budowlane',
    color: '#b8a58f',
    icon: 'brick',
    groups: {
      binder: ['Cement portlandzki', 'Cement hutniczy', 'Zaprawa cementowa'],
      concrete: ['Beton', 'Beton zbrojony', 'Beton komórkowy', 'Bloczek betonowy'],
      plaster: ['Tynk gipsowy', 'Tynk wapienny', 'Stiuk'],
      board: ['Płyta gipsowo-kartonowa', 'Płyta OSB', 'Płyta MDF'],
      brick: ['Cegła ceramiczna', 'Cegła silikatowa', 'Pustak ceramiczny', 'Dachówka ceramiczna'],
      stone: ['Płyta granitowa', 'Płyta marmurowa', 'Blok wapienny', 'Łupek dachowy'],
      asphalt: ['Asfalt', 'Membrana bitumiczna'],
      aggregate: ['Żwir', 'Kruszywo łamane'],
      steel: ['Pręt zbrojeniowy', 'Belka stalowa'],
      insulation: ['Wełna mineralna', 'Wełna szklana', 'Wełna skalna', 'Pianka poliuretanowa'],
      roof: ['Papa dachowa'],
      tile: ['Płytka ceramiczna', 'Płytka porcelanowa'],
      sealant: ['Silikon budowlany', 'Masa szpachlowa'],
      other: ['Geowłóknina', 'Rura PEX'],
      earth: ['Adobe', 'Cob', 'Ziemia ubijana', 'Bal słomiany']
    }
  },
  {
    slug: 'drewno',
    name: 'Drewno i papier',
    short: 'Drewno',
    color: '#c68b59',
    icon: 'wood',
    groups: {
      hardwood: ['Dąb', 'Brzoza', 'Buk', 'Jesion', 'Klon', 'Orzech', 'Drewno wiśniowe', 'Mahoń', 'Teak'],
      hardwood2: ['Palisander', 'Heban', 'Balsa', 'Kork'],
      softwood: ['Sosna', 'Świerk', 'Jodła', 'Modrzew', 'Cedr'],
      wood: ['Bambus konstrukcyjny', 'Rattan', 'Wierzba'],
      wood2: ['Topola', 'Drewno dryfujące'],
      composite: ['Sklejka', 'Płyta pilśniowa', 'Trociny'],
      paper: ['Papier', 'Karton', 'Papier gazetowy', 'Bibuła', 'Pergamin', 'Papier kraft', 'Papier ryżowy', 'Papirus'],
      paper2: ['Papier bawełniany', 'Papier makulaturowy', 'Papier toaletowy'],
      special: ['Papier woskowany', 'Papier ścierny', 'Tapeta'],
      pulp: ['Miazga drzewna', 'Celuloza']
    }
  },
  {
    slug: 'tworzywa',
    name: 'Tworzywa sztuczne',
    short: 'Tworzywa',
    color: '#6ee7b7',
    icon: 'plastic',
    groups: {
      polyolefin: ['Polietylen HDPE', 'Polietylen LDPE', 'Polipropylen', 'EVA'],
      styrene: ['Polistyren', 'Polistyren ekspandowany', 'ABS', 'ASA', 'SAN'],
      vinyl: ['PVC', 'PVA'],
      engineering: ['Poliwęglan', 'Akryl PMMA', 'Nylon 6', 'Nylon 66', 'POM', 'PBT', 'PET'],
      high_perf: ['PTFE', 'PEEK', 'PEI', 'PPS'],
      fluoropolymer: ['PFA', 'FEP', 'PVDF'],
      elastomer: ['Guma silikonowa', 'Kauczuk naturalny', 'Neopren', 'Kauczuk nitrylowy', 'Kauczuk butylowy', 'EPDM'],
      resin: ['Epoksyd', 'Żywica poliestrowa', 'Poliuretan', 'Żywica fenolowa'],
      bio: ['PLA', 'PHA', 'PHB', 'Skrobia termoplastyczna'],
      other: ['Lateks', 'Hydrożel', 'Superabsorbent']
    }
  }
]
