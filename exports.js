import {createSSRApp} from "vue";
import {renderToString} from "vue/server-renderer";
import {parse} from  "vue/compiler-sfc";

import {app, DOMParser, http404} from "primate";
import {File} from "runtime-compat";

const ending = ".vue";

const {"paths": {"components": path}} = app.conf;
const components = {};
if (await File.exists(path)) {
  await Promise.all(
    (await File.list(path))
    .filter(name => name.endsWith(ending))
    .map(async name => {
      const sfc = await File.read(`${path}/${name}`);
      const {descriptor} = parse(sfc);
      components[name.slice(0, -4)] = {"template": descriptor.template.content};
    }));
}

const render = (template, attributes) => {
  console.log("attributes", attributes);
  const app = createSSRApp({"data": () => attributes, template});
  for (const [key, value] of Object.entries(components)) {
    app.component(key, value);
  }
  return renderToString(app);
};

const last = -1;
export default async (strings, ...keys) => {
  const tag = (await DOMParser.parse(strings
    .slice(0, last)
    .map((string, i) => `${string}$${i}`)
    .join("") + strings[strings.length+last], await Promise.all(keys)))
    .children[0];
  const {tag_name, attributes} = tag;
  if (components[tag_name] !== undefined) {
    const component = components[tag_name].template;
    const html = await render(component, attributes);
    const body = app.index.replace("<body>", () => `<body>${html}`);
    const code = 200;
    const headers = {"Content-Type": "text/html"};
    return {body, code, headers};
  } else {
    return http404;
  }
};
