export function InfoSection() {
  return (
    <section className="flex h-screen snap-start flex-col justify-between px-6 py-12 text-center">
      {/* 中间居中的信息块 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-bold md:text-3xl">关于本项目</h2>
          <p className="text-muted-foreground text-base">
            White Board
            是一个专注于战略分析与团队协作的可视化白板工具，致力于帮助企业更高效地做出决策。
          </p>
          <p className="text-muted-foreground text-base">
            项目地址：
            <a
              href="https://github.com/jsndkm/white-board"
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub - white-board
            </a>
          </p>
          <p className="text-muted-foreground text-base">
            联系方式：123@123.com
          </p>
          <p className="text-muted-foreground text-base">
            技术栈：Next.js + Tailwind CSS + ShadCN + Excalidraw
          </p>
        </div>
      </div>

      {/* 底部版权 */}
      <footer className="text-muted-foreground w-full border-t pt-6 text-center text-sm">
        © 2025 White Board. All rights reserved.
      </footer>
    </section>
  );
}
