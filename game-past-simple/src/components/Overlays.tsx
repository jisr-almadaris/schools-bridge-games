import { MEMORIES } from "../data";
import { Btn, MemoryFrame, Modal } from "./ui";
import { speak } from "../audio";

/* ---------- دليل الزمن 📘 ---------- */
export function TimeGuide({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="دليل الزمن 📘⏳">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-[#f7c948] bg-white p-4 text-center shadow">
          <div className="text-4xl">⏳</div>
          <h3 className="mt-1 text-lg font-black text-[#4b2f8f]">
            متى نستخدم <span className="en">Past Simple</span>؟
          </h3>
          <p className="mt-1 font-bold text-[#2a2760]">لشيء حدث وانتهى في الماضي.</p>
          <p className="en mt-2 rounded-xl bg-[#fff3cc] px-2 py-1 text-lg font-bold text-[#4b2f8f]">Yesterday, I played.</p>
        </div>
        <div className="rounded-2xl border-2 border-[#7fe3d8] bg-white p-4 text-center shadow">
          <div className="text-4xl">⚙️</div>
          <h3 className="mt-1 text-lg font-black text-[#0b5f55]">
            أفعال + <span className="ed en">ed</span>
          </h3>
          <div className="en mt-2 space-y-1 text-lg font-bold text-[#2a2760]">
            <div>play → play<span className="ed">ed</span></div>
            <div>watch → watch<span className="ed">ed</span></div>
            <div>visit → visit<span className="ed">ed</span></div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-[#c9962b] bg-gradient-to-b from-[#fff8dc] to-white p-4 text-center shadow">
          <div className="text-4xl">⭐</div>
          <h3 className="mt-1 text-lg font-black text-[#c9962b]">أفعال مميزة</h3>
          <div className="en mt-2 space-y-1 text-lg font-bold text-[#2a2760]">
            <div>go → <span className="text-[#e0457b]">went</span></div>
            <div>eat → <span className="text-[#e0457b]">ate</span></div>
            <div>see → <span className="text-[#e0457b]">saw</span></div>
            <div>have → <span className="text-[#e0457b]">had</span></div>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[#4b2f8f] p-4 text-center text-white">
        <div className="en text-xl font-bold">I played. &nbsp; She played. &nbsp; They played.</div>
        <div className="mt-1 text-lg font-black text-[#ffe08a]">«نفس صيغة الماضي مع الجميع ⭐»</div>
      </div>
      <div className="mt-5 text-center">
        <Btn onClick={onClose} className="text-xl">
          فهمت، أعود إلى المتحف ⏳
        </Btn>
      </div>
    </Modal>
  );
}

/* ---------- الألبوم 📖 ---------- */
export function AlbumModal({ collected, onClose }: { collected: string[]; onClose: () => void }) {
  return (
    <Modal onClose={onClose} title={<span>My Yesterday Album 📖</span>}>
      <p className="text-center font-bold text-[#7c5cc4]">ذكرياتي التي جمعتها ({collected.length} / {MEMORIES.length})</p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {MEMORIES.map((m) => {
          const has = collected.includes(m.id);
          return (
            <div key={m.id} className={`flex flex-col items-center ${has ? "" : "opacity-50 grayscale"}`}>
              <MemoryFrame
                src={has ? m.image : undefined}
                emoji={has ? undefined : "🔒"}
                size="sm"
                onClick={has ? () => speak(m.sentence) : undefined}
                caption={
                  <div className="en text-center">
                    <div className="text-sm font-bold text-[#4b2f8f]">{m.emoji} {has ? m.label : "?"}</div>
                    {has && <div className="text-xs font-semibold text-[#2a2760]">{m.sentence}</div>}
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm font-bold text-[#7c5cc4]">اضغطي على الصورة لتسمعي الجملة 🔊</p>
      <div className="mt-4 text-center">
        <Btn onClick={onClose} variant="violet">
          إغلاق الألبوم
        </Btn>
      </div>
    </Modal>
  );
}

/* ---------- ذكرى جديدة أُضيفت ---------- */
export function MemoryToast({ id }: { id: string }) {
  const m = MEMORIES.find((x) => x.id === id);
  if (!m) return null;
  return (
    <div className="anim-pop fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-2xl border-4 border-[#f7c948] bg-white px-5 py-3 text-center shadow-2xl">
      <div className="text-sm font-black text-[#c9962b]">ذكرى جديدة في ألبومكِ 📖</div>
      <div className="en text-xl font-bold text-[#4b2f8f]">
        {m.emoji} {m.label}
      </div>
    </div>
  );
}
