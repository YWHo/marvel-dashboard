import clsx from "clsx";
import type { ReactNode, Ref } from "react";

type ListToolbarProps = {
  children?: ReactNode;
  className?: string;
  headingRef?: Ref<HTMLHeadingElement>;
  sticky?: boolean;
  title: string;
};

export function ListToolbar({
  children,
  className,
  headingRef,
  sticky = true,
  title,
}: ListToolbarProps) {
  return (
    <header
      className={clsx(
        "w-full border-b border-gray-700 bg-black/95 px-3 py-3 shadow-lg shadow-black/30 backdrop-blur-sm",
        sticky && "sticky top-12 z-40",
        className,
      )}
    >
      <h1
        ref={headingRef}
        tabIndex={headingRef ? -1 : undefined}
        className="text-center font-serif text-2xl font-extrabold text-blue-200 focus:outline-none sm:text-3xl"
      >
        {title}
      </h1>
      {children && (
        <div className="mt-3 flex justify-center">{children}</div>
      )}
    </header>
  );
}
