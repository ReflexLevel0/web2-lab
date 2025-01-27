URL aplikacije: https://web2-lab05-53er.onrender.com/

Popis svojstva:
1. interpolation/one-way binding => Da, ostvareno na puno mjesta, neki od primjera su src/components/Cart.vue :70 (povezivanje minijature sa listom imena), src/components/Miniature.vue :26 (povezivanje imageUrl i slike)
2. two-way binding => Da, src/components/Cart.vue :82 (terms and conditions checkbox, povezan na terms_and_conditions i koristi se za omogućavanje ili onemogućavanje gumba za kupovinu minijatura, BITNO: za testiranje je potrebno dodati barem jednu minijaturu u košaricu klikom na košaricu pokraj liste minijatura kako bi se checkbox uopće vidio)
3. methods => Da, korišteno na puno mjesta, na primjer src/views/CartView.vue :9 :10 :11 (redirecta korisnika na početnu stranicu nakon što dobije onItemsPurchased event)
4. computed properties => Da, src/components/Cart.vue :30-:37 (računa ukupnu cijenu minijatura u košarici) i src/App.vue :17 (vraća string sa brojem minijatura u košarici)
5. barem jedan scoped style => Da, scoped style korišten u skoro svakoj komponenti (npr. korišten je u svakoj komponenti u src/components direktoriju)
6. koristiti barem jedan lifecycle hook => Da, src/components/MiniatureList.vue :13-:26 (koristi se za dohvaćanje liste minijatura nakon učitavanja početne stranice)
7. routing (više stranica)
     aplikacija mora biti bookmarkable, tako da rade linkovi (ne samo na root, već i moj-web.com/stranica1, moj-web.com/stranica2)
     dinamičko usmjeravanje s 404 stranicom ("catch all")
     => Da, implementirano u src/router/index.js, podržane rute su / (home) i /cart (košarica), a svaki drugi link na stranicu vodi do /error stranice na kojoj se prikazuje greška
8. (barem) dvije komponente
     komponenta bez stanja, koristiti properties
     komponenta sa stanjem
     => Da, napravljene su 3 komponente koje se nalaze u src/components direktoriju
9. barem jedna komponenta mora emitirati barem jedan event => Da, src/components/Cart.vue :50 (emitira event onItemsPurchased kojeg koristi src/views/CartView.vue da redirektira korisnika na početnu stranicu nakon kupovine minijatura)
10. store (Pinia) => Da, implementiran cart store u src/stores/cart.js koji se koristi za pohranu podataka o minijaturama u košarici, npr. koristi se u src/components/Cart.vue :32-:36 (računanje ukupne cijene minijatura u košarici)
11. asinkroni dohvat podataka s backenda, možete:
      koristiti Firebase ili Back4App, Mocky, itd.
      vlastiti storage, ili
      možete mock napraviti, držati podatke u memoriji, ali mora biti asinkroni poziv/upis
      ostvariti asinkrono (lazy, po potrebi) učitavanje nekog dijela aplikacije (stranice ili komponente)
      => Da, korišten je Mocky na kojem je spremljen popis minijatura koji se asinkrono učitava kada korisnik ode na početnu (/) stranicu. Dok se učitavaju se prikazuje "Loading..." tekst na sredini ekrana. Kod: src/components/MiniatureList.vue :18-:25
