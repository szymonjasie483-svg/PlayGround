// Kategorie 1–5. Każdy wpis to prawdziwy materiał lub konkretna odmiana.
// Klucz grupy wskazuje archetyp fizyczny użyty przez generator.
export default [
  {
    slug: 'ziemia',
    name: 'Ziemia i minerały',
    short: 'Ziemia',
    color: '#c89355',
    icon: 'earth',
    groups: {
      soil: ['Gleba próchniczna', 'Gleba piaszczysta', 'Gleba gliniasta', 'Less', 'Muł rzeczny'],
      clay: ['Ił', 'Kaolin', 'Bentonit', 'Glina ogniotrwała', 'Glina szamotowa'],
      organic_soil: ['Torf', 'Próchnica', 'Mursz'],
      ore: ['Ruda żelaza', 'Hematyt', 'Magnetyt', 'Limonit', 'Syderyt', 'Boksyt', 'Chalkopiryt'],
      carbonate: ['Kalcyt', 'Dolomit', 'Malachit', 'Azuryt', 'Magnezyt'],
      crystal: ['Kwarc', 'Fluoryt', 'Cyrkon', 'Turmalin', 'Granat'],
      mineral: ['Skaleń', 'Mika', 'Talk', 'Apatyt'],
      salt: ['Halit', 'Boraks'],
      porous_mineral: ['Zeolit', 'Wermikulit', 'Diatomit'],
      sulfur: ['Siarka'],
      pigment_mineral: ['Ochra', 'Lapis lazuli']
    }
  },
  {
    slug: 'piasek',
    name: 'Piasek i skały',
    short: 'Piasek i skały',
    color: '#d8a96a',
    icon: 'sand',
    groups: {
      sand: ['Piasek kwarcowy', 'Piasek rzeczny', 'Piasek pustynny', 'Piasek koralowy', 'Piasek bazaltowy', 'Piasek oliwinowy', 'Piasek cyrkonowy', 'Piasek granatowy'],
      sandstone: ['Piaskowiec', 'Piaskowiec kwarcytowy', 'Szarogłaz'],
      igneous: ['Granit', 'Bazalt', 'Andezyt', 'Ryolit', 'Gabro', 'Diorit', 'Sjenit'],
      volcanic: ['Obsydian', 'Pumeks', 'Tuf wulkaniczny', 'Scoria'],
      metamorphic: ['Gnejs', 'Łupek krystaliczny', 'Fyllit', 'Amfibolit', 'Eklogit', 'Migmatyt'],
      limestone: ['Wapień', 'Skała dolomitowa', 'Kreda', 'Margiel'],
      sedimentary: ['Łupek ilasty', 'Zlepieniec', 'Brekcja', 'Mułowiec', 'Iłowiec'],
      gem: ['Jaspis', 'Agat', 'Onyks', 'Opal', 'Krzemień']
    }
  },
  {
    slug: 'metale',
    name: 'Metale i stopy',
    short: 'Metale',
    color: '#9fb3c8',
    icon: 'metal',
    groups: {
      iron: ['Żelazo', 'Stal węglowa', 'Stal nierdzewna', 'Żeliwo'],
      steel: ['Stal narzędziowa', 'Stal damasceńska', 'Stal sprężynowa', 'Stal szybkotnąca'],
      light_metal: ['Aluminium', 'Duraluminium', 'Tytan', 'Magnez', 'Beryl'],
      copper_alloy: ['Miedź', 'Brąz', 'Mosiądz'],
      metal: ['Cynk', 'Ołów', 'Cyna', 'Nikiel', 'Chrom'],
      refractory_metal: ['Wolfram', 'Molibden', 'Tantal'],
      alkali_metal: ['Lit', 'Sód', 'Potas', 'Cez'],
      alkaline_metal: ['Wapń', 'Stront', 'Bar'],
      low_melt_metal: ['Gal', 'Ind', 'Bizmut'],
      noble_metal: ['Złoto', 'Srebro', 'Platyna', 'Pallad'],
      rare_earth: ['Neodym', 'Cer'],
      solder: ['Solder cynowo-ołowiowy'],
      superalloy: ['Inconel']
    }
  },
  {
    slug: 'gazy',
    name: 'Gazy',
    short: 'Gazy',
    color: '#7fd6c4',
    icon: 'gas',
    groups: {
      gas_light: ['Wodór', 'Hel', 'Acetylen'],
      noble_gas: ['Argon', 'Neon', 'Krypton', 'Ksenon', 'Radon', 'Heksafluorek siarki'],
      oxidizer_gas: ['Tlen', 'Ozon', 'Podtlenek azotu', 'Tlen medyczny'],
      inert_gas: ['Azot', 'Powietrze', 'Dwutlenek węgla'],
      base_gas: ['Amoniak'],
      halogen_gas: ['Fluor', 'Chlor', 'Pary bromu', 'Pary jodu'],
      fuel_gas: ['Metan', 'Etan', 'Propan', 'Butan', 'Propylen', 'Gaz ziemny', 'Biogaz'],
      toxic_gas: ['Tlenek węgla', 'Dwutlenek azotu', 'Dwutlenek siarki', 'Siarkowodór', 'Fosgen', 'Formaldehyd'],
      acid_gas: ['Chlorowodór', 'Fluorowodór', 'Bromowodór'],
      steam: ['Para wodna', 'Dym'],
      dust: ['Pył węglowy', 'Sadza lotna', 'Pył krzemionkowy']
    }
  },
  {
    slug: 'ciecze',
    name: 'Ciecze',
    short: 'Ciecze',
    color: '#5db6ff',
    icon: 'liquid',
    groups: {
      water: ['Woda', 'Woda morska', 'Solanka', 'Ciężka woda'],
      food_liquid: ['Mleko', 'Miód', 'Syrop klonowy', 'Melasa'],
      oil: ['Oliwa z oliwek', 'Olej słonecznikowy', 'Olej rzepakowy', 'Olej kokosowy', 'Olej silnikowy'],
      fuel_liquid: ['Diesel', 'Benzyna', 'Nafta', 'Paliwo lotnicze', 'Ropa naftowa'],
      tar: ['Smoła', 'Bitum'],
      organic_liquid: ['Gliceryna', 'Glikol etylenowy', 'Glikol propylenowy'],
      alcohol: ['Etanol', 'Metanol', 'Izopropanol', 'Eter dietylowy'],
      solvent: ['Benzen', 'Toluen', 'Ksylen'],
      acid_liquid: ['Kwas siarkowy', 'Kwas azotowy', 'Kwas chlorowodorowy', 'Kwas octowy'],
      cryo_liquid: ['Ciekły azot', 'Ciekły tlen', 'Ciekły hel'],
      magma: ['Magma', 'Lawa'],
      molten: ['Stopione żelazo', 'Stopione aluminium', 'Stopione szkło']
    }
  }
]
