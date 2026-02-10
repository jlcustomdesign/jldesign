import { c as createComponent, ad as isHTMLString, r as renderComponent, b as renderTemplate, e as renderUniqueStylesheet, f as renderScriptElement, u as unescapeHTML, g as createHeadAndContent, h as createAstro } from './astro/server_DE-htoAq.mjs';
import 'piccolore';
import Markdoc from '@markdoc/markdoc';
import Slugger from 'github-slugger';
import { $ as $$Image } from './_astro_assets_DwSILDiV.mjs';

function renderTreeNodeToFactoryResult(result, treeNode) {
  if (Array.isArray(treeNode)) {
    return Promise.all(
      treeNode.map(
        (node) => renderComponent(result, "ComponentNode", ComponentNode, { treeNode: node })
      )
    );
  }
  if (treeNode.type === "text") return renderTemplate`${treeNode.content}`;
  const slots = {
    default: () => renderTemplate`${treeNode.children.map(
      (child) => renderComponent(result, "ComponentNode", ComponentNode, { treeNode: child })
    )}`
  };
  if (treeNode.type === "component") {
    let styles = "", links = "", scripts = "";
    if (Array.isArray(treeNode.collectedStyles)) {
      styles = treeNode.collectedStyles.map(
        (style) => renderUniqueStylesheet(result, {
          type: "inline",
          content: style
        })
      ).join("");
    }
    if (Array.isArray(treeNode.collectedLinks)) {
      links = treeNode.collectedLinks.map((link) => {
        return renderUniqueStylesheet(result, {
          type: "external",
          src: link[0] === "/" ? link : "/" + link
        });
      }).join("");
    }
    if (Array.isArray(treeNode.collectedScripts)) {
      scripts = treeNode.collectedScripts.map((script) => renderScriptElement(script)).join("");
    }
    const head = unescapeHTML(styles + links + scripts);
    let headAndContent = createHeadAndContent(
      head,
      renderTemplate`${renderComponent(
        result,
        treeNode.component.name,
        treeNode.component,
        treeNode.props,
        slots
      )}`
    );
    result._metadata.propagators.add({
      init() {
        return headAndContent;
      }
    });
    return headAndContent;
  }
  return renderComponent(result, treeNode.tag, treeNode.tag, treeNode.attributes, slots);
}
const ComponentNode = createComponent({
  factory(result, { treeNode }) {
    return renderTreeNodeToFactoryResult(result, treeNode);
  },
  propagation: "self"
});
async function createTreeNode(node) {
  if (Array.isArray(node)) {
    return Promise.all(node.map((child) => createTreeNode(child)));
  } else if (isHTMLString(node)) {
    return { type: "text", content: node };
  } else if (typeof node === "string" || typeof node === "number") {
    return { type: "text", content: String(node) };
  } else if (node === null || typeof node !== "object" || !Markdoc.Tag.isTag(node)) {
    return { type: "text", content: "" };
  }
  const children = await Promise.all(node.children.map((child) => createTreeNode(child)));
  if (typeof node.name === "function") {
    const component = node.name;
    const props = node.attributes;
    return {
      type: "component",
      component,
      props,
      children
    };
  } else if (isPropagatedAssetsModule(node.name)) {
    const { collectedStyles, collectedLinks, collectedScripts } = node.name;
    const component = (await node.name.getMod()).default;
    const props = node.attributes;
    return {
      type: "component",
      component,
      collectedStyles,
      collectedLinks,
      collectedScripts,
      props,
      children
    };
  } else {
    return {
      type: "element",
      tag: node.name,
      attributes: node.attributes,
      children
    };
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

const $$Astro = createAstro("https://jl-design.vercel.app");
const $$Renderer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Renderer;
  //! astro-head-inject
  const { stringifiedAst, config } = Astro2.props;
  const ast = Markdoc.Ast.fromJSON(stringifiedAst);
  const content = await Markdoc.transform(ast, config);
  const treeNode = await createTreeNode(content);
  return renderTemplate`${renderComponent($$result, "ComponentNode", ComponentNode, { "treeNode": treeNode })}`;
}, "/Users/robertgyorgy/JL Mobila/node_modules/@astrojs/markdoc/components/Renderer.astro", void 0);

class MarkdocError extends Error {
  loc;
  title;
  hint;
  frame;
  type = "MarkdocError";
  constructor(props, ...params) {
    super(...params);
    const { title = "MarkdocError", message, stack, location, hint, frame } = props;
    this.title = title;
    if (message) this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
}

function getSlug(attributes, children, headingSlugger, experimentalHeadingIdCompat) {
  if (attributes.id && typeof attributes.id === "string") {
    return attributes.id;
  }
  const textContent = attributes.content ?? getTextContent(children);
  let slug = headingSlugger.slug(textContent);
  if (!experimentalHeadingIdCompat) {
    if (slug.endsWith("-")) slug = slug.slice(0, -1);
  }
  return slug;
}
const heading = {
  children: ["inline"],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true, default: 1 }
  },
  transform(node, config) {
    const { level, ...attributes } = node.transformAttributes(config);
    const children = node.transformChildren(config);
    if (!config.ctx?.headingSlugger) {
      throw new MarkdocError({
        message: "Unexpected problem adding heading IDs to Markdoc file. Did you modify the `ctx.headingSlugger` property in your Markdoc config?"
      });
    }
    const slug = getSlug(
      attributes,
      children,
      config.ctx.headingSlugger,
      config.ctx.experimentalHeadingIdCompat
    );
    const render = config.nodes?.heading?.render ?? `h${level}`;
    const tagProps = (
      // For components, pass down `level` as a prop,
      // alongside `__collectHeading` for our `headings` collector.
      // Avoid accidentally rendering `level` as an HTML attribute otherwise!
      typeof render === "string" ? { ...attributes, id: slug } : { ...attributes, id: slug, __collectHeading: true, level }
    );
    return new Markdoc.Tag(render, tagProps, children);
  }
};
function setupHeadingConfig(experimentalHeadingIdCompat) {
  const headingSlugger = new Slugger();
  return {
    ctx: {
      headingSlugger,
      experimentalHeadingIdCompat
    },
    nodes: {
      heading
    }
  };
}

