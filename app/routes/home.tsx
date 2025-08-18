import type { LoaderFunctionArgs } from "react-router";
import Header from "../components/shared/header";
import SidebarTree from "../components/shared/sidebar";
import { ConfluenceApi } from "~/services/confluence";
import type { Route } from "./+types/home";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import React, { useState } from "react";
import type { GetConfluenceChild } from "~/types/confluence";

export async function clientLoader(_: LoaderFunctionArgs) {
  const confluence = new ConfluenceApi();

  async function fetchTree(pageId: number): Promise<GetConfluenceChild[]> {
    const res = await confluence.getConfluenceChildPages(pageId);
    const children = res.results || [];

    if (children.length === 0) return [];

    const childrenWithNested = await Promise.all(
      children.map(async (child: any) => ({
        ...child,
        id: String(child.id),
        children: await fetchTree(child.id),
      }))
    );

    return childrenWithNested;
  }

  const [ibidData, FMSData] = await Promise.all([
    fetchTree(2319810583),
    fetchTree(2436300880),
  ]);

  return { ibidData, FMSData };
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  );
}

function PageContent({ pageId }: { pageId: string }) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const confluence = new ConfluenceApi();
    setLoading(true);
    setPage(null);
    confluence
      .getConfluencePageById(pageId)
      .then((res) => setPage(res))
      .finally(() => setLoading(false));
  }, [pageId]);

  if (loading) {
    return (
      <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
    );
  }

  if (!page) {
    return <p className="text-red-500">Page not found</p>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: page.body.styled_view.value,
      }}
    />
  );
}

function findPath(tree: GetConfluenceChild[], targetId: string): GetConfluenceChild[] | null {
  for (const node of tree) {
    if (node.id === targetId) {
      return [node]; // found it
    }
    if (node.children) {
      const childPath = findPath(node.children, targetId);
      if (childPath) {
        return [node, ...childPath]; // prepend parent
      }
    }
  }
  return null;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { ibidData, FMSData } = loaderData;
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<GetConfluenceChild[]>([]);

  const products = [
    { key: "ibid", title: "IBID", data: ibidData },
    { key: "astrafms", title: "AstraFMS 2.0", data: FMSData },
  ];

  const handleSelectPage = (pageId: string) => {
    setSelectedPage(pageId);

    let path = findPath(ibidData, pageId);
    if (!path) path = findPath(FMSData, pageId);

    if (path) setBreadcrumbPath(path);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-row w-full">
        <SidebarTree
          products={products}
          isRoot={true}
          data={[]}
          onSelectPage={handleSelectPage}
        />
        <div className="flex flex-col w-2/3 pl-8 pt-5">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbPath.length > 0 && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                      {
                        products.find((p) =>
                          findPath(p.data, breadcrumbPath[0].id)
                        )?.title
                      }
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}

              {breadcrumbPath.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <BreadcrumbItem>
                    {idx === breadcrumbPath.length - 1 ? (
                      <BreadcrumbPage>{node.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="#">{node.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="pt-5">
            {selectedPage ? (
              <PageContent pageId={selectedPage} />
            ) : (
              <p className="text-gray-400">Select a page from sidebar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
