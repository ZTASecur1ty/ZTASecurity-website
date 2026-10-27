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
const LOGO_PATH =
  'M32 4c7 3.6 14.2 5.8 22 6.6V30c0 14.2-9.4 24.6-22 30C19.4 54.6 10 44.2 10 30V10.6C17.8 9.8 25 7.6 32 4Zm-11.5 13v4.8h16L20.5 37.2V42h23v-4.8H27.5l16-15.4V17h-23Z';

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
        <svg width="48" height="52" viewBox="4 2 56 60"><path fill="${INK}" fill-rule="evenodd" d="${LOGO_PATH}" /></svg>
        <div tw="flex ml-4 text-4xl" style="font-family:Serif;letter-spacing:-0.02em;">ZTA Security</div>
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
