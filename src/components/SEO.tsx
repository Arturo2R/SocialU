import Head from "next/head";
import configData from "../config";

const config = configData();

interface SEOp {
  description: string;
  title: string;
  mainImage?: string;
  canonical: string;
  twitterCreator?: string;
}

const SEO = ({
  description,
  title,
  mainImage,
  canonical,
  twitterCreator,
}: SEOp) => {
  const url = "https://" + config.domain + canonical;

  // function addProductJsonLd() {
  //   return {
  //     __html: `
  //     {
  //     "@context": "https://www.schema.org",
  //     "@type": "RealEstateAgent",
  //     "name": "${config.siteName}",
  //     "url": "${url}",
  //     "logo": "${config.logo}",
  //     "image": "${mainImage}",
  //     "description": "${description}",
  //     "address": {
  //       "@type": "PostalAddress",
  //       "streetAddress": "${config.bussiness.address}",
  //       "addressLocality": "Barranquilla",
  //       "addressRegion": "Atlántico",
  //       "postalCode": "080020",
  //       "addressCountry": "Colombia"
  //     },
  //     "openingHours": "Mo, Tu, We, Th, Fr 08:00-16:30 Sa 08:00-11:30",
  //     "contactPoint": {
  //       "@type": "ContactPoint",
  //       "telephone": "${config.bussiness.tel}",
  //       "contactType": "Phone"
  //     }
  //   }
  //     `,
  //   };
  // }

  //   <script type="application/ld+json">
  // {
  //   "@context": "https://schema.org",
  //   "@type": "BlogPosting",
  //   "mainEntityOfPage": {
  //     "@type": "WebPage",
  //     "@id": "url"
  //   },
  //   "headline": "Headline",
  //   "description": "description of the image",
  //   "image": [
  //     "imageUrl#1",
  //     "ImageUrl#2"
  //   ],
  //   "author": {
  //     "@type": "Person",
  //     "name": "Autor Name",
  //     "url": "Autor URL"
  //   },
  //   "publisher": {
  //     "@type": "Organization",
  //     "name": "Social-U",
  //     "logo": {
  //       "@type": "ImageObject",
  //       "url": "/logo.png"
  //     }
  //   },
  //   "datePublished": "2022-04-16",
  //   "dateModified": "2022-04-16"
  // }
  // </script>

  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <title>{`${title} | ${config.siteName}`}</title>
      <meta name="description" content={description} />
      <link
        rel="canonical"
        href={`https://${config.domain}${canonical}`}
        key="canonical"
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      {mainImage && <meta property="og:image" content={mainImage} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={config.siteName} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@socialu" />
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addProductJsonLd()}
        key="product-jsonld"
      /> */}
    </Head>
  );
};

SEO.defaultProps = {
  title: "Eso Pasó",
  description: "La Cosa",
  canonical: "",
  mainImage: "/barrios.jpg",
};

export default SEO;
