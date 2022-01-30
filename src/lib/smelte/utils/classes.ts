interface IUtils {
  bg: IStringFunc;
  border: IStringFunc;
  txt: IStringFunc;
  caret: IStringFunc;
}

type IStringFunc = (s: string) => string;

const noDepth = ['white', 'black', 'transparent'];

function getClass(prop, color, depth, defaultDepth): string {
  if (noDepth.includes(color)) {
    return `${prop}-${color}`;
  }
  return `${prop}-${color}-${depth || defaultDepth}`;
}

export default function utils(color: string, defaultDepth = 500): IUtils {
  return {
    bg: (depth) => getClass('bg', color, depth, defaultDepth),
    border: (depth) => getClass('border', color, depth, defaultDepth),
    txt: (depth) => getClass('text', color, depth, defaultDepth),
    caret: (depth) => getClass('caret', color, depth, defaultDepth),
  };
}

export class ClassBuilder {
  defaults: string;
  classes: string;

  constructor(classes: string | IStringFunc, defaultClasses: string) {
    this.defaults =
      (typeof classes === 'function' ? classes(defaultClasses) : classes) || defaultClasses;

    this.classes = this.defaults;
  }

  flush(): ClassBuilder {
    this.classes = this.defaults;

    return this;
  }

  extend(...fns: unknown[]): ClassBuilder {
    return this;
  }

  get(): string {
    return this.classes;
  }

  replace(classes: Record<string, string>, cond = true): ClassBuilder {
    if (cond && classes) {
      this.classes = Object.keys(classes).reduce(
        (acc, from) => acc.replace(new RegExp(from, 'g'), classes[from]),
        this.classes,
      );
    }

    return this;
  }

  remove(classes: string, cond = true): ClassBuilder {
    if (cond && classes) {
      this.classes = classes
        .split(' ')
        .reduce((acc, cur) => acc.replace(new RegExp(cur, 'g'), ''), this.classes);
    }

    return this;
  }

  add(className: string | IStringFunc, cond = true, defaultValue?: string): ClassBuilder {
    if (!cond || !className) return this;

    switch (typeof className) {
      case 'function':
        this.classes += ` ${className(defaultValue || this.classes)} `;
        return this;
      case 'string':
      default:
        this.classes += ` ${className} `;
        return this;
    }
  }
}

const defaultReserved = ['class', 'add', 'remove', 'replace', 'value'];

export function filterProps(reserved: string[], props: unknown): unknown {
  const r = [...reserved, ...defaultReserved];

  return Object.keys(props).reduce(
    (acc, cur) =>
      cur.includes('$$') || cur.includes('Class') || r.includes(cur)
        ? acc
        : { ...acc, [cur]: props[cur] },
    {},
  );
}
