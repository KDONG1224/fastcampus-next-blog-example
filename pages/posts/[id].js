import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import { useRouter } from 'next/router';
import Date from '../../components/Date';
import { MDXRemote } from 'next-mdx-remote';
import CodeBlock from '../../components/CodeBlock';

// dynamic import
// import Button from '../../components/Button';
import dynamic from 'next/dynamic';
import { siteTitle } from 'pages/_document';

const Button = dynamic(() => import('../../components/Button'), {
  loading: <div>Loading...</div>
});

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params, preview }) {
  // consoel.log('>>>>>> ', preview);

  const postData = await getPostData(params.id);
  return {
    props: {
      postData
    }
  };
}

const components = { Button, CodeBlock };

export default function Post({ postData, pathname }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Head>
        <title>{`${postData.title} - ${siteTitle}`}</title>
      </Head>
      <article>
        <h2>pathname : {pathname}</h2>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {postData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        )}
        {postData.mdxSource && (
          <MDXRemote {...postData.mdxSource} components={components} />
        )}
      </article>
    </>
  );
}
