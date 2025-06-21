"use client";

import React, { useContext } from "react";
import { useElementPosition } from "@/hooks/useElementPosition";
import { AdminContext } from "../ShortlinksContainer";
import LinkCard from "../Menu/Link/index";

function AdminMenu() {
  const [position, ref] = useElementPosition();
  const { data } = useContext(AdminContext);

  return (
    <div
      className="md:max-h-80 overflow-y-auto transition-all"
      ref={ref}
      style={{
        opacity: position.top ? 1 : 0,
      }}
    >
      <div className="flex flex-col w-full gap-2 pt-2">        {data && data.length > 0 ? (
          data.map((item) => <LinkCard key={item.id} item={item} />)
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No shortlinks created yet
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMenu;
