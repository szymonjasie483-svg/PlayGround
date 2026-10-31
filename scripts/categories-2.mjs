// Kategorie 6–10.
export default [
  {
    slug: 'chemia',
    name: 'Chemia',
    short: 'Chemia',
    color: '#c084fc',
    icon: 'chem',
    groups: {
      salt: ['Chlorek sodu', 'Chlorek potasu', 'Tiosiarczan sodu', 'Siarczan magnezu', 'Siarczan sodu', 'Chlorek amonu', 'Chlorek wapnia'],
      carbonate: ['Węglan wapnia', 'Wodorowęglan sodu'],
      base: ['Wodorotlenek sodu', 'Wodorotlenek potasu', 'Wodorotlenek wapnia', 'Wodorotlenek litu'],
      oxidizer: ['Woda utleniona', 'Nadmanganian potasu', 'Azotan potasu', 'Azotan amonu', 'Nadchloran amonu'],
      colored_salt: ['Siarczan miedzi', 'Siarczan żelaza', 'Chlorek żelaza(III)'],
      pigment: ['Dwutlenek tytanu', 'Tlenek cynku', 'Tlenek żelaza', 'Dwutlenek krzemu'],
      carbide: ['Węglik wapnia', 'Węglik krzemu'],
      acid_solid: ['Kwas borowy', 'Kwas szczawiowy', 'Kwas winowy', 'Kwas salicylowy', 'Kwas mrówkowy'],
      organic_solid: ['Mocznik', 'EDTA', 'Luminol'],
      porous_chem: ['Węgiel aktywowany', 'Żel krzemionkowy'],
      explosive: ['Termit aluminiowo-żelazowy', 'Proch czarny', 'Dynamit', 'TNT'],
      phosphorus: ['Biały fosfor']
    }
  },
  {
    slug: 'ogien',
    name: 'Ogień i temperatura',
    short: 'Ogień',
    color: '#ff7a45',
    icon: 'fire',
    groups: {
      fire: ['Płomień świecy', 'Płomień drewna', 'Płomień gazu', 'Płomień alkoholu', 'Płomień wodoru', 'Płomień niebieski', 'Zimny ogień'],
      ember: ['Żar', 'Iskra', 'Popiół'],
      carbon: ['Węgiel drzewny', 'Sadza', 'Węgiel koksowy'],
      lava: ['Rzeka lawy', 'Komin magmowy'],
      molten: ['Stopiony metal', 'Stopione szkło piecowe', 'Stopiona siarka', 'Stopiony ołów', 'Stopiony cynk', 'Stopiona stal'],
      cryo: ['Kriogeniczna mgła', 'Suchy lód techniczny', 'Szron kriogeniczny', 'Żel termiczny'],
      thermal: ['Masa termoprzewodząca', 'Aerogel', 'Cegła ogniotrwała'],
      fire_suppressant: ['Piana gaśnicza', 'Środek gaśniczy', 'Farba pęczniejąca'],
      incendiary: ['Napalm', 'Mieszanka zapalająca', 'Flara', 'Fajerwerk', 'Główka zapałki'],
      wax: ['Wosk pszczeli', 'Wosk parafinowy', 'Łój', 'Dziegieć'],
      other: ['Lont', 'Żużel']
    }
  },
  {
    slug: 'elektrycznosc',
    name: 'Elektryczność',
    short: 'Elektryczność',
    color: '#ffe066',
    icon: 'bolt',
    groups: {
      particle: ['Elektron', 'Jon dodatni', 'Jon ujemny', 'Ładunek statyczny'],
      plasma: ['Plazma', 'Błyskawica', 'Iskra elektryczna'],
      wire: ['Drut miedziany', 'Drut aluminiowy', 'Drut złoty', 'Drut srebrny', 'Drut nichromowy', 'Żarnik wolframowy'],
      electrode: ['Elektroda węglowa', 'Pręt grafitowy'],
      battery: ['Ogniwo litowo-jonowe', 'Bateria alkaliczna', 'Akumulator ołowiowy', 'Ogniwo NiCd'],
      component: ['Superkondensator', 'Kondensator', 'Rezystor', 'Termistor', 'Dioda', 'LED', 'Tranzystor'],
      solar: ['Ogniwo fotowoltaiczne'],
      piezo: ['Kryształ piezoelektryczny', 'Zapalarka piezo'],
      magnetic: ['Elektromagnes', 'Rdzeń transformatora', 'Cewka generatora'],
      conductive: ['Farba przewodząca', 'Klej przewodzący', 'Grafen', 'Nanorurka węglowa'],
      electrolyte: ['Elektrolit', 'Olej transformatorowy'],
      lamp: ['Świetlówka'],
      other: ['Iskiernik', 'Piorunochron'],
      ito: ['Tlenek indowo-cynowy']
    }
  },
  {
    slug: 'rosliny',
    name: 'Rośliny',
    short: 'Rośliny',
    color: '#7ed957',
    icon: 'leaf',
    groups: {
      leaf: ['Liść dębu', 'Liść klonu', 'Liść brzozy', 'Liść paproci'],
      needle: ['Igła sosny'],
      moss: ['Mech', 'Mech torfowiec'],
      algae: ['Glony', 'Wodorosty', 'Kelp', 'Trawa morska'],
      grass: ['Trawa', 'Skrzyp'],
      crop: ['Pszenica', 'Żyto', 'Owies', 'Ryż', 'Kukurydza', 'Trzcina cukrowa', 'Bambus'],
      fiber: ['Bawełna', 'Len', 'Konopie', 'Juta'],
      flower: ['Orchidea', 'Róża', 'Tulipan', 'Słonecznik'],
      herb: ['Mięta', 'Bazylia', 'Rozmaryn', 'Tymianek'],
      succulent: ['Kaktus', 'Aloes'],
      vine: ['Bluszcz', 'Winorośl'],
      aquatic: ['Lotos', 'Lilia wodna'],
      tree: ['Eukaliptus', 'Sekwoja'],
      other: ['Korzeń', 'Kora']
    }
  },
  {
    slug: 'grzyby',
    name: 'Grzyby i bakterie',
    short: 'Grzyby i bakterie',
    color: '#e8b4ff',
    icon: 'fungus',
    groups: {
      mushroom: ['Pieczarka', 'Boczniak', 'Shiitake', 'Portobello', 'Kurka', 'Trufla', 'Smardz'],
      toxic_mushroom: ['Muchomor czerwony', 'Muchomor sromotnikowy'],
      ergot: ['Sporysz'],
      yeast: ['Drożdże piekarskie', 'Drożdże piwowarskie'],
      mold: ['Pleśń', 'Penicillium', 'Aspergillus'],
      slime: ['Śluzowiec', 'Grzybnia'],
      spores: ['Zarodniki grzybów'],
      bacteria: ['Kolonia bakterii', 'Escherichia coli', 'Lactobacillus', 'Streptococcus', 'Salmonella', 'Prątek gruźlicy', 'Sinice'],
      bacteria_env: ['Bakterie azotowe', 'Bakterie nitryfikacyjne', 'Bakterie siarkowe'],
      archaea: ['Archeony', 'Metanogeny', 'Ekstremofil'],
      virus: ['Wirus', 'Bakteriofag', 'Prion'],
      biofilm: ['Biofilm', 'SCOBY kombuchy'],
      starter: ['Zakwas tempeh', 'Koji'],
      antibiotic: ['Penicylina', 'Streptomycyna'],
      enzyme: ['Katalaza', 'Amylaza']
    }
  }
]
