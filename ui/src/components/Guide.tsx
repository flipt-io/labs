/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */

import { Button } from "./Button";

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
  ) => <p className="mb-4" {...props} />,
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
      className="rounded bg-gray-900 px-2 py-1 font-mono text-sm font-thin text-white"
      {...props}
    />
  ),
  strong: (
    props: React.JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLElement> &
      React.HTMLAttributes<HTMLElement>
  ) => <strong className="font-medium" {...props} />,
};

type GuideProps = {
  stage: string;
  page: string;
  next: () => void;
  prev: () => void;
};

export default function Guide(props: GuideProps) {
  const { stage, page, next, prev } = props;
  /* eslint-disable import/no-webpack-loader-syntax */
  const Page =
    require(`!babel-loader!@mdx-js/loader!../content/${stage}/${page}.mdx`).default;

  return (
    <div className="flex flex-col">
      <Page components={components} />
      <div className="mt-5 flex flex-row justify-between">
        <Button className="px-5 py-3 text-xl font-thin" onClick={prev}>
          Back
        </Button>
        <Button className="px-5 py-3 text-xl font-thin" onClick={next}>
          Next
        </Button>
      </div>
    </div>
  );
}
