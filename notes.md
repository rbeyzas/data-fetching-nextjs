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

## Incremental Static Generation

- Sayfa yüklenince ilk olarak statik HTML çekir
- Sayfa yüklenince gerekli verilerin alınması ve sonrasında istenilen bölümleri dinamik olarak render edebilmemize yardımcı olur. Yani 1 kere gerekli veriler alınınca sonrasında deploy geçmeye gerek kalmadan veriler güncellenmeye devam eder.
- Verilerin tamamen statik halde olduğunda performans artar.
- İstek/yanit süresini azaltabilmektedir.
- Yani bir sayfayı önceden oluşturursunuz, ancak daha sonra Next.js'ye belirli bir sayfanın gelen her istek için en fazla her X saniyede bir yeniden oluşturulması gerektiğini de söyleyebilirsiniz. Yani örneğin her 60 saniyede bir. Bu, belirli bir sayfa için bir istek yapıldığında ve diyelim ki sayfanın en son yeniden oluşturulmasından bu yana 60 saniyeden az bir süre geçmişse, mevcut sayfanın ziyaretçiye sunulacağı anlamına gelir. Ancak bu 60 saniyeyi geçtiyse ve saniye miktarı elbette size kalmış, o zaman bu sayfa sunucuda önceden oluşturulur. Bu, ya henüz o kadar eski değilse eski sayfayı sunacağınız ya da aksi takdirde sunucuda yeniden oluşturulan en son sayfayı ve yepyeni sayfayı sunacağınız anlamına gelir. Ve eğer bu sayfa güncel olmadığı için sunucuda yeniden önceden oluşturulmuşsa, o zaman bu yeni oluşturulan sayfa, sunucudaki mevcut eski sayfanın yerini alacaktır. Gelecekteki ziyaretçiler onun yerine yeniden oluşturulmuş sayfayı görecek. Tekrar 60 saniye geçene kadar, ardından yeni sayfa yeniden önceden oluşturulur. Böylece, gelen istekler için sunucuda sürekli ön işlemeye sahip olabilirsiniz.
- Bunu yapabilmek için getStaticProps içerine return içinde oluşturulan objeden sonra `revalidate` key'i eklemek. Buraya kaç saniyede bir yenienecekse o süreyi yazmalıyız. `revalidate:10` dersek 10 saniyede bir yenilenir. 10 saniye dolmadan sayfayı yenliersek re-generate edilmez. ama 10 saniye dolmuşsa sayfayı yenilediğimizde re-generate edilir.
  ![isr](https://raw.githubusercontent.com/rbeyzas/data-fetching-nextjs/main/isr.png)

## Server-side Rendering

- getStaticProps ile gerçekten gelen requeste erişimimiz yok.
- Ancak bazen statik oluşturma yeterli olmaz ve bunun yerine gerçek sunucu tarafı işlemeye ihtiyaç duyarsınız; bu, gelen her istek için bir sayfayı önceden işlemeniz gerektiği anlamına gelir. Yani en fazla her saniye değil, aslında her gelen istek için ve/veya sunucuya ulaşan somut istek nesnesine erişmeniz gerekir. Mesela çerez göstermeniz gerekebilir.
- NextJS ayrıca bu çalıştırma gerçek sunucu tarafı kod kullanım durumunu da destekler; bu, size sayfa bileşeni dosyalarınıza ekleyebileceğiniz bir işlev sağladığı anlamına gelir; bu, daha sonra bu sayfa için bir istek sunucuya ulaştığında gerçekten yürütülür. Yani bu, derleme süresi boyunca veya her birkaç saniyede bir önceden oluşturulmaz, ancak gerçekte yalnızca sunucuda çalışan, yani yalnızca siz onu deploy ettikten sonra çalışan ve daha sonra gelen her istek için yeniden yürütülen koddur.
- `export async function getServerSideProps() {}`
- getServerSideProps; notFound ve redirect gibi key'lere sahip olabilir. revalidate key gerekli değildir. Belirli bir saniye vermeye gerek yok çünkü getServerSideProps her zaman çalışacaktır.
- getStaticpaths kullanmayız.
- burada kullanıcılar tamamlanmış bir sayfa görecekler yani tüm veriler güncel olacak bu sebepten bunu kullanmak kullanıcı deneyimi açısından daha mantıklı

## Client-side Data Fetching

- Bu şu ana kadar yaptıklarımızın tam tersi
- Bunu kullanmamız gereken yerler yüksek frekansla değişen veriler olabilir. Örneğin, bir sayfada gösterdiğiniz stok verileriniz varsa ve bu veriler saniyede birden çok kez değişiyorsa, bu sayfayı ziyaret ettiğinizde her zaman güncel olmayan verileri göreceğinizden, ön getirme ve ön işleme pek mantıklı gelmeyebilir. Dolayısıyla böyle bir durumda, sayfayı ziyaret ettiğinizde sadece spinner göstermek ve ardından sizin için en son verileri getirmek ve belki de bu verileri arka planda güncellemek en iyi kullanıcı deneyimi olabilir. Başka bir örnek, oldukça kullanıcıya özel veriler olabilir. Örneğin, bir çevrimiçi mağazadaki son siparişler. Hesabınızda ve kullanıcı profilinizdeyseniz ve bu verileri görüntülüyorsanız, bu, aslında bir sayfayı önceden oluşturmamızın gerekmediği bir örnek olabilir. Kesinlikle arama motorları için değil çünkü özel profilinizi görmeyecekler ve ayrıca kullanıcı deneyimi için de geçerli değil. çünkü bu sayfaya gidersek, verilerin istemciye yüklenmesi için bir saniye beklemekten daha fazlası olabiliriz ve sayfada daha hızlı gezinmek, verilerin başlangıçtan itibaren mevcut olmasından daha önemli olabilir. Veya kısmi verilerinizin olduğu bir durumu düşünün. Diyelim ki birçok farklı veri parçasına, birçok farklı türde veriye sahip bir kontrol paneli sayfanız var; böyle bir durumda, genel kontrol panelini oluşturan tüm bu farklı parçaları yüklemek, eğer bunu sunucuda yapın ve derleme süresi boyunca statik olarak önceden oluşturmak da mantıklı olmayabilir çünkü bunlar kişisel verilerdir veya çok değişmektedir. Dolayısıyla böyle bir senaryoda, kullanıcı o sayfaya gittiğinde, normal react uygulamasının içinden bu verileri istemciye getirmek muhtemelen mantıklı olacaktır.
