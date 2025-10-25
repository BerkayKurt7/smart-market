document.addEventListener("DOMContentLoaded", () => {
  // 🧩 Element Seçimleri
  const urunAdi = document.getElementById("urunAdi");
  const urunFiyat = document.getElementById("urunFiyat");
  const ekleBtn = document.getElementById("ekleBtn");
  const urunListesi = document.getElementById("urunListesi");
  const toplamDiv = document.getElementById("toplam");
  const darkModeBtn = document.getElementById("darkModeBtn");
  const ortalamaP = document.getElementById("ortalama");
  const maxUrunP = document.getElementById("maxUrun");
  const urunSayisiDiv = document.getElementById("urunSayisi");
  const bosMesaj = document.getElementById("bosMesaj");
  const minFiyatInput = document.getElementById("minFiyat");
  const filtreBtn = document.getElementById("filtreBtn");
  const temizleFiltreBtn = document.getElementById("temizleFiltre");

  // 💾 LocalStorage'dan veri yükle
  let urunler = JSON.parse(localStorage.getItem("urunler")) || [];

  // 🌙 Tema durumunu yükle
  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
  }

  // 🛒 Ürün Ekleme
  function urunEkle() {
    const ad = urunAdi.value.trim();
    const fiyat = parseFloat(urunFiyat.value);

    if (!ad || isNaN(fiyat)) {
      alert("Lütfen geçerli ürün adı ve fiyat girin!");
      return;
    }

    const yeniUrun = { ad, fiyat };
    urunler.push(yeniUrun);

    urunGuncelle();
    urunAdi.value = "";
    urunFiyat.value = "";
  }

  // 🔁 Liste ve İstatistik Güncelleme
  function urunGuncelle() {
    urunListesi.innerHTML = "";

    urunler.forEach((urun, index) => {
      const li = document.createElement("li");
      li.textContent = `${urun.ad} - ${urun.fiyat}₺`;

      const silBtn = document.createElement("button");
      silBtn.textContent = "❌";
      silBtn.addEventListener("click", () => urunSil(index));

      li.appendChild(silBtn);
      urunListesi.appendChild(li);
    });

    // 💰 Toplam - Ortalama - En Pahalı Ürün
    const toplam = urunler.reduce((a, b) => a + b.fiyat, 0);
    const ortalama = urunler.length
      ? (toplam / urunler.length).toFixed(2)
      : 0;

    const enPahali = urunler.length
      ? urunler.reduce((max, urun) =>
          urun.fiyat > max.fiyat ? urun : max
        )
      : { ad: "-", fiyat: 0 };

    toplamDiv.textContent = `Toplam: ${toplam}₺`;
    ortalamaP.textContent = `Ortalama: ${ortalama}₺`;
    maxUrunP.textContent = `En pahalı: ${enPahali.ad} (${enPahali.fiyat}₺)`;

    // 📊 Ürün Sayısı ve Boş Liste Mesajı
    urunSayisiDiv.textContent = `Toplam ürün: ${urunler.length}`;
    bosMesaj.style.display = urunler.length === 0 ? "block" : "none";

    // 💾 Güncel veriyi kaydet
    localStorage.setItem("urunler", JSON.stringify(urunler));
  }

  // ❌ Ürün Silme
  function urunSil(index) {
    urunler.splice(index, 1);
    urunGuncelle();
  }

  // 🌙 Karanlık Mod
  function karanlikMod() {
    document.body.classList.toggle("dark");
    const aktifMi = document.body.classList.contains("dark");
    localStorage.setItem("tema", aktifMi ? "dark" : "light");
  }

  // 🔍 Fiyat Filtreleme
  function urunFiltrele() {
    const min = parseFloat(minFiyatInput.value);
    if (isNaN(min)) {
      alert("Geçerli bir minimum fiyat girin!");
      return;
    }

    const filtreli = urunler.filter((u) => u.fiyat >= min);
    urunListesi.innerHTML = "";

    filtreli.forEach((urun) => {
      const li = document.createElement("li");
      li.textContent = `${urun.ad} - ${urun.fiyat}₺`;
      urunListesi.appendChild(li);
    });
  }

  // 🔄 Filtre Temizleme
  function filtreTemizle() {
    minFiyatInput.value = "";
    urunGuncelle();
  }

  // ⚙️ Event Listeners
  ekleBtn.addEventListener("click", urunEkle);
  darkModeBtn.addEventListener("click", karanlikMod);
  filtreBtn.addEventListener("click", urunFiltrele);
  temizleFiltreBtn.addEventListener("click", filtreTemizle);

  // 🚀 Sayfa yüklendiğinde listeyi göster
  urunGuncelle();
});
