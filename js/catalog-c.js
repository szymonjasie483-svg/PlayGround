export const CATALOG_C = [
  {
    id: 'space', name: 'Kosmos i planety', short: 'Kosmos', icon: 'planet',
    hue: [232, 320], sat: [34, 86], light: [36, 76], patterns: ['stars', 'cloud', 'crystal', 'spark'],
    groups: [
      ['space_body', ['Regolit księżycowy', 'Pył marsjański', 'Skała asteroidy', 'Lód kometowy', 'Materiał meteorytu', 'Piasek księżycowy', 'Gleba marsjańska', 'Skała planetoidy']],
      ['star', ['Plazma słoneczna', 'Wiatr słoneczny', 'Materiał gwiazdowy', 'Pył gwiezdny', 'Mgławica', 'Jądro gwiazdy', 'Korona słoneczna', 'Protogwiazda']],
      ['exotic', ['Materiał neutronowy', 'Plazma kwarkowa', 'Ciemna materia', 'Antymateria', 'Kondensat Bosego-Einsteina', 'Materiał egzotyczny', 'Struna kosmiczna', 'Pole Higgsa']],
      ['planet', ['Atmosfera Wenus', 'Lód Europy', 'Piasek Tytana', 'Ocean Enceladusa', 'Chmury Jowisza', 'Powierzchnia Plutona', 'Skała Merkurego', 'Burza Neptuna']],
      ['space_tech', ['Stop kosmiczny', 'Osłona ablacyjna', 'Tkanina kosmiczna', 'Paliwo rakietowe', 'Utleniacz rakietowy', 'Satelita', 'Sonda kosmiczna', 'Stacja orbitalna']],
    ],
  },
  {
    id: 'radioactive', name: 'Materiały radioaktywne', short: 'Radioaktywne', icon: 'radiation',
    hue: [68, 118], sat: [62, 100], light: [36, 62], patterns: ['hazard', 'spark', 'speckle', 'gloss'],
    groups: [
      ['radioactive_element', ['Uran', 'Pluton', 'Rad', 'Tor', 'Polon', 'Aktyn', 'Protaktyn', 'Neptun']],
      ['isotope', ['Uran-235', 'Uran-238', 'Pluton-239', 'Cez-137', 'Stront-90', 'Kobalt-60', 'Jod-131', 'Ameryk-241']],
      ['radioactive_ore', ['Smółka uranowa', 'Karnotyt', 'Autunit', 'Torbernit', 'Monazyt', 'Cyrkon radioaktywny', 'Pechblenda', 'Ruda toru']],
      ['radioactive_waste', ['Odpady promieniotwórcze', 'Woda radioaktywna', 'Pył radioaktywny', 'Żużel uranowy', 'Skażenie gleby', 'Izotop medyczny', 'Sól radioaktywna', 'Osad reaktora']],
      ['radiation', ['Promieniowanie alfa', 'Promieniowanie beta', 'Promieniowanie gamma', 'Neutrony', 'Cząstki alfa', 'Cząstki beta', 'Promieniowanie rentgenowskie', 'Gorąca komora']],
    ],
  },
  {
    id: 'special', name: 'Materiały specjalne', short: 'Specjalne', icon: 'sparkles',
    hue: [150, 330], sat: [48, 100], light: [38, 74], patterns: ['mosaic', 'hex', 'stars', 'crystal'],
    groups: [
      ['metamaterial', ['Aerogel', 'Grafen', 'Nanorurki węglowe', 'MXene', 'Metaliczna pianka', 'Materiał auxetyczny', 'Struktura metamateriałowa', 'Kwazikryształ']],
      ['smart', ['Stop z pamięcią kształtu', 'Żel magnetyczny', 'Ciecz magnetoreologiczna', 'Materiał chromogeniczny', 'Materiał termoelektryczny', 'Materiał fotowoltaiczny', 'Polimer samonaprawiający', 'Materiał zmiennofazowy']],
      ['rare_special', ['Monokryształ', 'Nadciecz', 'Fuleren', 'Nanodiament', 'Heksagonalny azotek boru', 'Molibdenit', 'Węglik krzemu', 'Spinel']],
      ['weird', ['Ciecz nienewtonowska', 'Ferrofluid', 'Plazma pyłowa', 'Materiał iluzoryczny', 'Ciało amorficzne', 'Materiał nadgęsty', 'Materiał ultralekki', 'Izotop stabilny']],
      ['functional', ['Katalizator', 'Materiał ablacyjny', 'Materiał superhydrofobowy', 'Materiał oleofobowy', 'Membrana filtracyjna', 'Sito molekularne', 'Żywica jonowymienna', 'Węgiel aktywowany']],
    ],
  },
  {
    id: 'tech', name: 'Elementy technologiczne', short: 'Technologia', icon: 'chip',
    hue: [186, 248], sat: [46, 92], light: [38, 68], patterns: ['circuit', 'hex', 'gloss', 'dots'],
    groups: [
      ['processor', ['Mikroprocesor', 'Układ scalony', 'Pamięć RAM', 'Dysk SSD', 'Tranzystor polowy', 'Mikrokontroler', 'FPGA', 'Układ AI']],
      ['sensor', ['Czujnik temperatury', 'Czujnik ciśnienia', 'Czujnik światła', 'Kamera', 'Mikrofon', 'Lidar', 'Czujnik gazu', 'Akcelerometr']],
      ['energy_tech', ['Bateria litowa', 'Ogniwo paliwowe', 'Bateria półprzewodnikowa', 'Panel fotowoltaiczny', 'Silnik elektryczny', 'Silnik spalinowy', 'Prądnica', 'Cewka Tesli']],
      ['machine', ['Robot', 'Dron', 'Drukarka 3D', 'Serwomechanizm', 'Pompa', 'Kompresor', 'Chłodziarka', 'Manipulator']],
      ['digital', ['Wyświetlacz LCD', 'Wyświetlacz OLED', 'E-ink', 'LED', 'Laser', 'Światłowód', 'Antena', 'Moduł Wi-Fi']],
    ],
  },
  {
    id: 'synthetic', name: 'Materiały syntetyczne', short: 'Syntetyczne', icon: 'molecule',
    hue: [168, 332], sat: [34, 86], light: [36, 72], patterns: ['weave', 'hex', 'dots', 'mosaic'],
    groups: [
      ['synthetic_fiber', ['Kevlar', 'Nomex', 'Tyvek', 'Spandex', 'Poliester', 'Akryl', 'Wełna syntetyczna', 'Mikrofibra']],
      ['foam', ['Pianka akustyczna', 'Pianka lateksowa', 'Pianka fenolowa', 'Pianka melaminowa', 'Pianka polietylenowa', 'Gąbka syntetyczna', 'Aerogel polimerowy', 'Materiał porowaty']],
      ['coating', ['Farba akrylowa', 'Lakier bezbarwny', 'Powłoka teflonowa', 'Powłoka ceramiczna', 'Powłoka antykorozyjna', 'Farba fluorescencyjna', 'Farba termochromowa', 'Powłoka hydrofobowa']],
      ['adhesive', ['Klej cyjanoakrylowy', 'Klej poliuretanowy', 'Klej silikonowy', 'Taśma dwustronna', 'Rzep syntetyczny', 'Żywica akrylowa', 'Uszczelniacz', 'Masa szpachlowa']],
      ['synthetic_composite', ['Materiał kompozytowy', 'Tkanina techniczna', 'Siatka polimerowa', 'Membrana syntetyczna', 'Folia stretch', 'Folia bąbelkowa', 'Włókno polimerowe', 'Materiał laminowany']],
    ],
  },
  {
    id: 'industrial', name: 'Materiały przemysłowe', short: 'Przemysł', icon: 'factory',
    hue: [16, 210], sat: [14, 66], light: [26, 62], patterns: ['strata', 'speckle', 'weave', 'brick'],
    groups: [
      ['fuel', ['Ropa naftowa', 'Węgiel kamienny', 'Węgiel brunatny', 'Torf', 'Łupek bitumiczny', 'Piasek bitumiczny', 'Gaz łupkowy', 'Biopaliwo']],
      ['industrial_chem', ['Smoła', 'Kreozot', 'Kwas przemysłowy', 'Ług sodowy', 'Roztwór solanki', 'Gliceryna przemysłowa', 'Olej transformatorowy', 'Wosk parafinowy']],
      ['industrial_mineral', ['Klinkier', 'Żużel wielkopiecowy', 'Popiół paleniskowy', 'Gips syntetyczny', 'Siarczan amonu', 'Saletra przemysłowa', 'Soda kalcynowana', 'Krzemionka']],
      ['industrial_material', ['Blacha stalowa', 'Drut', 'Rura', 'Profil stalowy', 'Śruba', 'Łożysko', 'Uszczelka', 'Sprężyna']],
      ['industrial_waste', ['Szlam', 'Osad ściekowy', 'Odpady z tworzyw', 'Złom', 'Pył kominowy', 'Ścieki przemysłowe', 'Woda chłodząca', 'Smary odpadowe']],
    ],
  },
  {
    id: 'decor', name: 'Elementy dekoracyjne', short: 'Dekoracje', icon: 'diamond',
    hue: [12, 320], sat: [24, 82], light: [38, 74], patterns: ['mosaic', 'weave', 'gloss', 'stars'],
    groups: [
      ['art', ['Mozaika', 'Sztukateria', 'Złocenie', 'Ramka obrazu', 'Rzeźba gipsowa', 'Wazon ceramiczny', 'Lustro', 'Żyrandol']],
      ['light_decor', ['Lampa', 'Świecznik', 'Lampion', 'Neon dekoracyjny', 'Girlanda', 'Reflektor', 'Świeca', 'Lampa UV']],
      ['furniture', ['Krzesło', 'Stół', 'Szafa', 'Łóżko', 'Półka', 'Komoda', 'Fotel', 'Biurko']],
      ['textile', ['Zasłona', 'Poduszka', 'Koc', 'Obrus', 'Bieżnik', 'Narzuta', 'Firanka', 'Kilim']],
      ['nature_decor', ['Akwarium', 'Fontanna', 'Doniczka', 'Ogród zen', 'Terrarium', 'Skrzynka na kwiaty', 'Kamień dekoracyjny', 'Płot']],
    ],
  },
  {
    id: 'tools', name: 'Narzędzia i obiekty specjalne', short: 'Narzędzia', icon: 'wrench',
    hue: [14, 214], sat: [12, 70], light: [36, 70], patterns: ['brushed', 'circuit', 'gloss', 'spark'],
    groups: [
      ['hand_tool', ['Młotek', 'Śrubokręt', 'Klucz', 'Piła', 'Dłuto', 'Szczypce', 'Poziomica', 'Miarka']],
      ['power_tool', ['Wiertarka', 'Szlifierka', 'Piła łańcuchowa', 'Młot udarowy', 'Spawarka', 'Lutownica', 'Opalarka', 'Frezarka']],
      ['lab_tool', ['Mikroskop', 'Probówka', 'Kolba', 'Palnik Bunsenowski', 'Pipeta', 'Wirówka', 'Spektrometr', 'Reaktor']],
      ['object', ['Skrzynia', 'Beczka', 'Kotwica', 'Koło zębate', 'Łańcuch', 'Zamek', 'Kompas', 'Lupa']],
      ['special_tool', ['Portal', 'Kula plazmowa', 'Relikwia', 'Kryształ mocy', 'Wehikuł czasu', 'Rdzeń energii', 'Maska', 'Totem']],
    ],
  },
];
