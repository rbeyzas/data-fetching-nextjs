- React'ta kullanıcıların ekranda bir veri görebilmesi için uygulamanın yüklenmesi gerekiyor. Localde çalıştığımızda bir fark göremeyebiliriz ancak büyük projelerde backend'den veri çektiğimizde bu süre 1-2 saniye uzayabilir.
- React uygulamasında view source code dediğimizde detaylı olmayan bir html koduyla karşılaşırız.
  Google gibi arama motorlarının içeriğinizden haberdar olması gereken bir uygulama oluşturuyorsanız sorun yaşarsınız çünkü başlangıçta sunucu tarafından reddedilmek üzere geri gönderilen bu HTML kodu detaylı olmayan bir koddur. Yani içeriğimiz önemliyse ve arama motorlarının geri gönderilen içeriği görmesini ve dizine eklemesini istiyorsak, bu kötü bir durumdur. Bir admin dashboard için bu durum önemli değildir ama bir blog shop gibi siteler için SEO anlamında bu önemlidir. Next.js bu sorunu çözmemizi sağlar.

## Page Pre-Rendering Nedir?

- react'ta bir sayfa ilk defa yüklendiğinde boş bir html dosyası yüklenir. Javascript sonradan yüklenir ekrana veriler gelir. Bu çok hızlı gerçekleir kullanıcı bunu pek hissetmez. Ama sonradan ihtiyaç duyulan bir veri bir sunucu tarafından yüklenir. Bu biraz zaman alabilir.
- Ama Next.js'te önceden oluşturulmuş (pre-render) bir page gösterilir. İhtiyaç duyulan tüm veriler ile birlikte html içeriği önceden oluşturulmuş olur. Bu durum SEO için çok iyidir.
- Sayfa açıldıktan sonra js kodu tekrar gönderilecektir ve önceden oluşturulmuş sayfayı devralacak ve yine react çalışacak. (hydrate with react code once loaded) Bu sayede etkileşimli bir sayfamız ve uygulamamız olmuş olacak.
- Next.js'te 2 tane pre-rendering biçimi vardır: Static generation(recommend)(tüm sayfalar önceden oluşturulmuştur.) ve Server-side rendering (burada sayfalar sayfaya request atıldığı anda oluşturulur.)

## Static Generation

- Page pre-rendering ile ilgili en önemli olan konu static generation'dır. Bu teknik sayfa yüklenmeden önce render edilmesi anlamına gelir ve sunucudaki işlem yapmadan HTML kodunu oluşturup, istekte bulun URL’ye göre doğru HTML’yi vererek bunu istemciye teslim etmektedir. Bu sayede daha az trafik olarak sunucuda işlem yapan yazılım çalışmasını engeller ve performansı artar.
- Bir sayfa için tüm verileri sunucuda oluşturup, istemciye göndererek yükleme süresini azalarak performansını artırmaktadır.
- Veriler sunucudan geçer ve herhangi bir etkileşimli işlem gerçekleşmemesi durumunda sayfaya erişildikten sonra hiçbir zaman yeniden gelmesine gerek kalmaz.
- Sayfanın statik olarak oluşturulmasına rağmen, bazı veriler (örneğin: saat) değiş diyebilir. Bu noktalarda, `getServerData` fonksiyonu kullanılabilir.
- React uygulamasının server tarafındaki tüm işlemleri tamamen client tarafına bırakarak, kullanıcıya görünen sayfa sunucuda oluşturulmuyor ve sadece verileri getirebilmektedir.
- Bu yöntem sayesinde, herhangi bir veri değişikliğinden sonra sayfayı hemen güncelleriz.
- Ancak bu yöntemin farkı, istekler arasında verilerin değişmemesi ve tüm sayfa iletişimi sunucudan geçecek şekilde ayarlanmasıdır.
- Projeyi deploy ettiğimiz zaman sayfalar sunucu tarafından önbelleğe alınır(CDN tarafından) bu sayede gelen requestler sayfada anında sunulur.
- Peki sayfamızın static generation ile çalışacağını nasıl söyleriz? `export async function getStaticProps(context) {}` ile yaparız.
- Bu fonksiyonda, istemci tarafı kodunu çalıştırmazsınız, bununla sınırlı değilsiniz ve belirli istemci tarafı API'sine erişiminiz yoktur, mesela wimndow nesnesine erişiminiz yoktur, ancak bunun yerine normalde yalnızca sunucu tarafında çalışacak olan istediğiniz herhangi bir kodu çalıştırabilirsiniz. Daha da iyisi, bu getStaticProps işlevinin içine yazdığınız kod, müşterilerinize geri gönderilen kod paketine dahil edilmeyecektir. Dolayısıyla, örneğin veritabanı kimlik bilgilerini içeren bir kodunuz varsa, genellikle bu kimlik bilgilerinin istemci tarafında açığa çıkmasını istemezsiniz. Bunu getStaticProps'un içine güvenle yazabilirsiniz çünkü bu kod hiçbir zaman istemci tarafına geçmeyecektir.
- .next klasörü içerisinde pre-render ile hazırlanmış dosyaları bulabiliriz.
