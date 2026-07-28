import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<code key={`${keyPrefix}-c${i}`}>{token.slice(1, -1)}</code>);
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(
        <pre key={`k${key++}`}>
          <code data-lang={lang}>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.trim().startsWith("|") && lines[i + 1]?.includes("---")) {
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim()));
        i += 1;
      }
      out.push(
        <table key={`k${key++}`}>
          <thead>
            <tr>
              {header.map((h, hi) => (
                <th key={hi}>{inline(h, `h${key}${hi}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci}>{inline(c, `c${key}${ri}${ci}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      out.push(<h3 key={`k${key++}`}>{inline(line.slice(4), `h${key}`)}</h3>);
      i += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i += 1;
      }
      out.push(<blockquote key={`k${key++}`}>{inline(buf.join(" "), `q${key}`)}</blockquote>);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        buf.push(lines[i].replace(/^\d+\.\s/, ""));
        i += 1;
      }
      out.push(
        <ol key={`k${key++}`}>
          {buf.map((b, bi) => (
            <li key={bi}>{inline(b, `o${key}${bi}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        buf.push(lines[i].slice(2));
        i += 1;
      }
      out.push(
        <ul key={`k${key++}`}>
          {buf.map((b, bi) => (
            <li key={bi}>{inline(b, `u${key}${bi}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    out.push(<p key={`k${key++}`}>{inline(line, `p${key}`)}</p>);
    i += 1;
  }

  return <div className="md text-[13.5px]">{out}</div>;
}
