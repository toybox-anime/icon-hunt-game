import type { ReactNode } from 'react';

export type Character = {
  id: string;
  name: string;
  image: ReactNode; // 画像パスまたは絵文字やJSX要素
  color: string; // 背景色など演出用
};

// ここにこだわりのキャラクターを登録！
// ※将来的に public/images/cat.png などの画像パスに変更可能
export const CHARACTERS: Character[] = [
  {
    id: 'icon1',
    name: 'icon1',
    image: (
      <img
        src="/characters/icon1.png"
        alt="icon1"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon2',
    name: 'icon2',
    image: (
      <img
        src="/characters/icon2.png"
        alt="icon2"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon3',
    name: 'icon3',
    image: (
      <img
        src="/characters/icon3.png"
        alt="icon3"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon4',
    name: 'icon4',
    image: (
      <img
        src="/characters/icon4.png"
        alt="icon4"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon5',
    name: 'icon5',
    image: (
      <img
        src="/characters/icon5.png"
        alt="icon5"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon6',
    name: 'icon6',
    image: (
      <img
        src="/characters/icon6.png"
        alt="icon6"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
{
    id: 'icon7',
    name: 'icon7',
    image: (
      <img
        src="/characters/icon7.png"
        alt="icon7"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon8',
    name: 'icon8',
    image: (
      <img
        src="/characters/icon8.png"
        alt="icon8"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon10',
    name: 'icon10',
    image: (
      <img
        src="/characters/icon10.jpg"
        alt="icon10"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },
  {
    id: 'icon11',
    name: 'icon11',
    image: (
      <img
        src="/characters/icon11.jpg"
        alt="icon11"
        className="w-full h-full object-contain"
      />
    ),
    color: 'bg-orange-100',
  },

];

export default CHARACTERS;
