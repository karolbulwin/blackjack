const sharp = require('sharp');

const imgTitles = [
  'icon.png'
];

const prefix = 'favicon';

const resizeList = [
  { width: 48, height: 48, title: 48 },
  { width: 128, height: 128, title: 128 },
  { width: 256, height: 256, title: 256 },
  { width: 384, height: 384, title: 384 },
  { width: 512, height: 512, title: 512 }
];

imgTitles.forEach((img) => {
  const inputBuffer = `public/images/icons/${img}`;

  let imgTitle = inputBuffer.split('public/images/icons/');
  imgTitle = imgTitle[1].split('.');
  imgTitle = imgTitle[0].toLowerCase();

  resizeList.forEach((size) => {
    sharp(inputBuffer)
      .resize(size.width, size.height)
      .toFile(`${prefix}${imgTitle}-${size.title}.png`, (err) => {
        console.log(err);
      });
  });
});
