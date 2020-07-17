const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const fileType = require('file-type');

const defaultOpts = {
  match: /\.(png|jpe?g)$/,
  // https://sharp.pixelplumbing.com/api-output#webp
  webp: {
    quality: 80,
  },
  limit: 0,
  disable: false,
};

function getIconPath(pathSrc) {
  const pathManifest = path.join(pathSrc, 'manifest.json');
  const manifestCont = fs.readFileSync(pathManifest, 'utf8');

  const { icon } = JSON.parse(manifestCont);
  let iconPath = '';
  if (icon) iconPath = path.join(pathSrc, icon);
  return iconPath;
}

function getImageFiles(opts, filepath, exceptFiles) {
  const { match, limit } = opts;
  const files = [];
  const stat = fs.lstatSync(filepath);
  if (stat.isDirectory()) {
    fs.readdirSync(filepath).forEach((filename) => {
      files.push(
        ...getImageFiles(opts, path.join(filepath, filename), exceptFiles),
      );
    });
  } else if (stat.isFile()) {
    if (
      stat.size > limit
      && match.test(filepath)
      && !/.+\.9\.png$/.test(filepath)
      && exceptFiles.indexOf(filepath) === -1
    ) { files.push(filepath); }
  }
  return files;
}

async function canConvert(filepath) {
  const type = await fileType.fromFile(filepath);
  if (!type) return false;
  return type.ext === 'png' || type.ext === 'jpg';
}

async function convertWebp(webpOpts, filepath) {
  const data = await sharp(filepath)
    .webp(webpOpts)
    .toBuffer();

  fs.writeFileSync(filepath, data);
}

module.exports = class QappWebpWebpackPlugin {
  constructor(opts) {
    this.opts = { ...defaultOpts, ...opts };
  }

  apply(compiler) {
    const { output } = compiler.options;
    const { disable } = this.opts;
    if (disable) return;

    compiler.hooks.emit.tapAsync(
      'QappWebpWebpackPlugin',
      async (compilation, callback) => {
        const iconPath = getIconPath(output.path);
        const files = getImageFiles(this.opts, output.path, [iconPath]);
        await Promise.all(
          files.map(async (filepath) => {
            const res = await canConvert(filepath);
            if (res) await convertWebp(this.opts.webp, filepath);
          }),
        );
        callback();
      },
    );
  }
};
