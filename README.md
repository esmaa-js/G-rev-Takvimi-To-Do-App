# Görev Takvimi & Not Yönetim Uygulaması

Bu proje, kullanıcıların hem tarih bazlı görevlerini takvim üzerinde takip edebileceği hem de kategori bazlı notlar ekleyip yönetebileceği etkileşimli ve modern bir görev takip sistemidir. Web tarayıcısı üzerinden çalışan bu uygulama tamamen **LocalStorage** üzerinde çalışır ve hiçbir sunucu bağlantısı gerektirmez.

## 🚀 Özellikler

### 📆 Takvim Bazlı Görev Yönetimi
- Ay görünümünde interaktif takvim
- Belirli günlere görev ekleyebilme
- Görevleri tamamlama, silme veya arşivleme
- Takvimden kolay tarih seçimi ve görselleştirme

### 🗂️ Notlar Sayfası (Kategori Bazlı Görevler)
- Kategori oluşturma ve silme
- Her kategoriye özel görev listesi
- Görevleri tamamlandı, çöpe veya arşive taşıma
- Geri alma işlemleriyle esnek yönetim

### 🗃️ Arşiv ve Çöp Kutusu
- Görevlerin silinmeden önce saklandığı bölümler
- Her iki alandan geri alma imkânı
- Kalıcı silme işlemleriyle sadeleştirme

### 🎨 Modern ve Duyarlı Arayüz
- Masaüstü, tablet ve mobil cihazlar için tam uyumlu tasarım
- Sidebar’da animasyonlu renkli toplar (canvas)
- Kullanıcı dostu butonlar ve yönlendirmeler

## 🧩 Dosya Yapısı

```
to-do-app/
├── index.html          # Ana HTML yapısı
├── style.css           # Genel stil dosyası
├── responsive.css      # Responsive (mobil/tablet) uyumluluklar
├── script.js           # Takvim ve genel görev fonksiyonları
├── notes.js            # Notlar/Kategoriler sayfası işlevleri
└── README.md           # Proje dokümantasyonu
```

## 🛠️ Kurulum ve Kullanım

1. Bu projeyi indir veya klonla:
   ```bash
   git clone https://github.com/kullaniciadi/to-do-app.git
   ```

2. İndirilen klasörde `index.html` dosyasını çift tıklayarak tarayıcıda aç.

3. Görevlerini takvimden veya notlar bölümünden eklemeye başla.

## 💾 Veri Saklama

Tüm veriler tarayıcıdaki **LocalStorage** içinde saklanır. Bu sayede uygulama çevrimdışı da çalışabilir. Ancak tarayıcı verileri temizlenirse görevler de silinir.

## 📱 Responsive Tasarım

`responsive.css` dosyası sayesinde uygulama:
- Mobil cihazlar (480px'e kadar)
- Tablet cihazlar (481px - 768px)
- Büyük ekranlar (769px ve üzeri) için optimize edilmiştir.

## 👩‍💻 Katkı ve Geliştirme

Kod yapısı basit ve yorumludur. Projeyi geliştirmek istersen:

- Yeni özellik eklemek için `script.js` veya `notes.js` dosyalarını düzenleyebilirsin.
- Yeni tema veya stil değişiklikleri için `style.css` ve `responsive.css` dosyalarını kullanabilirsin.

## 📬 İletişim

Proje geliştiricisi: **Esma Yıldız**  
📧 esma@esmayildiz.com.tr

---

Bu proje öğrenme amaçlı geliştirilmiştir. Tüm hakları saklıdır.
