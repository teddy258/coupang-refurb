import { NextPage } from "next";

const Redirect: NextPage = () => null;

Redirect.getInitialProps = async ({ res, query }) => {
  res.writeHead(302, { Location: `https://link.coupang.com/${query.code}/${query.id}` });
  res.end();
};

export default Redirect;
