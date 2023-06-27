/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect } from "react";
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js";
import CodeBlock from "./CodeBlock";

const components = {
  h1: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => (
    <h1
      className="text-3xl font-bold capitalize underline decoration-violet-400/[.85] decoration-2 underline-offset-4"
      {...props}
    />
  ),
  h2: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => <h2 className="text-2xl font-bold capitalize" {...props} />,
  h3: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => <h3 className="text-xl font-bold capitalize" {...props} />,
  h4: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => <h4 className="text-lg font-bold capitalize" {...props} />,
  h5: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => <h5 className="text-base font-bold capitalize" {...props} />,
  h6: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLHeadingElement> &
      React.HTMLAttributes<HTMLHeadingElement>
  ) => <h6 className="text-sm font-bold capitalize" {...props} />,
  p: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLParagraphElement> &
      React.HTMLAttributes<HTMLParagraphElement>
  ) => <p className="" {...props} />,
  a: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLAnchorElement> &
      React.AnchorHTMLAttributes<HTMLAnchorElement>
  ) => (
    <a className="text-violet-500 no-underline hover:underline" {...props} />
  ),
  ul: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLUListElement> &
      React.HTMLAttributes<HTMLUListElement>
  ) => <ul className="ml-8 list-disc" {...props} />,
  ol: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLOListElement> &
      React.OlHTMLAttributes<HTMLOListElement>
  ) => <ol className="ml-8 list-decimal" {...props} />,
  blockquote: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLQuoteElement> &
      React.BlockquoteHTMLAttributes<HTMLQuoteElement>
  ) => (
    <blockquote
      className="border-l-4 border-violet-500 pl-4 not-italic text-gray-600"
      {...props}
    />
  ),
  code: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLElement> &
      React.HTMLAttributes<HTMLElement>
  ) => (
    <code
      className="rounded bg-[#0d1117] px-2 py-1 font-mono text-sm font-thin text-white"
      {...props}
    />
  ),
  pre: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLPreElement> &
      React.HTMLAttributes<HTMLPreElement>
  ) => <CodeBlock {...props} />,
  img: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLImageElement> &
      React.ImgHTMLAttributes<HTMLImageElement>
  ) => <img className="mx-auto shadow-lg" {...props} />,
  strong: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLElement> &
      React.HTMLAttributes<HTMLElement>
  ) => <strong className="font-medium" {...props} />,
};

type PageProps = {
  path: string;
};

export default function Page(props: PageProps) {
  const { path } = props;

  const InternalPage =
    require(`!babel-loader!@mdx-js/loader!../content/${path}.mdx`).default;

  useEffect(() => {
    window.scrollTo(0, 0);
    hljs.highlightAll();
  });

  return <InternalPage components={components} />;
}
