function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    props: {
      username: 'Beyza',
    },
  };
}

// res objesini manipüle edebiliriz. mesela çerez ekleyerek res'i değiştirebiliriz. next bunu bizim için yapıyor. detaylı bilgi: https://nodejs.org/api/http.html#http_class_http_serverresponse
// req ile sunucuya erişebilir ve ordan gelen verileri okuyabiliriz. detaylı bilgi: https://nodejs.org/api/http.html#http_class_http_incomingmessage