async function setupConfig(userConfig = {}, options, experimentalHeadingIdCompat) {
  let defaultConfig = setupHeadingConfig(experimentalHeadingIdCompat);
  if (userConfig.extends) {
    for (let extension of userConfig.extends) {
      if (extension instanceof Promise) {
        extension = await extension;
      }
      defaultConfig = mergeConfig(defaultConfig, extension);
    }
  }
  let merged = mergeConfig(defaultConfig, userConfig);
  return merged;
}
function setupConfigSync(userConfig = {}, options, experimentalHeadingIdCompat) {
  const defaultConfig = setupHeadingConfig(experimentalHeadingIdCompat);
  let merged = mergeConfig(defaultConfig, userConfig);
  return merged;
}
function mergeConfig(configA, configB) {
  return {
    ...configA,
    ...configB,
    ctx: {
      ...configA.ctx,
      ...configB.ctx
    },
    tags: {
      ...configA.tags,
      ...configB.tags
    },
    nodes: {
      ...configA.nodes,
      ...configB.nodes
    },
    functions: {
      ...configA.functions,
      ...configB.functions
    },
    variables: {
      ...configA.variables,
      ...configB.variables
    },
    partials: {
      ...configA.partials,
      ...configB.partials
    },
    validation: {
      ...configA.validation,
      ...configB.validation
    }
  };
}
function resolveComponentImports(markdocConfig, tagComponentMap, nodeComponentMap) {
  for (const [tag, render] of Object.entries(tagComponentMap)) {
    const config = markdocConfig.tags[tag];
    if (config) config.render = render;
  }
  for (const [node, render] of Object.entries(nodeComponentMap)) {
    const config = markdocConfig.nodes[node];
    if (config) config.render = render;
  }
  return markdocConfig;
}
function getTextContent(childNodes) {
  let text = "";
  for (const node of childNodes) {
    if (typeof node === "string" || typeof node === "number") {
      text += node;
    } else if (typeof node === "object" && Markdoc.Tag.isTag(node)) {
      text += getTextContent(node.children);
    }
  }
  return text;
}
const headingLevels = [1, 2, 3, 4, 5, 6];
function collectHeadings(children, collectedHeadings) {
  for (const node of children) {
    if (typeof node !== "object" || !Markdoc.Tag.isTag(node)) continue;
    if (node.attributes.__collectHeading === true && typeof node.attributes.level === "number") {
      collectedHeadings.push({
        slug: node.attributes.id,
        depth: node.attributes.level,
        text: getTextContent(node.children)
      });
      continue;
    }
    for (const level of headingLevels) {
      if (node.name === "h" + level) {
        collectedHeadings.push({
          slug: node.attributes.id,
          depth: level,
          text: getTextContent(node.children)
        });
      }
    }
    collectHeadings(node.children, collectedHeadings);
  }
}
function createGetHeadings(stringifiedAst, userConfig, options, experimentalHeadingIdCompat) {
  return function getHeadings() {
    const config = setupConfigSync(userConfig, options, experimentalHeadingIdCompat);
    const ast = Markdoc.Ast.fromJSON(stringifiedAst);
    const content = Markdoc.transform(ast, config);
    let collectedHeadings = [];
    collectHeadings(Array.isArray(content) ? content : [content], collectedHeadings);
    return collectedHeadings;
  };
}
function createContentComponent(Renderer, stringifiedAst, userConfig, options, tagComponentMap, nodeComponentMap, experimentalHeadingIdCompat) {
  return createComponent({
    async factory(result, props) {
      const withVariables = mergeConfig(userConfig, { variables: props });
      const config = resolveComponentImports(
        await setupConfig(withVariables, options, experimentalHeadingIdCompat),
        tagComponentMap,
        nodeComponentMap
      );
      return renderComponent(result, Renderer.name, Renderer, { stringifiedAst, config }, {});
    },
    propagation: "self"
  });
}

const assetsConfig = {
  nodes: {
    image: {
      attributes: {
        ...Markdoc.nodes.image.attributes,
        __optimizedSrc: { type: "Object" }
      },
      transform(node, config) {
        const attributes = node.transformAttributes(config);
        const children = node.transformChildren(config);
        if (node.type === "image" && "__optimizedSrc" in node.attributes) {
          const { __optimizedSrc, ...rest } = node.attributes;
          return new Markdoc.Tag($$Image, { ...rest, src: __optimizedSrc }, children);
        } else {
          return new Markdoc.Tag("img", attributes, children);
        }
      }
    }
  }
};

export { $$Renderer as $, createContentComponent as a, assetsConfig as b, createGetHeadings as c };
