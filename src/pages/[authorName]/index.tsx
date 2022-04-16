import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout/Layout";

type Props = {};

const AuthorPage = (props: Props) => {
  const router = useRouter();
  const { authorName } = router.query;
  return (
    <Layout>
      <div>AuthorPage of: {authorName}</div>
    </Layout>
  );
};

export default AuthorPage;
