import path from 'path';
import fs from 'fs/promises';

import { Fragment } from 'react';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  //   console.log(context);
  const { params } = context;

  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));
  // pathsWithParams içerisindeki değerler oluşturulacak

  return {
    paths: pathsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;

// Şimdi yine tabi ki buraya standart React kodunu yazabilir ve bu ürün verilerini sağlayabilecek bazı sunuculara bir HTTP isteği göndermek için useEffect'i kullanabiliriz.
// Ancak daha sonra, bu sayfa ilk kez oluşturulduğunda bu verilerin orada olmazsa arama motorları veriyi göremez, o yüzden burada yapacağımız şey bu değil.
//Bunun yerine burada yapacağımız şey async prop fonksiyonunu kullanacağız. Böylece bu async olarak getStaticProps'a aktaracağız.

// önceden query parametresi ile yapmıştık. şimdi ise dinamik route ile yapacağız. bu sebepten context içerisinde params objesini kullanacağız. context içerisinde params objesi varsa dinamik route kullanılmış demektir.
// burası dinamik bir sayfa. getStaticProps önceden kaç tane sayfa oluşturacağını bilmediği için hata verir. bunu da getStaticPaths ile çözeriz.
// [pid] şeklinde dinamik bir page olduğu için getStaticPaths() fonksiyonunu kullanmamız gerekiyor. getStaticPaths() fonksiyonu getStaticProps() fonksiyonu gibi async bir fonksiyondur.
// getStaticPaths() fonksiyonu içerisinde paths ve fallback key'leri olmalıdır. paths key'i bir array olmalıdır. fallback key'i ise boolean olmalıdır.
// fallback key'i false ise getStaticPaths() fonksiyonu içerisindeki paths array'indeki her bir obje için bir sayfa oluşturulur. fallback key'i true ise getStaticPaths() fonksiyonu içerisindeki paths array'indeki her bir obje için bir sayfa oluşturulmaz.
// anasayfadayken bile yani route / iken p1, p2, p3 sayfalarını bize getirmiş olur. bunu anasayfadayken networks kısmından görebiliriz.
// p1 route'una gittiğimizde de p2.json ve p3.json da gelmiş olur. aslında veriler ilk kez yüklendiğinde ve sitede gezindiğimizde single page bir uygulamada gezinmiş oluruz.

// nadiren ziyaret edilen sayflarımız olabilir. bu sayfaların hepsini oluşturmak yerine sadece ziyaret edilen sayfaları oluşturmak için fallback key'ini true yaparız. bu sayede ziyaret edilen sayfalar oluşturulurken diğer sayfalar oluşturulmaz. bu sayede daha az sayfa oluşturulur ve daha az veri yüklenir.
// fallback true olduğunda pathsWithParams içerisnde yazılı olmayan sayfalarda hemen gösterilir. bunun amacı fallback ile buraya yazılmamış sayfaların olduğunu da söylemiş oluyoruz. o sayfalar önceden oluşturulmaz. request atılınca oluşturulur. bu sayede daha az sayfa oluşturulur ve daha az veri yüklenir.
// bizim örneğimizde mesela p3 ürününe link ile tıklayarak gidiyor. o esnada eğer önceden sayfa oluşturulmamışsa oluşturma zamanı tanınıyor. ama direkt url e yazarak gidersek sayfa oluşturulmuyor. ve karşımıza bu duurmda hata çıkar. bunu önlemek için aşağıdaki kodu ekledik.
// if (!loadedProduct) {
//     return <p>Loading...</p>;
//   }

// bu kod sayesinde sayfa oluşturulmadan önce fallback true olduğu için sayfa oluşturulmadan önce loading yazısı gösterilir. sayfa oluşturulduktan sonra ise sayfa gösterilir. bu sayede hata almamış oluruz.
