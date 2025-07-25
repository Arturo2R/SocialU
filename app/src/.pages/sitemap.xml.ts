import config from '../config'
import {db} from '../firebase'
import {PATH} from '../constants'

const { domain } = config()

function generateSiteMap(posts:Post[]) {

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://${domain}</loc>
     </url>
     <url>
       <loc>https://${domain}/privacidad</loc>
     </url>
     <url>
       <loc>https://${domain}/sobre-nosotros</loc>
     </url>
     <url>
       <loc>https://${domain}/terminos-y-condiciones</loc>
     </url>
     ${posts
      .map((item) => {
        return `
       <url>
           <loc>${`https://${domain}/${item.anonimo ? 'anonimo' : item.userName}/${item.id}`}</loc>
       </url>
     `
      })
      .join('')
    }
   </urlset >
  `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const { collection, getDocs, limit, orderBy, query:fsquery } = await import("@firebase/firestore");

  const q = fsquery(
    collection(db, PATH),
    orderBy("createdAt", "desc"),
    limit(1000)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc?.data()?.createdAt?.toJSON(),
    ...(doc.data().date && { date: doc?.data()?.date?.toJSON() }),
    ...(doc.data().time && {
      time: JSON.stringify(doc?.data()?.time),
    }),
    ...(doc.data().comentarios && { comentarios: JSON.stringify(doc.data().comentarios)}),
    ...(doc.data().computedDate && {
      computedDate: doc?.data()?.computedDate?.toJSON(),
    }),
  }));

  // console.log(data)
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(data)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap