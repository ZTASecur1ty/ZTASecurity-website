import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import InterRegular from '@fontsource/inter/files/inter-latin-400-normal.woff';
import SerifMedium from '@fontsource/source-serif-4/files/source-serif-4-latin-500-normal.woff';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const dimensions = {
  width: 1200,
  height: 630,
};

const INK = '#141413';
const MUTED = '#5E5D59';
const PAPER = '#F0EEE6';
// Cropped, transparent ZTA lockup (1510x566).
const LOGO_DATA_URI =
  'data:image/png;base64,' +
  fs.readFileSync(path.join(process.cwd(), 'public/ZTA-logo.png')).toString('base64');

interface Props {
  title: string;
  pubDate: Date;
  description: string;
  tags: string[];
}

export async function GET(context: APIContext) {
  const { title, pubDate, description, tags } = context.props as Props;
  const date = pubDate.toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' });

  const markup = html`
    <div tw="flex flex-col w-full h-full p-20 justify-between" style="background:${PAPER};color:${INK};font-family:Inter;">
      <div tw="flex items-center">
        <img width="160" height="60" src="${LOGO_DATA_URI}" />
      </div>
      <div tw="flex flex-col">
        <div tw="flex text-2xl" style="color:${MUTED};">${date}</div>
        <div tw="flex mt-4 text-6xl leading-tight" style="font-family:Serif;letter-spacing:-0.02em;">${title}</div>
        <div tw="flex mt-6 text-2xl leading-normal" style="color:${MUTED};">${description}</div>
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    fonts: [
      {
        name: 'Inter',
        data: Buffer.from(InterRegular),
        weight: 400,
      },
      {
        name: 'Serif',
        data: Buffer.from(SerifMedium),
        weight: 500,
      },
    ],
    height: dimensions.height,
    width: dimensions.width,
  });

  const png = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: dimensions.width,
    },
  })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': png.length.toString(),
      'Surrogate-Key': tags.join(' '),
      'Query-String-Hash': 'image',
      'Cache-Tag': 'image',
      'Keep-Alive': 'timeout=5, max=1000',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: {
      slug: post.slug,
    },
    props: {
      title: post.data.title,
      pubDate: post.data.updatedDate ?? post.data.pubDate,
      description: post.data.description,
      tags: post.data.tags,
    },
  }));
}
