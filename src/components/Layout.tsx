import type { PropsWithChildren } from "npm:@types/react";

type Props = {
  title?: string;
  styles?: JSX.Element | null
  scripts?: JSX.Element | null
};

export function Layout({ title, children, styles = null, scripts = null }: PropsWithChildren<Props>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `Web Api Playground - ${title}` : 'Web Api Playground'}</title>
        <link rel="stylesheet" href="style.css" />
        {styles}
      </head>
      <body>{children}</body>
      {scripts}
    </html>
  );
}
