import type { GetConfluenceChild } from "~/types/confluence";
import Accordion from "../../components/ui/accordion";

interface SidebarTreeProps {
  data: GetConfluenceChild[];
  isRoot?: boolean;
  products?: { key: string; title: string; data: GetConfluenceChild[] }[];
  onSelectPage?: (id: string) => void;
}

const SidebarTree = ({ data, isRoot = false, products, onSelectPage }: SidebarTreeProps) => {
  return (
    <div className={isRoot ? "flex flex-col w-1/3 pl-8 pt-5" : "flex flex-col pl-8"}>
      <div>
        {isRoot && <p className="text-[#BDBDBD] text-sm font-light tracking-wide">Product</p>}
        {isRoot ? (
          products?.map(product => (
            <Accordion key={product.key} title={product.title}>
              <SidebarTree data={product.data} isRoot={false} onSelectPage={onSelectPage} />
            </Accordion>
          ))
        ) : (
          data.map((page) => (
            <Accordion key={page.id} title={page.title}>
              {page.children && page.children.length > 0 ? (
                <SidebarTree data={page.children} isRoot={false} onSelectPage={onSelectPage} />
              ) : (
                <div
                  className="pl-6 pt-2 cursor-pointer hover:text-blue-500"
                  onClick={() => onSelectPage?.(String(page.id))}
                >
                  <p className="font-light">{page.title}</p>
                </div>
              )}
            </Accordion>
          ))
        )}
      </div>
    </div>
  );
};
export default SidebarTree;
