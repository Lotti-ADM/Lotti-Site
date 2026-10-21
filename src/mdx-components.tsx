import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

/**
 * Elementos do markdown dos posts. A tipografia do corpo mora em `.post-body`
 * (globals.css); aqui ficam só as trocas de comportamento.
 */
function MdxLink({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  // Link interno navega sem recarregar; externo abre em outra aba.
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  a: MdxLink,
  // Tabela larga rola dentro da própria caixa, sem empurrar a página no mobile.
  table: (props) => (
    <div className="post-table">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
