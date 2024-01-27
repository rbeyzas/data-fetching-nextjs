import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link';

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  // JSON verilerini javascript nesnesine dönüştürür.

  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }
  // redirect özel bir key'dir. Eğer redirect true ise yönlendirme yapılır. mesela verileri geitrememişsek kullanıcıyı başka yere yönlendirebiliriz.
  if (data.products.length === 0) {
    return { notFound: true };
  }
  // notFound özel bir key'dir. Eğer notFound true ise 404 sayfası gösterilir.
  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}
export default HomePage;

// getStaticProps() önce props döndürür, sonra sayfayı render eder.
// return {
//   props: {
//     products: [
//       { id: 'p1', title: 'Product 1' },
//       { id: 'p2', title: 'Product 2' },
//     ],
//   },
// };
// props'un içi obje olmalı.
// getStaticProps içerisine kaç tane product koyarsak sayfada onşlar görünür. sebebi ise getStaticProps sayfa render edilmeden önce çalıştığı için sayfa render edilmeden önce props'u döndürür.
//cwd "geçerli çalışma dizini" anlamına gelir.
