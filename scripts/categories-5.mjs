// Kategorie 21–25.
export default [
  {
    slug: 'technologia',
    name: 'Elementy technologiczne',
    short: 'Technologia',
    color: '#67e8f9',
    icon: 'chip',
    groups: {
      compute: ['Procesor CPU', 'GPU', 'Moduł RAM', 'Kość SSD', 'Talerz HDD', 'Mikrokontroler'],
      component: ['Cewka indukcyjna', 'Potencjometr', 'Przełącznik', 'Złącze USB-C', 'Kabel USB', 'Płytka drukowana', 'Pasta lutownicza'],
      power: ['Radiator', 'Silnik elektryczny', 'Generator', 'Transformator', 'Kubit'],
      audio: ['Antena', 'Głośnik', 'Mikrofon', 'Matryca aparatu'],
      display: ['Panel LCD', 'Panel OLED', 'Ekran dotykowy'],
      sensor: ['Akcelerometr', 'Żyroskop', 'Magnetometr', 'Moduł GPS', 'Czujnik temperatury'],
      id: ['Etykieta RFID', 'Chip NFC'],
      optical: ['Soczewka', 'Pryzmat', 'Lustro'],
      laser: ['Kryształ laserowy', 'Dioda laserowa'],
      energy: ['Fotodioda', 'Panel słoneczny', 'Nadprzewodzący drut'],
      other: ['Silnik krokowy', 'Dron']
    }
  },
  {
    slug: 'syntetyczne',
    name: 'Materiały syntetyczne',
    short: 'Syntetyczne',
    color: '#f0abfc',
    icon: 'hex',
    groups: {
      gem: ['Diament syntetyczny', 'Cyrkonia', 'Moissanit', 'Rubin syntetyczny', 'Szafir syntetyczny', 'Szmaragd syntetyczny', 'Opal syntetyczny', 'Kwarc syntetyczny', 'Grafit syntetyczny'],
      fiber: ['Włókno poliestrowe', 'Włókno akrylowe', 'Spandex', 'Włókno aramidowe', 'Włókno bazaltowe'],
      foam: ['Pianka metalowa', 'Pianka syntaktyczna', 'Pianka polimerowa', 'Kserożel'],
      liquid: ['Kriżel', 'Ciecz jonowa', 'Głęboki rozpuszczalnik eutektyczny'],
      wax: ['Wosk syntetyczny', 'Olej silikonowy'],
      resin: ['Żywica syntetyczna', 'Żywica alkidowa', 'Żywica UV', 'Fotorezyst'],
      glue: ['Cyjanoakrylan', 'Klej na gorąco', 'Klej do drewna', 'Superklej', 'Klej kontaktowy', 'Klej w sprayu'],
      chem: ['Wywoływacz', 'Trawik', 'Domieszka półprzewodnikowa'],
      advanced: ['Fosfor OLED', 'Perowskit', 'MOF', 'COF'],
      other: ['Kauczuk syntetyczny', 'Lateks syntetyczny']
    }
  },
  {
    slug: 'przemyslowe',
    name: 'Materiały przemysłowe',
    short: 'Przemysłowe',
    color: '#fbbf24',
    icon: 'factory',
    groups: {
      coal: ['Węgiel kamienny', 'Koks metalurgiczny', 'Brykiet węglowy'],
      ore: ['Pellet rudy żelaza', 'Spiek rudy', 'Żużel wielkopiecowy', 'Klinkier cementowy', 'Kamień wapienny topnikowy', 'Dolomit topnikowy', 'Koncentrat miedzi'],
      ash: ['Pył krzemionkowy przemysłowy', 'Popiół lotny', 'Popiół denny', 'Gips odsiarczania'],
      waste: ['Fosfogips', 'Czerwony muł', 'Pozostałość boksytowa', 'Odpady poflotacyjne'],
      chemical: ['Siarka przemysłowa', 'Amoniak przemysłowy', 'Mocznik przemysłowy', 'Metanol przemysłowy', 'Formaldehyd przemysłowy', 'Etylen przemysłowy', 'Benzen przemysłowy'],
      monomer: ['Styren', 'Chlorek winylu', 'Akrylonitryl', 'Kaprolaktam'],
      acid: ['Kwas tereftalowy', 'Fenol'],
      bio: ['Gliceryna przemysłowa', 'Kwasy tłuszczowe', 'Łój przemysłowy', 'Olej palmowy'],
      biomass: ['Bagassa', 'Biomasa', 'Biowęgiel'],
      mining: ['Koncentrat kobaltu', 'Kamień niklowy'],
      other: ['Sól przemysłowa', 'Potasz']
    }
  },
  {
    slug: 'dekoracyjne',
    name: 'Elementy dekoracyjne',
    short: 'Dekoracyjne',
    color: '#fda4af',
    icon: 'ornament',
    groups: {
      metal: ['Złota folia', 'Srebrna folia', 'Miedziana folia', 'Patyna brązowa'],
      mosaic: ['Mozaika', 'Witraż'],
      textile: ['Tapeta dekoracyjna', 'Welur dekoracyjny', 'Gobelin', 'Dywan', 'Chodnik', 'Zasłona', 'Tkanina bawełniana', 'Tkanina jedwabna', 'Koronka'],
      fiber: ['Filc dekoracyjny', 'Skóra dekoracyjna'],
      wood: ['Okleina drewniana', 'Roleta bambusowa', 'Wiklina'],
      craft: ['Makrama', 'Wazon ceramiczny', 'Wazon porcelanowy'],
      glass: ['Wazon szklany', 'Lustro dekoracyjne', 'Kryształ ozdobny'],
      frame: ['Rama obrazu', 'Złota rama', 'Srebrna rama'],
      light: ['Świeca ozdobna', 'Żyrandol', 'Abażur'],
      scent: ['Kadzidło', 'Potpourri'],
      nature: ['Suszone kwiaty', 'Wieniec', 'Girlanda'],
      holiday: ['Bombka choinkowa', 'Tinsel', 'Cekin'],
      other: ['Koralik', 'Zegar']
    }
  },
  {
    slug: 'narzedzia',
    name: 'Narzędzia i obiekty specjalne',
    short: 'Narzędzia',
    color: '#cbd5e1',
    icon: 'tool',
    groups: {
      tool: ['Młot', 'Siekiera', 'Piła', 'Śrubokręt', 'Klucz płaski', 'Szczypce', 'Nóż'],
      weapon: ['Miecz', 'Tarcza', 'Hełm'],
      farm: ['Kilof', 'Łopata', 'Grabie', 'Kosa'],
      farm2: ['Sierp'],
      forge: ['Kowadło', 'Kuźnia', 'Kleszcze', 'Osełka'],
      stone: ['Kamień szlifierski'],
      rope: ['Lina', 'Łańcuch'],
      fastener: ['Gwóźdź', 'Wkręt', 'Śruba', 'Nakrętka'],
      mech: ['Zawias', 'Zamek', 'Klucz', 'Koło zębate', 'Sprężyna'],
      machine: ['Krążek', 'Koło'],
      nav: ['Magnes', 'Kompas'],
      science: ['Mikroskop', 'Termometr'],
      clock: ['Mechanizm zegarowy', 'Liczydło'],
      light: ['Latarnia', 'Pochodnia', 'Lampa olejna']
    }
  }
]
