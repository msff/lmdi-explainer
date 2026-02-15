import katex from 'katex';
import 'katex/dist/katex.min.css';

interface Props {
  tex: string;
  display?: boolean;
}

export function Formula({ tex, display = false }: Props) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
  });
  return (
    <span
      className={display ? 'formula-block' : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
