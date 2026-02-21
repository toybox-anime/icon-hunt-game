// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CHARACTERS, Character } from "@/lib/characters";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Game() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [target, setTarget] = useState<Character | null>(null);
  const [gridChars, setGridChars] = useState<Character[]>([]);
  const [level, setLevel] = useState(1);

  // ゲーム開始・次のレベルへ
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Fisher-Yates シャッフル
  const shuffle = <T,>(arr: T[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startLevel = useCallback((levelOverride?: number) => {
    const useLevel = typeof levelOverride === "number" ? levelOverride : level;
    // 難易度調整: レベルが上がると選択肢が増える（最大16個）
    const count = Math.min(4 + useLevel, 16);

    // キャラをランダムに選出
    const shuffled = shuffle(CHARACTERS);
    const selected = shuffled.slice(0, count);

    // 正解ターゲットを決める
    const newTarget = selected[Math.floor(Math.random() * selected.length)];

    // グリッドに並べる
    setGridChars(shuffle(selected));
    setTarget(newTarget);
    setTimeLeft(10); // 時間リセット
    endTimeRef.current = Date.now() + 10000; // 10s
  }, [level]);

  // ゲームスタート処理
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setIsPlaying(true);
    startLevel(1);
  };

  // タイマー処理
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = () => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(0, (endTimeRef.current - Date.now()) / 1000);
      setTimeLeft(+remaining.toFixed(1));
      if (remaining <= 0) {
        setIsPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying]);

  // タップした時の判定
  const handleTap = (char: Character) => {
    if (!target) return;

    if (char.id === target.id) {
      // 正解！🎉
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setScore((prev) => prev + Math.floor(timeLeft * 100) + 1000); // タイムボーナス付き
      setLevel((prev) => prev + 1);
      startLevel();
    } else {
      // 不正解...💥 ペナルティで時間を減らす
      setTimeLeft((prev) => Math.max(0, prev - 2));
      
      // 画面を揺らす（バイブレーション）
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  };

  return (
    <main className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 font-sans select-none">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          // 🏁 タイトル画面 / リザルト画面
          <motion.div 
            key="title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full"
          >
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
          </motion.div>
        ) : (
          // 🎮 ゲームプレイ画面
          <motion.div 
            key="game"
            className="w-full max-w-md flex flex-col items-center gap-6"
          >
            {/* 上部ステータス */}
            <div className="w-full flex justify-between items-end px-2">
              <div className="text-sky-800 font-bold text-xl">Lv.{level}</div>
              <div className="text-sky-600 font-bold text-2xl">{score.toLocaleString()}</div>
            </div>

            {/* お題表示エリア */}
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center w-full border-4 border-sky-100">
              <p className="text-gray-400 text-sm font-bold mb-1">さがしてね！</p>
              <div className="text-6xl animate-bounce">{target?.image}</div>
              <div className="text-xl font-bold text-gray-700 mt-2">{target?.name}</div>
            </div>

            {/* 残り時間バー */}
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${timeLeft < 3 ? 'bg-red-500' : 'bg-sky-500'}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>

            {/* アイコン一覧（グリッド） */}
            <div className="grid grid-cols-4 gap-3 w-full">
              {gridChars.map((char) => (
                <motion.button
                  key={char.id}
                  whileTap={{ scale: 0.8 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => handleTap(char)}
                  aria-label={char.name}
                  className={`aspect-square flex items-center justify-center text-4xl bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 ${char.color}`}
                >
                  {char.image}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}