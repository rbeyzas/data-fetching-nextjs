import path from 'path';
import fs from 'fs/promises';

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  // JSON verilerini javascript nesnesine dönüştürür.
  return {
    props: {
      products: data.products,
    },
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
