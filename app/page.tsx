"use client";

import { useState, useEffect, useCallback } from "react";
import { CHARACTERS, Character } from "@/lib/characters";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// 💡 新しい型：大量にコピーして並べるため、一人ひとりに固有のID（uniqueId）を持たせる
type GridCharacter = Character & { uniqueId: string };

export default function Game() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [target, setTarget] = useState<Character | null>(null);
  const [gridChars, setGridChars] = useState<GridCharacter[]>([]);
  const [level, setLevel] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // ゲーム開始・次のレベルへ
  const startLevel = useCallback(() => {
    // 💡 画面を埋め尽くすために、レベルが上がるごとにアイコンの数を増やす（最初25個、最大60個）
    const count = Math.min(20 + level * 5, 60); 
    
    // 正解（ターゲット）を1つ選ぶ
    const newTarget = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    
    // 画面に並べるアイコンのリストを作成
    const newGrid: GridCharacter[] = [];
    
    // ① まず、正解を「1つだけ」確実に入れる
    newGrid.push({ ...newTarget, uniqueId: Math.random().toString() });
    
    // ② 残りのマスを、正解「以外」のキャラクターで埋め尽くす（ダミー）
    const others = CHARACTERS.filter(c => c.id !== newTarget.id);
    for(let i = 1; i < count; i++) {
       const randomDummy = others[Math.floor(Math.random() * others.length)];
       newGrid.push({ ...randomDummy, uniqueId: Math.random().toString() });
    }
    
    // ③ 作ったリストをシャッフル（バラバラに）する
    setGridChars(newGrid.sort(() => 0.5 - Math.random()));
    setTarget(newTarget);
    setTimeLeft(10); // 時間リセット
  }, [level]);

  // ゲームスタート処理
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setIsPlaying(true);
    startLevel();
  };

  // タイマー処理（1秒ごとに減らす）
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setIsPlaying(false); // ゲームオーバー
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // タップした時の判定
  const handleTap = (char: GridCharacter) => {
    if (!target || isAnimating) return;

    if (char.id === target.id) {
      // 🎉 正解！
      setIsAnimating(true);
      confetti({ 
        particleCount: 100,  // 数を倍増（50 👉 100）
        spread: 80,          // 広がる角度を広く（60 👉 80）
        origin: { y: 0.6 },  // 少し高めの位置から飛ばす（0.7 👉 0.6）
        scalar: 1.5          // 👈 【重要】粒のサイズを1.5倍に巨大化！
      });      
      setScore((prev) => prev + Math.floor(timeLeft * 100) + 1000);

      // 0.8秒待ってから次へ
      setTimeout(() => {
        confetti.reset();
        setLevel((prev) => prev + 1);
        startLevel();
        setIsAnimating(false);
      }, 800);
      
    } else {
      // 💥 不正解！
      setTimeLeft((prev) => Math.max(0, prev - 2));
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  };

  return (
    // 💡 `h-[100dvh]` でスマホ画面の高さいっぱいにし、`overflow-hidden` で外枠をなくす
    <main className="h-[100dvh] bg-sky-50 flex flex-col font-sans select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          // 🏁 タイトル画面（ここはそのまま）
          <motion.div 
            key="title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-4"
          >
            <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full">
              <h1 className="text-4xl font-bold text-sky-600 mb-2">Icon Hunt</h1>
              <p className="text-gray-500 mb-6">同じアイコンを探せ！</p>
              
              {score > 0 && (
                <div className="mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-bold">SCORE</p>
                  <p className="text-4xl font-black text-yellow-600">{score.toLocaleString()}</p>
                </div>
              )}

              <button
                onClick={startGame}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl text-xl transition shadow-md active:scale-95"
              >
                {score > 0 ? "もう一度遊ぶ" : "スタート！"}
              </button>
            </div>
          </motion.div>
        ) : (
          // 🎮 ゲームプレイ画面（フルスクリーン・枠なし版）
          <motion.div 
            key="game"
            className="flex flex-col h-full w-full"
          >
            {/* 💡 ヘッダー（お題とスコアをスッキリと上部に配置） */}
            <div className="flex justify-between items-center px-4 py-3 bg-white/60 backdrop-blur-md z-10 shadow-sm">
              <div className="text-sky-800 font-bold text-lg">Lv.{level}</div>
              <div className="flex items-center gap-2">
                <p className="text-gray-600 font-bold text-sm">さがせ👉</p>
                <div className="text-4xl animate-bounce">{target?.image}</div>
              </div>
              <div className="text-sky-600 font-bold text-xl">{score.toLocaleString()}</div>
            </div>

            {/* 残り時間バー（ヘッダーの下に細く配置） */}
            <div className="w-full h-2 bg-gray-200">
              <motion.div 
                className={`h-full ${timeLeft < 3 ? 'bg-red-500' : 'bg-sky-500'}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>

            {/* 💡 アイコン一覧（枠線を消して、画面いっぱいに並べる） */}
            <div className="flex-1 w-full p-2 overflow-y-auto">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 pb-10">
                {gridChars.map((char) => (
                  <motion.button
                    key={char.uniqueId}
                    whileTap={{ scale: 0.7 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => handleTap(char)}
                    // 枠線や白い背景を完全に削除し、文字サイズを巨大化
                    className="aspect-square flex items-center justify-center text-5xl bg-transparent active:opacity-50"
                  >
                    {char.image}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}