/* @ds-bundle: {"format":4,"namespace":"SouvilleEditorialDesignSystem_56079d","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Label","sourcePath":"components/core/Label.jsx"},{"name":"Rule","sourcePath":"components/core/Rule.jsx"},{"name":"DisplayRow","sourcePath":"components/site/DisplayRow.jsx"},{"name":"MetaBar","sourcePath":"components/site/MetaBar.jsx"},{"name":"NavTile","sourcePath":"components/site/NavTile.jsx"},{"name":"Wordmark","sourcePath":"components/site/Wordmark.jsx"}],"sourceHashes":{"components/core/Button.jsx":"e1226a46d451","components/core/Label.jsx":"20c9d7a26b8a","components/core/Rule.jsx":"e4e5e66d8d1f","components/site/DisplayRow.jsx":"e55f87f6923a","components/site/MetaBar.jsx":"d82597370f81","components/site/NavTile.jsx":"c4cff0fe04db","components/site/Wordmark.jsx":"67392e4e2e98","ui_kits/portfolio/About.jsx":"0c83546d12fa","ui_kits/portfolio/Hero.jsx":"75ef262dfeac","ui_kits/portfolio/Projects.jsx":"90bb65af4abf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SouvilleEditorialDesignSystem_56079d = window.SouvilleEditorialDesignSystem_56079d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
const surfaces = {
  ink: {
    background: 'var(--ink-900)',
    color: 'var(--cream-100)'
  },
  cream: {
    background: 'var(--cream-100)',
    color: 'var(--ink-900)'
  },
  amber: {
    background: 'var(--amber-500)',
    color: 'var(--ink-900)'
  },
  red: {
    background: 'var(--red-500)',
    color: 'var(--cream-100)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-900)',
    boxShadow: 'inset 0 0 0 1px var(--rule-strong)'
  }
};
function Button({
  variant = 'ink',
  size = 'md',
  as = 'button',
  index,
  disabled,
  children,
  style,
  ...rest
}) {
  const pad = size === 'sm' ? '8px 14px' : size === 'lg' ? '16px 26px' : '12px 20px';
  return React.createElement(as, {
    disabled: as === 'button' ? disabled : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      justifyContent: index ? 'space-between' : 'center',
      minWidth: index ? 190 : 0,
      padding: pad,
      border: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-grotesk)',
      fontSize: 'var(--type-small)',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1,
      borderRadius: 'var(--radius-panel)',
      opacity: disabled ? 0.4 : 1,
      transition: 'opacity var(--dur-fast) var(--ease-editorial), transform var(--dur-fast) var(--ease-editorial)',
      ...surfaces[variant],
      ...style
    },
    ...rest
  }, children, index ? React.createElement('span', {
    style: {
      fontSize: 'var(--type-label)',
      opacity: 0.7
    }
  }, index) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Label.jsx
try { (() => {
function Label({
  as = 'span',
  tone = 'primary',
  children,
  style,
  ...rest
}) {
  const color = tone === 'muted' ? 'var(--text-muted)' : tone === 'inverse' ? 'var(--cream-100)' : 'var(--text-primary)';
  return React.createElement(as, {
    style: {
      fontFamily: 'var(--font-grotesk)',
      fontSize: 'var(--type-label)',
      fontWeight: 'var(--type-label-weight)',
      letterSpacing: 'var(--type-label-tracking)',
      textTransform: 'uppercase',
      lineHeight: 1,
      color,
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Label.jsx", error: String((e && e.message) || e) }); }

// components/core/Rule.jsx
try { (() => {
function Rule({
  tone = 'soft',
  style,
  ...rest
}) {
  return React.createElement('hr', {
    style: {
      border: 0,
      height: 1,
      margin: 0,
      width: '100%',
      background: tone === 'ink' ? 'var(--rule-strong)' : 'var(--rule)',
      ...style
    },
    ...rest
  });
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rule.jsx", error: String((e && e.message) || e) }); }

// components/site/DisplayRow.jsx
try { (() => {
function DisplayRow({
  left,
  right,
  center,
  size = 'var(--type-display-1)',
  rule = true,
  style,
  ...rest
}) {
  const t = {
    fontFamily: 'var(--font-grotesk)',
    fontWeight: 400,
    fontSize: size,
    lineHeight: 'var(--type-display-lh)',
    letterSpacing: 'var(--type-display-tracking)',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap'
  };
  return React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'end',
      gap: 'var(--gutter)',
      borderBottom: rule ? 'var(--hairline)' : 'none',
      paddingBottom: 'var(--space-2)',
      ...style
    },
    ...rest
  }, React.createElement('div', {
    style: {
      minWidth: 0
    }
  }, React.createElement('span', {
    style: {
      ...t,
      display: 'block'
    }
  }, left)), React.createElement('div', {
    style: {
      minWidth: 0,
      letterSpacing: 'normal',
      fontSize: 'var(--type-body)',
      lineHeight: 'var(--type-body-lh)'
    }
  }, center), React.createElement('div', {
    style: {
      minWidth: 0,
      textAlign: 'right'
    }
  }, React.createElement('span', {
    style: {
      ...t,
      display: 'block'
    }
  }, right)));
}
Object.assign(__ds_scope, { DisplayRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/DisplayRow.jsx", error: String((e && e.message) || e) }); }

// components/site/MetaBar.jsx
try { (() => {
function MetaBar({
  items = [],
  columns,
  style,
  ...rest
}) {
  return React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: columns || `repeat(${Math.max(items.length, 1)},1fr)`,
      alignItems: 'baseline',
      gap: 'var(--space-4)',
      borderTop: 'var(--hairline-ink)',
      padding: 'var(--row-pad-y) 0',
      ...style
    },
    ...rest
  }, items.map((it, i) => React.createElement('div', {
    key: i,
    style: {
      textAlign: i === items.length - 1 ? 'right' : i === 0 ? 'left' : 'left'
    }
  }, it.href ? React.createElement('a', {
    href: it.href,
    style: {
      borderBottom: 0
    }
  }, React.createElement(__ds_scope.Label, null, it.label)) : React.createElement(__ds_scope.Label, null, it.label))));
}
Object.assign(__ds_scope, { MetaBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/MetaBar.jsx", error: String((e && e.message) || e) }); }

// components/site/NavTile.jsx
try { (() => {
const tones = {
  cream: {
    background: 'var(--cream-100)',
    color: 'var(--ink-900)'
  },
  amber: {
    background: 'var(--amber-500)',
    color: 'var(--ink-900)'
  },
  red: {
    background: 'var(--red-500)',
    color: 'var(--cream-100)'
  },
  ink: {
    background: 'var(--ink-900)',
    color: 'var(--cream-100)'
  }
};
function NavTile({
  label,
  index,
  tone = 'cream',
  height = 140,
  href = '#',
  style,
  ...rest
}) {
  return React.createElement('a', {
    href,
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height,
      padding: '0 var(--space-4) 12px',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-panel-lg)',
      border: 0,
      textDecoration: 'none',
      fontFamily: 'var(--font-grotesk)',
      fontSize: 'var(--type-small)',
      letterSpacing: 'normal',
      lineHeight: 1,
      transition: 'transform var(--dur-base) var(--ease-editorial)',
      ...tones[tone],
      ...style
    },
    ...rest
  }, React.createElement('span', {
    style: {
      letterSpacing: 'normal',
      fontSize: 'var(--type-small)',
      lineHeight: 1
    }
  }, label), React.createElement('span', {
    style: {
      fontSize: 'var(--type-label)',
      letterSpacing: 'var(--type-label-tracking)'
    }
  }, index));
}
Object.assign(__ds_scope, { NavTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/NavTile.jsx", error: String((e && e.message) || e) }); }

// components/site/Wordmark.jsx
try { (() => {
function Wordmark({
  first = 'Constance',
  last = 'Souville',
  size,
  split = true,
  style,
  ...rest
}) {
  const type = {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: size || 'var(--type-wordmark-size)',
    lineHeight: 'var(--type-wordmark-lh)',
    letterSpacing: 'var(--type-wordmark-tracking)',
    color: 'var(--text-primary)'
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: split ? 'space-between' : 'flex-start',
      gap: 'var(--space-6)',
      alignItems: 'baseline',
      ...type,
      ...style
    },
    ...rest
  }, React.createElement('span', null, first), React.createElement('span', null, last));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/Wordmark.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/About.jsx
try { (() => {
const {
  Label,
  Rule,
  Button
} = window.SouvilleEditorialDesignSystem_56079d;
function About() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    tone: "ink"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(Label, null, "About"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-grotesk)',
      fontSize: 'var(--type-lead)',
      lineHeight: 1.35,
      letterSpacing: '-.01em',
      textWrap: 'pretty'
    }
  }, "I build calm, fast, typographically serious websites. Nine years in, mostly agency-side, currently pushing pixels at LG2 in Montreal."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-secondary)',
      maxWidth: '52ch',
      textWrap: 'pretty'
    }
  }, "French by birth, Montrealer by choice. I care about the parts nobody screenshots: focus states, reduced motion, and a build that still loads on a train."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "cream"
  }, "R\xE9sum\xE9"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    as: "a",
    href: "mailto:hello@souville.dev"
  }, "hello@souville.dev")))));
}
Object.assign(window, {
  About
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Hero.jsx
try { (() => {
const {
  Wordmark,
  MetaBar,
  NavTile,
  Label
} = window.SouvilleEditorialDesignSystem_56079d;
function Clock() {
  const [t, setT] = React.useState('');
  React.useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Toronto'
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return /*#__PURE__*/React.createElement("span", null, "Montreal\xA0\xA0", t);
}
function HeadRow({
  left,
  right,
  center,
  size
}) {
  const t = {
    fontFamily: 'var(--font-grotesk)',
    fontSize: size,
    lineHeight: .9,
    letterSpacing: '-.035em',
    whiteSpace: 'nowrap'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr minmax(0,22%) 1fr',
      alignItems: 'end',
      gap: 'var(--gutter)',
      borderBottom: '1px solid var(--rule)',
      paddingBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...t,
      display: 'block'
    }
  }, left)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      letterSpacing: 'normal',
      fontSize: 'var(--type-body)',
      lineHeight: 'var(--type-body-lh)'
    }
  }, center), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...t,
      display: 'block'
    }
  }, right)));
}
function Hero({
  onNav
}) {
  const size = 'clamp(2.5rem,7.6vw,7.2rem)';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement(MetaBar, {
    items: [{
      label: 'Front-end web developer'
    }, {
      label: 'Pushing pixels @ LG2'
    }, {
      label: 'Email',
      href: 'mailto:hello@souville.dev'
    }, {
      label: /*#__PURE__*/React.createElement(Clock, null)
    }],
    columns: "1fr 1fr 1fr auto",
    style: {
      marginTop: -8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(HeadRow, {
    size: size,
    left: /*#__PURE__*/React.createElement(NavTile, {
      label: "About",
      index: "01",
      tone: "cream",
      height: 130,
      onClick: e => {
        e.preventDefault();
        onNav('about');
      }
    }),
    center: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-grotesk)',
        fontSize: size,
        lineHeight: .9,
        letterSpacing: '-.035em'
      }
    }, "French"),
    right: /*#__PURE__*/React.createElement(NavTile, {
      label: "Projects",
      index: "02",
      tone: "red",
      height: 130,
      onClick: e => {
        e.preventDefault();
        onNav('projects');
      }
    })
  }), /*#__PURE__*/React.createElement(HeadRow, {
    size: size,
    left: "Frontend",
    right: "Developer",
    center: null
  }), /*#__PURE__*/React.createElement(HeadRow, {
    size: size,
    left: "Based",
    right: "in Montreal",
    center: /*#__PURE__*/React.createElement(NavTile, {
      label: "Contact",
      index: "03",
      tone: "amber",
      height: 125,
      onClick: e => {
        e.preventDefault();
        onNav('contact');
      }
    })
  })));
}
Object.assign(window, {
  Hero,
  Clock
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Projects.jsx
try { (() => {
const {
  Label,
  Rule,
  Button
} = window.SouvilleEditorialDesignSystem_56079d;
const PROJECTS = [{
  n: '01',
  name: 'Maison Clairval',
  role: 'Design & build',
  year: '2025',
  tone: 'var(--cream-100)'
}, {
  n: '02',
  name: 'Atelier Nord',
  role: 'Front-end',
  year: '2025',
  tone: 'var(--amber-500)'
}, {
  n: '03',
  name: 'LG2 — Rebrand site',
  role: 'Front-end lead',
  year: '2024',
  tone: 'var(--red-500)'
}, {
  n: '04',
  name: 'Revue Papier',
  role: 'Design & build',
  year: '2024',
  tone: 'var(--clay-100)'
}];
function ProjectRow({
  p
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr 1fr 80px',
      alignItems: 'center',
      gap: 'var(--space-4)',
      borderBottom: '1px solid var(--rule)',
      padding: '18px 0',
      cursor: 'pointer',
      background: hover ? p.tone : 'transparent',
      transition: 'background var(--dur-base) var(--ease-editorial)',
      paddingLeft: hover ? 12 : 0,
      paddingRight: hover ? 12 : 0
    }
  }, /*#__PURE__*/React.createElement(Label, {
    tone: "muted"
  }, p.n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-grotesk)',
      fontSize: 'clamp(1.4rem,3vw,2.6rem)',
      letterSpacing: '-.03em',
      lineHeight: 1
    }
  }, p.name), /*#__PURE__*/React.createElement(Label, null, p.role), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Label, null, p.year)));
}
function Projects() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    tone: "ink"
  }), /*#__PURE__*/React.createElement(Label, null, "Selected work \u2014 2024/2025"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, PROJECTS.map(p => /*#__PURE__*/React.createElement(ProjectRow, {
    key: p.n,
    p: p
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ink",
    size: "lg"
  }, "Full archive")));
}
Object.assign(window, {
  Projects
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Projects.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.DisplayRow = __ds_scope.DisplayRow;

__ds_ns.MetaBar = __ds_scope.MetaBar;

__ds_ns.NavTile = __ds_scope.NavTile;

__ds_ns.Wordmark = __ds_scope.Wordmark;

})();
