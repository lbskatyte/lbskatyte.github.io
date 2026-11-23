/*==============================================================
  custom.js – Evelinos Beigaitės CV svetainės JavaScript (LD11)
  Kontaktų formos apdorojimas, validacija ir telefono formatavimas
==============================================================*/

document.addEventListener('DOMContentLoaded', function () {

  const forma = document.getElementById('kontaktuForma');

  // Forma yra tik kontaktų puslapyje – kituose puslapiuose nieko nedarome
  if (!forma) {
    return;
  }

  const siustiMygtukas = document.getElementById('siustiMygtukas');
  const isvalytiMygtukas = document.getElementById('isvalytiMygtukas');
  const rezultatai = document.getElementById('formosRezultatai');
  const rezultatuSarasas = document.getElementById('rezultatuSarasas');
  const vidurkisLaukas = document.getElementById('vidurkis');
  const telefonas = document.getElementById('telefonas');

  // Visų formos laukų id
  const laukai = ['vardas', 'pavarde', 'elpastas', 'telefonas', 'adresas',
                  'klausimas1', 'klausimas2', 'klausimas3'];

  // Laukai, kuriuos vartotojas jau lietė (klaidą rodome tik jiems)
  let paliesti = {};

  /*------------------------------------------------------------
    Validacijos taisyklės.
    Funkcija grąžina klaidos tekstą arba tuščią eilutę, jei viskas gerai.
  ------------------------------------------------------------*/
  const tikRaides = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/;
  const elPastoFormatas = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const telefonoFormatas = /^\+370 6\d{2} \d{5}$/;

  function tikrintiLauka(id) {
    const reiksme = document.getElementById(id).value.trim();

    if (reiksme === '') {
      return 'Šis laukas privalomas.';
    }

    if (id === 'vardas' || id === 'pavarde') {
      if (!tikRaides.test(reiksme)) {
        return 'Galima naudoti tik raides.';
      }
    }

    if (id === 'elpastas') {
      if (!elPastoFormatas.test(reiksme)) {
        return 'Neteisingas el. pašto formatas (pvz., vardenis@mail.lt).';
      }
    }

    if (id === 'telefonas') {
      if (!telefonoFormatas.test(reiksme)) {
        return 'Numeris turi būti formatu +370 6xx xxxxx.';
      }
    }

    if (id === 'adresas') {
      if (reiksme.length < 3) {
        return 'Adresas per trumpas.';
      }
    }

    if (id.startsWith('klausimas')) {
      const skaicius = Number(reiksme);
      if (!Number.isInteger(skaicius) || skaicius < 1 || skaicius > 10) {
        return 'Įveskite sveiką skaičių nuo 1 iki 10.';
      }
    }

    return '';
  }

  // Parodo arba paslepia klaidą prie lauko (raudonas rėmelis + tekstas)
  function rodytiKlaida(id, klaida) {
    const laukas = document.getElementById(id);
    const klaidosVieta = document.getElementById(id + '-klaida');

    if (klaida) {
      laukas.classList.add('neteisingas');
      laukas.classList.remove('teisingas');
      klaidosVieta.textContent = klaida;
    } else {
      laukas.classList.remove('neteisingas');
      laukas.classList.add('teisingas');
      klaidosVieta.textContent = '';
    }
  }

  // Patikrina visą formą: mygtukas „Siųsti“ aktyvus tik kai nėra klaidų
  function atnaujintiMygtuka() {
    let visiTeisingi = true;

    laukai.forEach(function (id) {
      const klaida = tikrintiLauka(id);
      if (klaida) {
        visiTeisingi = false;
      }
      if (paliesti[id]) {
        rodytiKlaida(id, klaida);
      }
    });

    siustiMygtukas.disabled = !visiTeisingi;
  }

  /*------------------------------------------------------------
    Telefono numerio formatavimas realiu laiku: +370 6xx xxxxx
  ------------------------------------------------------------*/
  function formatuotiTelefona(reiksme) {
    let skaitmenys = reiksme.replace(/\D/g, '');   // paliekame tik skaitmenis

    if (skaitmenys.startsWith('370')) {
      skaitmenys = skaitmenys.slice(3);            // šalies kodą pridedame patys
    }

    skaitmenys = skaitmenys.slice(0, 8);           // ne daugiau 8 skaitmenų

    if (skaitmenys === '') {
      return '';
    }

    let rezultatas = '+370 ' + skaitmenys.slice(0, 3);
    if (skaitmenys.length > 3) {
      rezultatas += ' ' + skaitmenys.slice(3);
    }
    return rezultatas;
  }

  telefonas.addEventListener('input', function () {
    telefonas.value = formatuotiTelefona(telefonas.value);
  });

  /*------------------------------------------------------------
    Validacija realiu laiku: tikriname kiekvieną kartą, kai
    vartotojas rašo arba palieka lauką
  ------------------------------------------------------------*/
  laukai.forEach(function (id) {
    const laukas = document.getElementById(id);

    laukas.addEventListener('input', function () {
      paliesti[id] = true;
      atnaujintiMygtuka();
    });

    laukas.addEventListener('blur', function () {
      paliesti[id] = true;
      atnaujintiMygtuka();
    });
  });

  /*------------------------------------------------------------
    Formos pateikimas
  ------------------------------------------------------------*/
  forma.addEventListener('submit', function (event) {
    // a) Sustabdome numatytąjį pateikimą – puslapis neperkraunamas
    event.preventDefault();

    // Dar kartą patikriname visus laukus
    laukai.forEach(function (id) {
      paliesti[id] = true;
    });
    atnaujintiMygtuka();
    if (siustiMygtukas.disabled) {
      return;
    }

    // b) Surenkame visas reikšmes į JavaScript objektą
    const formosDuomenys = {
      vardas: document.getElementById('vardas').value.trim(),
      pavarde: document.getElementById('pavarde').value.trim(),
      elPastas: document.getElementById('elpastas').value.trim(),
      telefonas: document.getElementById('telefonas').value.trim(),
      adresas: document.getElementById('adresas').value.trim(),
      klausimas1: Number(document.getElementById('klausimas1').value),
      klausimas2: Number(document.getElementById('klausimas2').value),
      klausimas3: Number(document.getElementById('klausimas3').value)
    };

    // c) Išvedame objektą į naršyklės konsolę
    console.log(formosDuomenys);

    // d) Tas pačias reikšmes parodome po forma
    const eilutes = [
      ['Vardas', formosDuomenys.vardas],
      ['Pavardė', formosDuomenys.pavarde],
      ['El. paštas', formosDuomenys.elPastas],
      ['Tel. numeris', formosDuomenys.telefonas],
      ['Adresas', formosDuomenys.adresas],
      ['1 klausimas (dizainas)', formosDuomenys.klausimas1],
      ['2 klausimas (informacija)', formosDuomenys.klausimas2],
      ['3 klausimas (rekomendacija)', formosDuomenys.klausimas3]
    ];

    rezultatuSarasas.innerHTML = '';
    eilutes.forEach(function (eilute) {
      const p = document.createElement('p');
      const pavadinimas = document.createElement('strong');
      pavadinimas.textContent = eilute[0] + ': ';
      p.appendChild(pavadinimas);
      // textContent – vartotojo tekstas nevykdomas kaip HTML (apsauga nuo XSS)
      p.appendChild(document.createTextNode(eilute[1]));
      rezultatuSarasas.appendChild(p);
    });

    // 5. Trijų įvertinimų vidurkis
    const vidurkis = (formosDuomenys.klausimas1 +
                      formosDuomenys.klausimas2 +
                      formosDuomenys.klausimas3) / 3;

    vidurkisLaukas.textContent = formosDuomenys.vardas + ' ' +
                                 formosDuomenys.pavarde + ': ' +
                                 vidurkis.toFixed(1);

    rezultatai.hidden = false;
  });

  /*------------------------------------------------------------
    Mygtukas „Išvalyti“ – forma grąžinama į pradinę būseną
  ------------------------------------------------------------*/
  isvalytiMygtukas.addEventListener('click', function () {
    forma.reset();                       // išvalomi visi laukai
    paliesti = {};

    laukai.forEach(function (id) {       // išvalomos klaidos ir rėmeliai
      const laukas = document.getElementById(id);
      laukas.classList.remove('neteisingas', 'teisingas');
      document.getElementById(id + '-klaida').textContent = '';
    });

    rezultatuSarasas.innerHTML = '';     // išvalomi parodyti duomenys
    vidurkisLaukas.textContent = '';     // ir vidurkis
    rezultatai.hidden = true;

    siustiMygtukas.disabled = true;      // mygtukas vėl neaktyvus
  });

});
