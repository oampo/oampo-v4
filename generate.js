#! /usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const util = require("util");

const chokidar = require("chokidar");
const glob = util.promisify(require("glob"));
const minify = require('html-minifier').minify;
const matter = require("gray-matter");
const ignore = require("ignore");
const { Liquid } = require("liquidjs");
const liveServer = require("live-server");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const DEFAULT_CONFIG = {
  srcDir: "src",
  templateDir: "src/templates",
  outputDir: "build",
  ignore: ["src/templates"],
};

function readConfig() {
  return { ...DEFAULT_CONFIG };
}

function make_engine(config) {
  const engine = new Liquid({
    root: [path.resolve(__dirname, config.templateDir)],
    extname: ".liquid",
  });

  engine.registerTag("include_file", {
    parse: function (tagToken, remainTokens) {
      this.fileName = tagToken.args;
    },
    render: async function (scope, hash) {
      let content = await fs.readFile(
        path.join(config.srcDir, this.fileName),
        "utf-8"
      );
      return content;
    },
  });
  return engine;
}

async function render(engine, context, templateName) {
  let result = await engine.renderFile(templateName, context);
  return result;
}

async function build(engine, file, config) {
  const content = await fs.readFile(file);
  const frontMatter = matter(content);
  let output;
  if (frontMatter.data.template) {
    try {
      output = await render(
        engine,
        { ...config, content: frontMatter.content.toString() },
        frontMatter.data.template
      );
    } catch (e) {
      console.error(e);
      return;
    }
  } else {
    output = content;
  }

  let outputFile = path.join(
    config.outputDir,
    path.relative(config.srcDir, file)
  );

  if (path.extname(outputFile) === ".html") {
    output = minify(output.toString(), {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
    });
  }
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, output);
}

async function buildAll(engine, config) {
  let files = await glob(path.join(config.srcDir, "**", "*"), {
    nodir: true,
  });
  const ig = ignore().add(config.ignore);
  files = ig.filter(files);

  files.forEach((file) => {
    build(engine, file, config);
  });
}

function getArgs() {
  return yargs(hideBin(process.argv))
    .scriptName("oampo")
    .usage("$0 [args]")
    .option("w", { alias: "watch", type: "boolean" })
    .help().argv;
}

async function main() {
  const args = getArgs();
  const config = readConfig();
  const engine = make_engine(config);

  if (args.watch) {
    chokidar
      .watch(config.srcDir)
      .on("add", async (event, path) => await buildAll(engine, config))
      .on("change", async (event, path) => await buildAll(engine, config))
      .on("unlink", async (event, path) => await buildAll(engine, config));

    liveServer.start({
      port: 3000,
      root: config.outputDir,
      open: false
    });

  } else {
    await buildAll(engine, config);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e);
  }
}
