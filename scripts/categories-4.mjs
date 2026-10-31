// Kategorie 16–20.
export default [
  {
    slug: 'szklo',
    name: 'Szkło i ceramika',
    short: 'Szkło i ceramika',
    color: '#a5f3fc',
    icon: 'glass',
    groups: {
      glass: ['Szkło sodowo-wapniowe', 'Szkło borokrzemowe', 'Kryształ ołowiowy', 'Szkło kwarcowe', 'Krzemionka topiona', 'Szkło hartowane', 'Szkło laminowane'],
      glass2: ['Szkło matowe', 'Szkło barwione', 'Szkło lustrzane', 'Pyroceram', 'Szkło żaroodporne'],
      fiber: ['Włókno szklane', 'Szklane mikrokulki'],
      ceramic: ['Ceramika', 'Porcelana', 'Porcelana kostna', 'Kamionka', 'Fajans', 'Terakota'],
      ceramic2: ['Raku', 'Seladon', 'Fajans majolikowy', 'Ceramika glinowa', 'Ceramika cyrkonowa'],
      technical: ['Węglik krzemu ceramiczny', 'Azotek krzemu', 'Węglik boru', 'Węglik wolframu', 'Cermet'],
      functional: ['Ferryt', 'Ceramika piezoelektryczna', 'Ceramika dielektryczna', 'Ceramika nadprzewodząca'],
      finish: ['Glazura ceramiczna', 'Emalia', 'Fryta szklana'],
      lab: ['Tygiel', 'Szkło laboratoryjne'],
      other: ['Włókno optyczne', 'Szklana kulka', 'Kryształ górski']
    }
  },
  {
    slug: 'snieg',
    name: 'Śnieg i lód',
    short: 'Śnieg i lód',
    color: '#bfeaff',
    icon: 'snow',
    groups: {
      snow: ['Śnieg', 'Śnieg puszysty', 'Śnieg mokry', 'Błoto pośniegowe', 'Firn'],
      ice: ['Lód', 'Czarny lód', 'Lód lodowcowy', 'Lód morski', 'Kostka lodu', 'Lód wodny'],
      frost: ['Szron', 'Sadź', 'Szadź', 'Gołoledź', 'Lód rzęsisty'],
      precip: ['Grad', 'Deszcz ze śniegiem', 'Krupa śnieżna', 'Płatek śniegu'],
      cryo: ['Suchy lód', 'Mgła kriogeniczna', 'Solanka kriogeniczna', 'Płyn niezamarzający', 'Krioprotektant', 'Żel lodowy'],
      earth: ['Wieloletnia zmarzlina', 'Zamarznięta gleba', 'Zamarznięte jezioro', 'Lądolód'],
      space: ['Lód Europy', 'Lód kometarny', 'Lód amonowy', 'Lód metanowy'],
      gas: ['Klatrat metanu', 'Hydrat gazu', 'Lód CO2'],
      salt: ['Sól drogowa', 'Sól kamienna'],
      other: ['Góra lodowa', 'Kryształ lodu', 'Mrożone owoce']
    }
  },
  {
    slug: 'kosmos',
    name: 'Kosmos i planety',
    short: 'Kosmos',
    color: '#8b9dff',
    icon: 'space',
    groups: {
      regolith: ['Regolit', 'Regolit księżycowy', 'Gleba marsjańska'],
      rock: ['Skała asteroidowa', 'Meteoryt', 'Meteoryt żelazny', 'Chondryt', 'Chondryt węglowy', 'Tektit'],
      dust: ['Pył kometarny', 'Pył gwiezdny', 'Pył międzygwiazdowy'],
      energy: ['Wiatr słoneczny', 'Promieniowanie kosmiczne', 'Korona słoneczna', 'Pozyton', 'Mion'],
      exotic: ['Ciemna materia', 'Materia gwiazdy neutronowej', 'Plazma kwarkowo-gluonowa', 'Materia białego karła', 'Antymateria', 'Neutrino'],
      plasma: ['Plazma gwiezdna', 'Plazma wodorowa', 'Plazma helowa', 'Powierzchnia Słońca'],
      gas: ['Gaz mgławicy', 'Atmosfera lodowego olbrzyma', 'Atmosfera gazowego olbrzyma', 'Atmosfera Wenus'],
      planet: ['Materiał jądra planety', 'Ocean magmy', 'Powierzchnia planety lawowej', 'Lód pierścieni Saturna', 'Jezioro metanowe Tytana'],
      tech: ['Szczątki orbitalne', 'Stop kosmiczny', 'Tkanina skafandra', 'Kadłub stacji'],
      other: ['Obiekt pasa Kuipera', 'Jądro komety']
    }
  },
  {
    slug: 'radioaktywne',
    name: 'Materiały radioaktywne',
    short: 'Radioaktywne',
    color: '#c6ff4a',
    icon: 'radiation',
    groups: {
      uranium: ['Uran-238', 'Uran-235', 'Uran wzbogacony', 'Uran zubożony'],
      plutonium: ['Pluton-239', 'Pluton-238'],
      thorium: ['Thor-232'],
      radium: ['Rad-226'],
      radon: ['Radon-222'],
      polonium: ['Polon-210'],
      americium: ['Ameryk-241'],
      curium: ['Kurium-244'],
      californium: ['Kaliforn-252'],
      fission: ['Cez-137', 'Stront-90', 'Kobalt-60', 'Jod-131'],
      isotope: ['Tryt', 'Deuter', 'Węgiel-14', 'Potas-40', 'Rubid-87', 'Samar-147'],
      paint: ['Farba radowa', 'Farba radioluminescencyjna'],
      glass: ['Szkło uranowe', 'Szkło hot cell'],
      source: ['Źródło do czujki dymu', 'Źródło neutronów', 'Źródło gamma', 'Źródło alfa', 'Kryształ scyntylacyjny'],
      fuel: ['Pellet paliwa jądrowego', 'Paliwo MOX', 'Wypalone paliwo jądrowe', 'Rdzeń plutonowy'],
      waste: ['Odpady wysokoaktywne', 'Odpady niskoaktywne'],
      shield: ['Grafit moderatora', 'Pręt kontrolny borowy', 'Osłona ołowiana', 'Osłona betonowa']
    }
  },
  {
    slug: 'specjalne',
    name: 'Materiały specjalne',
    short: 'Specjalne',
    color: '#e2e8f0',
    icon: 'sparkle',
    groups: {
      aerogel: ['Aerogel krzemionkowy', 'Aerogel grafenowy'],
      carbon: ['Włókno węglowe', 'Buckypaper', 'Grafenowy papier', 'Diament'],
      gem: ['Szafir', 'Rubin', 'Szmaragd', 'Aleksandryt', 'Perła', 'Bursztyn'],
      organic: ['Kość słoniowa', 'Róg', 'Szylkret', 'Masa perłowa', 'Jedwab', 'Jedwab pajęczy'],
      fiber: ['Wełna', 'Kaszmir', 'Moher', 'Alpaka', 'Kevlar', 'Nomex'],
      fabric: ['Skóra', 'Zamsz', 'Filc'],
      advanced: ['Dyneema', 'Vectran', 'Zylon', 'Stop z pamięcią kształtu'],
      smart: ['Żel balistyczny', 'Płyn zagęszczany ścinaniem', 'Płyn magnetoreologiczny', 'Płyn elektroreologiczny', 'Polimer piezoelektryczny', 'Polimer samonaprawiający'],
      chromic: ['Materiał termochromowy', 'Materiał fotochromowy', 'Fosfor świecący'],
      nano: ['Kropka kwantowa', 'Metamateriał']
    }
  }
]
