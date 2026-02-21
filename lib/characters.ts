// src/lib/characters.ts

export type Character = {
  id: string;
  name: string;
  image: string; // 画像パス または 絵文字
  color: string; // 背景色など演出用
};

// ここにこだわりのキャラクターを登録！
// ※将来的に public/images/cat.png などの画像パスに変更可能
export const CHARACTERS: Character[] = [
  { id: 'cat', name: 'ネコ', image: '🐱', color: 'bg-orange-100' },
  { id: 'dog', name: 'イヌ', image: '🐶', color: 'bg-blue-100' },
  { id: 'rabbit', name: 'ウサギ', image: '🐰', color: 'bg-pink-100' },
  { id: 'fox', name: 'キツネ', image: '🦊', color: 'bg-yellow-100' },
  { id: 'bear', name: 'クマ', image: '🐻', color: 'bg-amber-200' },
  { id: 'panda', name: 'パンダ', image: '🐼', color: 'bg-gray-100' },
  { id: 'koala', name: 'コアラ', image: '🐨', color: 'bg-slate-100' },
  { id: 'tiger', name: 'トラ', image: '🐯', color: 'bg-amber-100' },
];